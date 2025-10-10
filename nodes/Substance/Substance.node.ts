import type {
  IExecuteFunctions,
  INodeType,
  INodeTypeDescription,
  IDataObject,
} from "n8n-workflow";
import { NodeConnectionTypes, ApplicationError } from "n8n-workflow";

import { IMSClient } from "../../clients/ims-client";
import { SubstanceClient } from "../../clients/substance";
import {
  executeComposeScene,
  executeConvertModel,
  executeCreateSpace,
  executeDescribeScene,
  executeGetJobStatus,
  executeWaitForJob,
} from "./exec";

export class Substance implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Substance 3D",
    name: "substance",
    icon: "file:substance.svg",
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: "Generate and manipulate 3D content with Adobe Substance 3D",
    defaults: {
      name: "Substance 3D",
    },
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
            name: "Convert Model",
            value: "convertModel",
            description: "Convert 3D model to another format",
            action: "Convert 3D model format",
          },
          {
            name: "Create Space",
            value: "createSpace",
            description: "Upload 3D files to create a space",
            action: "Create space from 3D files",
          },
          {
            name: "Describe Scene",
            value: "describeScene",
            description: "Get metadata and statistics about a 3D scene",
            action: "Describe 3D scene",
          },
          {
            name: "Generate 3D Object Composite",
            value: "composeScene",
            description:
              "Generate a 3D object composite with AI-generated background",
            action: "Generate 3D object composite",
          },
          {
            name: "Get Job Status",
            value: "getJobStatus",
            description: "Get the status of a Substance 3D job",
            action: "Get job status",
          },
          {
            name: "Wait for Job",
            value: "waitForJob",
            description:
              "Wait for a Substance 3D job to complete (with automatic polling)",
            action: "Wait for job completion",
          },
        ],
        default: "composeScene",
      },

      // ============================================
      // Generate 3D Object Composite
      // ============================================
      {
        displayName: "Sources (JSON)",
        name: "sources",
        type: "string",
        typeOptions: {
          rows: 5,
        },
        required: true,
        displayOptions: {
          show: {
            operation: ["composeScene"],
          },
        },
        default: '[{"space": {"id": "your-space-id"}}]',
        // eslint-disable-next-line n8n-nodes-base/node-param-placeholder-miscased-id
        placeholder: '[{"space": {"id": "your-space-id"}}]',
        description:
          'Array of MountedSource objects (JSON). Example with space ID: [{"space": {"ID": "..."}}] or with URL: [{"URL": {"URL": "https://..."}}].',
      },
      {
        displayName: "Prompt",
        name: "prompt",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            operation: ["composeScene"],
          },
        },
        default: "",
        placeholder: "A product on a marble table",
        description: "Text description of the background scene to generate",
      },
      {
        displayName: "Hero Asset",
        name: "heroAsset",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            operation: ["composeScene"],
          },
        },
        default: "",
        placeholder: "model.glb",
        description: "Path to the main 3D model within the mounted sources",
      },
      {
        displayName: "Compose Options",
        name: "composeOptions",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        displayOptions: {
          show: {
            operation: ["composeScene"],
          },
        },
        options: [
          {
            displayName: "Camera Name",
            name: "cameraName",
            type: "string",
            default: "",
            description: "Name of camera to use from the 3D model",
          },
          {
            displayName: "Content Class",
            name: "contentClass",
            type: "options",
            options: [
              { name: "Photo", value: "photo" },
              { name: "Art", value: "art" },
            ],
            default: "photo",
            description: "Style of the generated content",
          },
          {
            displayName: "Enable Ground Plane",
            name: "enableGroundPlane",
            type: "boolean",
            default: false,
            description:
              "Whether to enable ground plane for shadows and reflections",
          },
          {
            displayName: "Environment Exposure",
            name: "environmentExposure",
            type: "number",
            default: 0,
            typeOptions: {
              minValue: -10,
              maxValue: 10,
            },
            description: "Adjust lighting exposure (-10 to 10)",
          },
          {
            displayName: "Height",
            name: "height",
            type: "number",
            default: 2048,
            typeOptions: {
              minValue: 1,
              maxValue: 2688,
            },
            description: "Output height in pixels (1-2688)",
          },
          {
            displayName: "Lighting Seeds",
            name: "lightingSeeds",
            type: "string",
            default: "",
            placeholder: "1234, 5678",
            description:
              "Comma-separated list of lighting seeds for reproducibility",
          },
          {
            displayName: "Model Version",
            name: "modelVersion",
            type: "options",
            options: [
              { name: "Image 3 Fast", value: "image3_fast" },
              { name: "Image 4 Standard", value: "image4_standard" },
              { name: "Image 4 Ultra", value: "image4_ultra" },
            ],
            default: "image4_standard",
            description: "AI model version to use",
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
            description: "Number of variations to generate (1-4)",
          },
          {
            displayName: "Scene File",
            name: "sceneFile",
            type: "string",
            default: "",
            description: "Path to scene file within the mounted sources",
          },
          {
            displayName: "Seeds",
            name: "seeds",
            type: "string",
            default: "",
            placeholder: "1234, 5678",
            description: "Comma-separated list of seeds for reproducibility",
          },
          {
            displayName: "Style Image",
            name: "styleImage",
            type: "string",
            default: "",
            description: "Path to style reference image",
          },
          {
            displayName: "Width",
            name: "width",
            type: "number",
            default: 2048,
            typeOptions: {
              minValue: 1,
              maxValue: 2688,
            },
            description: "Output width in pixels (1-2688)",
          },
        ],
      },

      // ============================================
      // Describe Scene
      // ============================================
      {
        displayName: "Sources (JSON)",
        name: "sources",
        type: "string",
        typeOptions: {
          rows: 5,
        },
        required: true,
        displayOptions: {
          show: {
            operation: ["describeScene"],
          },
        },
        default: '[{"space": {"id": "your-space-id"}}]',
        // eslint-disable-next-line n8n-nodes-base/node-param-placeholder-miscased-id
        placeholder: '[{"space": {"id": "your-space-id"}}]',
        description:
          'Array of MountedSource objects (JSON). Example with space ID: [{"space": {"ID": "..."}}] or with URL: [{"URL": {"URL": "https://..."}}].',
      },
      {
        displayName: "Scene File",
        name: "sceneFile",
        type: "string",
        displayOptions: {
          show: {
            operation: ["describeScene"],
          },
        },
        default: "",
        placeholder: "model.usdz",
        description:
          "Path to the scene file within the mounted sources. Optional if sources contain only one file.",
      },

      // ============================================
      // Convert Model
      // ============================================
      {
        displayName: "Sources (JSON)",
        name: "sources",
        type: "string",
        typeOptions: {
          rows: 5,
        },
        required: true,
        displayOptions: {
          show: {
            operation: ["convertModel"],
          },
        },
        default: '[{"space": {"id": "your-space-id"}}]',
        // eslint-disable-next-line n8n-nodes-base/node-param-placeholder-miscased-id
        placeholder: '[{"space": {"id": "your-space-id"}}]',
        description:
          'Array of MountedSource objects (JSON). Example with space ID: [{"space": {"ID": "..."}}] or with URL: [{"URL": {"URL": "https://..."}}].',
      },
      {
        displayName: "Output Format",
        name: "format",
        type: "options",
        required: true,
        displayOptions: {
          show: {
            operation: ["convertModel"],
          },
        },
        options: [
          { name: "FBX", value: "fbx" },
          { name: "GLB", value: "glb" },
          { name: "glTF", value: "gltf" },
          { name: "OBJ", value: "obj" },
          { name: "USD (ASCII)", value: "usda" },
          { name: "USD (Binary)", value: "usdc" },
          { name: "USDZ", value: "usdz" },
        ],
        default: "glb",
        description: "The target 3D format for conversion",
      },
      {
        displayName: "Model Entrypoint",
        name: "modelEntrypoint",
        type: "string",
        displayOptions: {
          show: {
            operation: ["convertModel"],
          },
        },
        default: "",
        placeholder: "model.fbx",
        description:
          "Path to the model file within the mounted sources. Optional if sources contain only one file.",
      },

      // ============================================
      // Create Space
      // ============================================
      {
        displayName: "Binary Property",
        name: "binaryProperty",
        type: "string",
        displayOptions: {
          show: {
            operation: ["createSpace"],
          },
        },
        default: "data",
        description:
          "Name of the binary property containing the 3D file. Can also be provided in JSON as Binary_Property.",
      },
      {
        displayName: "Filename",
        name: "filename",
        type: "string",
        displayOptions: {
          show: {
            operation: ["createSpace"],
          },
        },
        default: "",
        placeholder: "model.glb",
        description:
          "Filename for the 3D file. If not provided, will use the filename from binary data.",
      },
      {
        displayName: "Name",
        name: "name",
        type: "string",
        displayOptions: {
          show: {
            operation: ["createSpace"],
          },
        },
        default: "",
        placeholder: "My 3D Model",
        description: "Optional name for the space",
      },

      // ============================================
      // Get Job Status
      // ============================================
      {
        displayName: "Job ID",
        name: "jobId",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            operation: ["getJobStatus"],
          },
        },
        default: "",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        description: "The job ID returned from a Substance 3D async operation",
      },

      // ============================================
      // Wait for Job
      // ============================================
      {
        displayName: "Job ID",
        name: "jobId",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            operation: ["waitForJob"],
          },
        },
        default: "",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        description: "The job ID returned from a Substance 3D async operation",
      },
      {
        displayName: "Polling Interval (Seconds)",
        name: "pollingInterval",
        type: "number",
        default: 3,
        typeOptions: {
          minValue: 1,
          maxValue: 60,
        },
        displayOptions: {
          show: {
            operation: ["waitForJob"],
          },
        },
        description: "How often to check the job status (in seconds)",
      },
      {
        displayName: "Timeout (Minutes)",
        name: "timeout",
        type: "number",
        default: 10,
        typeOptions: {
          minValue: 1,
          maxValue: 60,
        },
        displayOptions: {
          show: {
            operation: ["waitForJob"],
          },
        },
        description:
          "Maximum time to wait for job completion (in minutes). The node will fail if the timeout is reached.",
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<{ json: IDataObject }[][]> {
    const items = this.getInputData();
    const returnData: IDataObject[] = [];
    const operation = this.getNodeParameter("operation", 0) as string;

    // Get credentials
    const credentials = await this.getCredentials("fireflyServicesApi");

    // Initialize clients
    const imsClient = new IMSClient({
      clientId: credentials.clientId as string,
      clientSecret: credentials.clientSecret as string,
      scope: (credentials.scopes as string) || "firefly_api,ff_apis",
    });

    const substanceClient = new SubstanceClient({ imsClient });

    // Process each input item
    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: IDataObject;

        switch (operation) {
          case "composeScene":
            responseData = await executeComposeScene.call(
              this,
              i,
              substanceClient,
            );
            break;

          case "convertModel":
            responseData = await executeConvertModel.call(
              this,
              i,
              substanceClient,
            );
            break;

          case "createSpace":
            responseData = await executeCreateSpace.call(
              this,
              i,
              substanceClient,
            );
            break;

          case "describeScene":
            responseData = await executeDescribeScene.call(
              this,
              i,
              substanceClient,
            );
            break;

          case "getJobStatus":
            responseData = await executeGetJobStatus.call(
              this,
              i,
              substanceClient,
            );
            break;

          case "waitForJob":
            responseData = await executeWaitForJob.call(
              this,
              i,
              substanceClient,
            );
            break;

          default:
            throw new ApplicationError(`Unknown operation: ${operation}`);
        }

        returnData.push(responseData);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: (error as Error).message,
            },
          });
          continue;
        }
        throw error;
      }
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}
