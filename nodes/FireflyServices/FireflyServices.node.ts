import {
  NodeConnectionTypes,
  type INodeType,
  type INodeTypeDescription,
  type IExecuteFunctions,
  type INodeExecutionData,
  type IDataObject,
  LoggerProxy as Logger,
  ApplicationError,
} from "n8n-workflow";
import { readFile } from "fs/promises";

import { IMSClient } from "../../clients/ims-client";
import {
  FireflyClient,
  type GenerateImagesV3AsyncRequest,
  type ModelVersion,
} from "../../clients/ffs-client";

export class FireflyServices implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Firefly Services",
    name: "fireflyServices",
    icon: {
      light: "file:fireflyServices.svg",
      dark: "file:fireflyServices.svg",
    },
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: "Interact with Adobe Firefly API",
    defaults: {
      name: "Firefly Services",
    },
    usableAsTool: true,
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [
      {
        name: "fireflyServicesApi",
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
            name: "Cancel Job",
            value: "cancelJob",
            description: "Cancel an async job",
            action: "Cancel async job",
          },
          {
            name: "Generate Images (Async)",
            value: "generateImagesAsync",
            description: "Generate images from text prompt asynchronously",
            action: "Generate images from text prompt",
          },
          {
            name: "Get Job Status",
            value: "getJobStatus",
            description: "Check the status of an async job",
            action: "Get async job status",
          },
          {
            name: "Upload Image",
            value: "uploadImage",
            description:
              "Upload an image to Firefly storage (valid for 7 days)",
            action: "Upload image to storage",
          },
        ],
        default: "generateImagesAsync",
      },
      // Generate Images Async parameters
      {
        displayName: "Prompt",
        name: "prompt",
        type: "string",
        required: true,
        default: "",
        placeholder: "A futuristic cityscape at sunset",
        description:
          "Text description of the image to generate (1-1024 characters). An error will be thrown if prompt exceeds 1024 characters.",
        typeOptions: {
          rows: 4,
          maxValue: 1024,
        },
        displayOptions: {
          show: {
            operation: ["generateImagesAsync"],
          },
        },
      },
      {
        displayName: "Model Version",
        name: "modelVersion",
        type: "options",
        options: [
          { name: "Image 3", value: "image3" },
          { name: "Image 3 Custom", value: "image3_custom" },
          { name: "Image 4 Custom", value: "image4_custom" },
          { name: "Image 4 Standard", value: "image4_standard" },
          { name: "Image 4 Ultra", value: "image4_ultra" },
        ],
        default: "image4_standard",
        description: "The Firefly model version to use",
        displayOptions: {
          show: {
            operation: ["generateImagesAsync"],
          },
        },
      },
      {
        displayName: "Additional Options",
        name: "additionalOptions",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        displayOptions: {
          show: {
            operation: ["generateImagesAsync"],
          },
        },
        options: [
          {
            displayName: "Content Class",
            name: "contentClass",
            type: "options",
            options: [
              { name: "Art", value: "art" },
              { name: "Photo", value: "photo" },
            ],
            default: "photo",
            description: "Style of content to generate",
          },
          {
            displayName: "Custom Model ID",
            name: "customModelId",
            type: "string",
            default: "",
            description: "Required when using custom model versions",
          },
          {
            displayName: "Image Size",
            name: "imageSize",
            type: "options",
            options: [
              {
                name: "1024x1024 (1:1 Square)",
                value: "1024x1024",
                description: "Smaller square - Image 3 only",
              },
              {
                name: "1152x896 (9:7)",
                value: "1152x896",
                description: "Horizontal format - Image 3 only",
              },
              {
                name: "1344x756 (7:4 Alt)",
                value: "1344x756",
                description: "Alternative wide format - Image 3 only",
              },
              {
                name: "1344x768 (7:4)",
                value: "1344x768",
                description: "Wide format - Image 3 only",
              },
              {
                name: "1440x2560 (9:16 Vertical)",
                value: "1440x2560",
                description: "Vertical video format - Image 4 only",
              },
              {
                name: "1792x2304 (3:4 Portrait)",
                value: "1792x2304",
                description: "Standard portrait - Compatible with all models",
              },
              {
                name: "2048x2048 (1:1 Square)",
                value: "2048x2048",
                description: "Square format - Compatible with all models",
              },
              {
                name: "2304x1792 (4:3 Landscape)",
                value: "2304x1792",
                description: "Standard landscape - Compatible with all models",
              },
              {
                name: "2688x1512 (16:9 Widescreen Alt)",
                value: "2688x1512",
                description: "Alternative widescreen - Image 3 only",
              },
              {
                name: "2688x1536 (16:9 Widescreen)",
                value: "2688x1536",
                description: "Widescreen - Compatible with all models",
              },
              {
                name: "896x1152 (7:9)",
                value: "896x1152",
                description: "Vertical format - Image 3 only",
              },
            ],
            default: "2048x2048",
            description: "Select the output image dimensions",
          },
          {
            displayName: "Negative Prompt",
            name: "negativePrompt",
            type: "string",
            default: "",
            description:
              "Things to avoid in the generated image (max 1024 characters). Follows the same handling as the main prompt.",
            typeOptions: {
              maxValue: 1024,
            },
          },
          {
            displayName: "Number of Variations",
            name: "numVariations",
            type: "number",
            default: 1,
            typeOptions: {
              minValue: 1,
              maxValue: 4,
            },
            description: "Number of image variations to generate (1-4)",
          },
          {
            displayName: "Seeds",
            name: "seeds",
            type: "string",
            default: "",
            placeholder: "12345, 67890",
            description:
              "Comma-separated seed image IDs for consistent image generation. Must match numVariations if specified.",
          },
          {
            displayName: "Structure Reference",
            name: "structureReference",
            type: "collection",
            default: {},
            placeholder: "Add Structure Reference",
            description:
              "Reference image for structure guidance. Controls how strictly Firefly adheres to the reference image structure.",
            options: [
              {
                displayName: "Source Type",
                name: "sourceType",
                type: "options",
                options: [
                  {
                    name: "URL",
                    value: "url",
                    description: "Use a presigned URL",
                  },
                  {
                    name: "Upload ID",
                    value: "uploadId",
                    description: "Use an upload ID from the storage API",
                  },
                ],
                default: "url",
                description: "Choose whether to use a URL or upload ID",
              },
              {
                displayName: "URL",
                name: "url",
                type: "string",
                default: "",
                placeholder: "https://example.amazonaws.com/image.jpg",
                description:
                  "Presigned URL of the reference image. Allowed domains: amazonaws.com, windows.net, dropboxusercontent.com, storage.googleapis.com.",
                displayOptions: {
                  show: {
                    sourceType: ["url"],
                  },
                },
              },
              {
                displayName: "Upload ID",
                name: "uploadId",
                type: "string",
                default: "",
                placeholder: "123e4567-e89b-12d3-a456-426614174000",
                description: "The upload ID from the storage API response",
                displayOptions: {
                  show: {
                    sourceType: ["uploadId"],
                  },
                },
              },
              {
                displayName: "Strength",
                name: "strength",
                type: "number",
                default: 50,
                typeOptions: {
                  minValue: 0,
                  maxValue: 100,
                },
                description:
                  "How strictly Firefly adheres to the reference image (0 = no adherence, 100 = full adherence)",
              },
            ],
          },
          {
            displayName: "Style Reference",
            name: "styleReference",
            type: "collection",
            default: {},
            placeholder: "Add Style Reference",
            description:
              "Reference image for style guidance. Controls how strictly Firefly adheres to the reference image style.",
            options: [
              {
                displayName: "Presets",
                name: "presets",
                type: "string",
                default: "",
                placeholder: "preset1, preset2",
                description:
                  "Comma-separated list of style preset IDs to apply",
              },
              {
                displayName: "Source Type",
                name: "sourceType",
                type: "options",
                options: [
                  {
                    name: "URL",
                    value: "url",
                    description: "Use a presigned URL",
                  },
                  {
                    name: "Upload ID",
                    value: "uploadId",
                    description: "Use an upload ID from the storage API",
                  },
                ],
                default: "url",
                description: "Choose whether to use a URL or upload ID",
              },
              {
                displayName: "Strength",
                name: "strength",
                type: "number",
                default: 50,
                typeOptions: {
                  minValue: 0,
                  maxValue: 100,
                },
                description:
                  "How strictly Firefly adheres to the reference image (0 = no adherence, 100 = full adherence)",
              },
              {
                displayName: "Upload ID",
                name: "uploadId",
                type: "string",
                default: "",
                placeholder: "123e4567-e89b-12d3-a456-426614174000",
                description: "The upload ID from the storage API response",
                displayOptions: {
                  show: {
                    sourceType: ["uploadId"],
                  },
                },
              },
              {
                displayName: "URL",
                name: "url",
                type: "string",
                default: "",
                placeholder: "https://example.amazonaws.com/image.jpg",
                description:
                  "Presigned URL of the reference image. Allowed domains: amazonaws.com, windows.net, dropboxusercontent.com, storage.googleapis.com.",
                displayOptions: {
                  show: {
                    sourceType: ["url"],
                  },
                },
              },
            ],
          },
          {
            displayName: "Upsampler Type",
            name: "upsamplerType",
            type: "options",
            options: [
              {
                name: "Default",
                value: "default",
                description: "Upscales generated images to 2k",
              },
              {
                name: "Low Creativity",
                value: "low_creativity",
                description:
                  "Refines generation by removing distortions, smoothing textures (good for human subjects)",
              },
            ],
            default: "default",
            description:
              "Only supported with image4_custom model. Controls upscaling behavior.",
          },
          {
            displayName: "Visual Intensity",
            name: "visualIntensity",
            type: "number",
            default: 6,
            typeOptions: {
              minValue: 2,
              maxValue: 10,
            },
            description:
              "minimum 2 maximum 10, Adjust overall intensity (contrast, shadow, hue). Not supported with image4_custom.",
          },
        ],
      },
      // Get Job Status parameters
      {
        displayName: "Job ID",
        name: "jobId",
        type: "string",
        required: true,
        default: "={{ $json.jobId }}",
        description: "The job ID from the async operation",
        displayOptions: {
          show: {
            operation: ["getJobStatus", "cancelJob"],
          },
        },
      },
      // Upload Image parameters
      {
        displayName: "Input Type",
        name: "inputType",
        type: "options",
        options: [
          {
            name: "Binary Data",
            value: "binary",
            description: "Use binary data from a previous node",
          },
          {
            name: "URL",
            value: "url",
            description: "Download image from a URL",
          },
          {
            name: "File Path",
            value: "filePath",
            description: "Read image from a file path on the system",
          },
        ],
        default: "binary",
        description: "How to provide the image to upload",
        displayOptions: {
          show: {
            operation: ["uploadImage"],
          },
        },
      },
      {
        displayName: "Binary Property",
        name: "binaryProperty",
        type: "string",
        default: "data",
        description:
          'The name of the binary property field from the previous node. Leave as "data" unless you renamed it.',
        placeholder: "data",
        hint: 'Usually "data" - only change if you used a different property name',
        displayOptions: {
          show: {
            operation: ["uploadImage"],
            inputType: ["binary"],
          },
        },
      },
      {
        displayName: "Image URL",
        name: "imageUrl",
        type: "string",
        default: "",
        required: true,
        placeholder: "https://example.com/image.jpg",
        description: "URL of the image to download and upload to Firefly",
        displayOptions: {
          show: {
            operation: ["uploadImage"],
            inputType: ["url"],
          },
        },
      },
      {
        displayName: "File Path",
        name: "filePath",
        type: "string",
        default: "",
        required: true,
        placeholder: "/tmp/image.jpg",
        description: "Full path to the image file on the system",
        displayOptions: {
          show: {
            operation: ["uploadImage"],
            inputType: ["filePath"],
          },
        },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    // Get credentials and initialize clients
    const credentials = await this.getCredentials("fireflyServicesApi");

    Logger.info("Initializing IMS and Firefly clients...");
    const imsClient = new IMSClient({
      clientId: credentials.clientId as string,
      clientSecret: credentials.clientSecret as string,
      scope: credentials.scopes as string,
    });

    const fireflyClient = new FireflyClient({
      imsClient,
    });
    Logger.info("Clients initialized successfully");

    // Process each input item
    for (let i = 0; i < items.length; i++) {
      try {
        const operation = this.getNodeParameter("operation", i) as string;
        Logger.info(`Processing item ${i}, operation: ${operation}`);

        let responseData: IDataObject = {};

        if (operation === "generateImagesAsync") {
          const prompt = this.getNodeParameter("prompt", i) as string;
          const modelVersion = this.getNodeParameter(
            "modelVersion",
            i,
          ) as ModelVersion;

          // Validate prompt length
          const MAX_PROMPT_LENGTH = 1024;
          if (prompt.length > MAX_PROMPT_LENGTH) {
            throw new ApplicationError(
              `Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters (current: ${prompt.length} characters). Please shorten your prompt.`,
            );
          }

          if (prompt.length < 1) {
            throw new ApplicationError(
              "Prompt must be at least 1 character long.",
            );
          }
          const {
            imageSize,
            contentClass,
            customModelId,
            numVariations,
            negativePrompt,
            seeds,
            structureReference,
            styleReference,
            upsamplerType,
            visualIntensity,
          } = this.getNodeParameter("additionalOptions", i, {}) as IDataObject;

          // Validate negative prompt length
          if (negativePrompt && typeof negativePrompt === "string") {
            if (negativePrompt.length > MAX_PROMPT_LENGTH) {
              throw new ApplicationError(
                `Negative prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters (current: ${negativePrompt.length} characters). Please shorten your negative prompt.`,
              );
            }
          }

          const parseSize = (size: string) => {
            const [width, height] = size.split("x").map(Number);
            return { width, height };
          };

          // Parse seeds from comma-separated string to array of integers
          const parsedSeeds = seeds
            ? (seeds as string)
                .split(",")
                .map((s) => parseInt(s.trim(), 10))
                .filter((n) => !isNaN(n))
            : undefined;

          // Build structure reference object
          let structure;
          if (
            structureReference &&
            Object.keys(structureReference as object).length > 0
          ) {
            const structRef = structureReference as IDataObject;
            const sourceType = structRef.sourceType as string;
            const source: IDataObject = {};

            if (sourceType === "url" && structRef.url) {
              source.url = structRef.url;
            } else if (sourceType === "uploadId" && structRef.uploadId) {
              source.uploadId = structRef.uploadId;
            }

            if (Object.keys(source).length > 0) {
              structure = {
                imageReference: { source },
                ...(structRef.strength !== undefined && {
                  strength: structRef.strength,
                }),
              };
            }
          }

          // Build style reference object
          let style;
          if (
            styleReference &&
            Object.keys(styleReference as object).length > 0
          ) {
            const styleRef = styleReference as IDataObject;
            const sourceType = styleRef.sourceType as string;
            const source: IDataObject = {};

            if (sourceType === "url" && styleRef.url) {
              source.url = styleRef.url;
            } else if (sourceType === "uploadId" && styleRef.uploadId) {
              source.uploadId = styleRef.uploadId;
            }

            if (Object.keys(source).length > 0) {
              style = {
                imageReference: { source },
                ...(styleRef.strength !== undefined && {
                  strength: styleRef.strength,
                }),
                ...(styleRef.presets && {
                  presets: (styleRef.presets as string)
                    .split(",")
                    .map((p) => p.trim())
                    .filter((p) => p.length > 0),
                }),
              };
            }
          }

          // Build request body
          const requestBody: GenerateImagesV3AsyncRequest = {
            prompt,
            size: imageSize ? parseSize(imageSize as string) : undefined,
            contentClass: contentClass as string,
            customModelId: customModelId as string,
            numVariations: numVariations as number,
            negativePrompt: negativePrompt as string,
            seeds: parsedSeeds,
            structure,
            style,
            upsamplerType: upsamplerType as string,
            visualIntensity: visualIntensity as number,
          };

          Logger.info("Generating images via FireflyClient...", {
            requestBody,
          });

          const response = await fireflyClient.generateImagesAsync(
            requestBody,
            modelVersion,
          );
          responseData = response as unknown as IDataObject;

          Logger.info("Generate images response:", { responseData });
        } else if (operation === "getJobStatus") {
          const jobId = this.getNodeParameter("jobId", i) as string;

          Logger.info("Getting job status via FireflyClient...", { jobId });

          const response = await fireflyClient.getJobStatus(jobId);
          responseData = response as unknown as IDataObject;

          Logger.info("Job status response:", { responseData });
        } else if (operation === "cancelJob") {
          const jobId = this.getNodeParameter("jobId", i) as string;

          Logger.info("Canceling job via HTTP request...", { jobId });

          await fireflyClient.cancelJob(jobId);

          Logger.info("Job canceled successfully");
        } else if (operation === "uploadImage") {
          const inputType = this.getNodeParameter("inputType", i) as string;

          Logger.info("Uploading image via FireflyClient...", { inputType });

          let binaryDataBuffer: Buffer | undefined;
          let detectedMimeType = "";

          if (inputType === "binary") {
            const item = items[i];

            // Get binary property name from JSON field or use default
            const binaryProperty =
              (item.json?.Binary_Property as string) ||
              (this.getNodeParameter("binaryProperty", i, "data") as string) ||
              "data";

            Logger.info("Getting binary data from property:", {
              binaryProperty,
            });

            // Get binary data
            const binaryData = this.helpers.assertBinaryData(i, binaryProperty);
            binaryDataBuffer = await this.helpers.getBinaryDataBuffer(
              i,
              binaryProperty,
            );
            detectedMimeType = binaryData.mimeType?.toLowerCase() || "";

            Logger.info("Binary data retrieved:", {
              mimeType: detectedMimeType,
              size: binaryDataBuffer.length,
            });
          } else if (inputType === "url") {
            // Download from URL
            const imageUrl = this.getNodeParameter("imageUrl", i) as string;

            if (!imageUrl || !imageUrl.startsWith("http")) {
              throw new ApplicationError(
                `Invalid image URL: "${imageUrl}". Must be a valid HTTP or HTTPS URL.`,
                { level: "warning" },
              );
            }

            Logger.info("Downloading image from URL...", { imageUrl });

            const response = await this.helpers.httpRequest({
              method: "GET",
              url: imageUrl,
              encoding: "arraybuffer",
              returnFullResponse: true,
            });

            binaryDataBuffer = Buffer.from(response.body as ArrayBuffer);
            detectedMimeType =
              (response.headers["content-type"] as string)?.toLowerCase() || "";

            Logger.info("Image downloaded", {
              size: binaryDataBuffer.length,
              contentType: detectedMimeType,
            });
          } else if (inputType === "filePath") {
            // Read from file path
            const filePath = this.getNodeParameter("filePath", i) as string;

            if (!filePath) {
              throw new ApplicationError(
                "File path is required when using 'File Path' input type.",
                { level: "warning" },
              );
            }

            Logger.info("Reading image from file path...", { filePath });

            try {
              binaryDataBuffer = await readFile(filePath);

              // Detect MIME type from file extension
              const ext = filePath.toLowerCase().split(".").pop();
              if (ext === "jpg" || ext === "jpeg") {
                detectedMimeType = "image/jpeg";
              } else if (ext === "png") {
                detectedMimeType = "image/png";
              } else if (ext === "webp") {
                detectedMimeType = "image/webp";
              }

              Logger.info("Image read from file", {
                size: binaryDataBuffer.length,
                detectedMimeType,
              });
            } catch (error) {
              throw new ApplicationError(
                `Failed to read image file: ${(error as Error).message}`,
                { level: "warning" },
              );
            }
          } else {
            throw new ApplicationError(`Unknown input type: ${inputType}`, {
              level: "warning",
            });
          }

          // Ensure we have binary data buffer at this point
          if (!binaryDataBuffer) {
            throw new ApplicationError(
              "Failed to retrieve image data. Please check the input and try again.",
              { level: "warning" },
            );
          }

          // Auto-detect content type from MIME type
          let contentType: "image/jpeg" | "image/png" | "image/webp";

          if (
            detectedMimeType.includes("jpeg") ||
            detectedMimeType.includes("jpg")
          ) {
            contentType = "image/jpeg";
          } else if (detectedMimeType.includes("png")) {
            contentType = "image/png";
          } else if (detectedMimeType.includes("webp")) {
            contentType = "image/webp";
          } else {
            throw new ApplicationError(
              `Unsupported image format: ${detectedMimeType}. Adobe Firefly only supports JPEG, PNG, and WebP formats.`,
              { level: "warning" },
            );
          }

          Logger.info("Uploading to Firefly...", {
            contentType,
            size: binaryDataBuffer.length,
          });

          const response = await fireflyClient.uploadImage(
            binaryDataBuffer,
            contentType,
          );
          responseData = response as unknown as IDataObject;

          Logger.info("Upload image response:", { responseData });
        } else {
          throw new ApplicationError(`Unknown operation: ${operation}`);
        }

        returnData.push({
          json: responseData,
          pairedItem: i,
        });
      } catch (error) {
        Logger.error("Error processing item:", {
          error: (error as Error).message,
          stack: (error as Error).stack,
        });
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: (error as Error).message },
            pairedItem: i,
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
