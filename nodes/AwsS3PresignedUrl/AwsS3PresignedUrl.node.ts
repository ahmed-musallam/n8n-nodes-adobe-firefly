import type {
  IExecuteFunctions,
  INodeType,
  INodeTypeDescription,
  IDataObject,
} from "n8n-workflow";
import { NodeConnectionTypes, ApplicationError } from "n8n-workflow";
import { generatePresignedUrl } from "./generatePresignedUrl";

export class AwsS3PresignedUrl implements INodeType {
  description: INodeTypeDescription = {
    displayName: "AWS S3 Presigned URL",
    name: "awsS3PresignedUrl",
    icon: "file:aws-s3.svg",
    group: ["transform"],
    version: 1,
    subtitle: "Generate presigned URLs for S3 objects",
    description:
      "Generate presigned URLs for downloading or uploading objects to AWS S3",
    defaults: {
      name: "AWS S3 Presigned URL",
    },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [
      {
        name: "aws",
        required: true,
      },
    ],
    properties: [
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        options: [
          {
            name: "Generate Presigned URL",
            value: "generatePresignedUrl",
            description: "Generate a presigned URL for an S3 object",
            action: "Generate presigned URL",
          },
        ],
        default: "generatePresignedUrl",
      },
      {
        displayName: "Bucket Name",
        name: "bucketName",
        type: "string",
        required: true,
        default: "",
        description: "The name of the S3 bucket",
        placeholder: "my-bucket",
      },
      {
        displayName: "Object Key",
        name: "objectKey",
        type: "string",
        required: true,
        default: "",
        description: "The key (path) of the S3 object",
        placeholder: "path/to/file.jpg",
      },
      {
        displayName: "Expires In (Seconds)",
        name: "expiresIn",
        type: "number",
        required: true,
        default: 3600,
        description: "URL expiration time in seconds (default: 1 hour)",
        typeOptions: {
          minValue: 1,
          maxValue: 604800, // 7 days
        },
      },
      {
        displayName: "Region",
        name: "region",
        type: "string",
        default: "",
        description: "AWS Region (overrides credential region if specified)",
        placeholder: "us-east-1",
      },
      {
        displayName: "Additional Options",
        name: "additionalOptions",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        options: [
          {
            displayName: "Response Content Type",
            name: "response-content-type",
            type: "string",
            default: "",
            description:
              "Sets the Content-Type header of the response (e.g., image/jpeg)",
            placeholder: "image/jpeg",
          },
          {
            displayName: "Response Content Disposition",
            name: "response-content-disposition",
            type: "string",
            default: "",
            description:
              'Sets the Content-Disposition header (e.g., attachment; filename="file.jpg")',
            placeholder: 'attachment; filename="file.jpg"',
          },
          {
            displayName: "Response Cache Control",
            name: "response-cache-control",
            type: "string",
            default: "",
            description: "Sets the Cache-Control header of the response",
            placeholder: "no-cache, no-store",
          },
          {
            displayName: "Custom Query Parameters",
            name: "customQueryParams",
            type: "fixedCollection",
            typeOptions: {
              multipleValues: true,
            },
            default: {},
            description: "Additional query parameters to include in the URL",
            options: [
              {
                name: "parameter",
                displayName: "Parameter",
                values: [
                  {
                    displayName: "Name",
                    name: "name",
                    type: "string",
                    default: "",
                    description: "Parameter name",
                  },
                  {
                    displayName: "Value",
                    name: "value",
                    type: "string",
                    default: "",
                    description: "Parameter value",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<{ json: IDataObject }[][]> {
    const items = this.getInputData();
    const returnData: IDataObject[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const operation = this.getNodeParameter("operation", i) as string;

        if (operation === "generatePresignedUrl") {
          const bucketName = this.getNodeParameter("bucketName", i) as string;
          const objectKey = this.getNodeParameter("objectKey", i) as string;
          const expiresIn = this.getNodeParameter("expiresIn", i) as number;
          const region = this.getNodeParameter("region", i, "") as string;
          const additionalOptions = this.getNodeParameter(
            "additionalOptions",
            i,
            {},
          ) as IDataObject;

          // Build query parameters
          const queryParams: IDataObject = {};

          // Add response headers if specified
          if (additionalOptions["response-content-type"]) {
            queryParams["response-content-type"] =
              additionalOptions["response-content-type"];
          }
          if (additionalOptions["response-content-disposition"]) {
            queryParams["response-content-disposition"] =
              additionalOptions["response-content-disposition"];
          }
          if (additionalOptions["response-cache-control"]) {
            queryParams["response-cache-control"] =
              additionalOptions["response-cache-control"];
          }

          // Add custom query parameters
          if (additionalOptions.customQueryParams) {
            const customParams =
              additionalOptions.customQueryParams as IDataObject;
            if (
              customParams.parameter &&
              Array.isArray(customParams.parameter)
            ) {
              customParams.parameter.forEach((param: any) => {
                if (param.name && param.value) {
                  queryParams[param.name] = param.value;
                }
              });
            }
          }

          // Generate presigned URL
          const presignedUrl = await generatePresignedUrl.call(
            this,
            bucketName,
            objectKey,
            expiresIn,
            queryParams,
            region || undefined,
          );

          returnData.push({
            bucketName,
            objectKey,
            expiresIn,
            region: region || "default",
            presignedUrl,
            expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
          });
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: (error as Error).message,
            },
          });
          continue;
        }
        throw new ApplicationError(
          `Failed to generate presigned URL: ${(error as Error).message}`,
          { level: "error" },
        );
      }
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}
