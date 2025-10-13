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

import { IMSClient } from "../../clients/ims-client";
import { PhotoshopClient } from "../../clients/photoshop";
import {
  executeRemoveBackground,
  executeMaskObjects,
  executeMaskBodyParts,
  executeRefineMask,
  executeFillMaskedAreas,
  executeCreateRendition,
  executeEditTextLayer,
  executeReplaceSmartObject,
  executeAutoCrop,
  executeDepthBlur,
  executeGetJobStatus,
  executeWaitForJob,
} from "./exec";

export class Photoshop implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Firefly - Photoshop",
    name: "photoshop",
    icon: {
      light: "file:photoshop.svg",
      dark: "file:photoshop.svg",
    },
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: "Interact with Adobe Photoshop API for image manipulation",
    defaults: {
      name: "Photoshop",
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
            name: "Auto Crop",
            value: "autoCrop",
            description: "Automatically crop image to content",
            action: "Auto crop image",
          },
          {
            name: "Create Rendition",
            value: "createRendition",
            description: "Export PSD layers to various formats",
            action: "Create rendition from PSD",
          },
          {
            name: "Depth Blur",
            value: "depthBlur",
            description: "Apply depth-of-field blur effect",
            action: "Apply depth blur to image",
          },
          {
            name: "Edit Text Layer",
            value: "editTextLayer",
            description: "Modify text content and styling in PSD",
            action: "Edit text layer in PSD",
          },
          {
            name: "Fill Masked Areas",
            value: "fillMaskedAreas",
            description:
              "Fill masked areas with generative or content-aware fill",
            action: "Fill masked areas in image",
          },
          {
            name: "Get Job Status",
            value: "getJobStatus",
            description: "Check the status of an async job",
            action: "Get photoshop job status",
          },
          {
            name: "Mask Body Parts",
            value: "maskBodyParts",
            description: "Create masks for specific body parts",
            action: "Mask body parts in image",
          },
          {
            name: "Mask Objects",
            value: "maskObjects",
            description: "Create masks for specific objects",
            action: "Mask objects in image",
          },
          {
            name: "Refine Mask",
            value: "refineMask",
            description: "Refine a mask with various adjustments",
            action: "Refine image mask",
          },
          {
            name: "Remove Background",
            value: "removeBackground",
            description: "AI-powered background removal",
            action: "Remove background from image",
          },
          {
            name: "Replace Smart Object",
            value: "replaceSmartObject",
            description: "Replace smart objects in PSD",
            action: "Replace smart object in PSD",
          },
          {
            name: "Wait for Job",
            value: "waitForJob",
            description: "Wait for a job to complete",
            action: "Wait for photoshop job to complete",
          },
        ],
        default: "removeBackground",
      },

      // ===== Remove Background =====
      {
        displayName: "Input Storage (JSON)",
        name: "removeBackgroundInput",
        type: "json",
        default: '{\n  "href": "https://...",\n  "storage": "external"\n}',
        required: true,
        description:
          "Input storage configuration with href and optional storage type",
        displayOptions: {
          show: {
            operation: ["removeBackground"],
          },
        },
      },
      {
        displayName: "Output Storage (JSON)",
        name: "removeBackgroundOutput",
        type: "json",
        default:
          '{\n  "href": "https://...",\n  "storage": "external",\n  "type": "image/png"\n}',
        required: true,
        description:
          "Output storage configuration with href, storage type, and output format",
        displayOptions: {
          show: {
            operation: ["removeBackground"],
          },
        },
      },
      {
        displayName: "Options",
        name: "removeBackgroundOptions",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        displayOptions: {
          show: {
            operation: ["removeBackground"],
          },
        },
        options: [
          {
            displayName: "Mask Format",
            name: "maskFormat",
            type: "options",
            options: [
              { name: "Binary", value: "binary" },
              { name: "Soft", value: "soft" },
            ],
            default: "soft",
            description: "Type of mask to generate",
          },
          {
            displayName: "Optimize",
            name: "optimize",
            type: "options",
            options: [
              { name: "Performance", value: "performance" },
              { name: "Batch", value: "batch" },
            ],
            default: "performance",
            description: "Optimization mode for processing",
          },
          {
            displayName: "Postprocess",
            name: "postprocess",
            type: "boolean",
            default: false,
            description: "Whether to apply post-processing to the result",
          },
        ],
      },

      // ===== Mask Objects =====
      {
        displayName: "Input Storage (JSON)",
        name: "maskObjectsInput",
        type: "json",
        default: '{\n  "href": "https://...",\n  "storage": "external"\n}',
        required: true,
        description: "Input storage configuration",
        displayOptions: {
          show: {
            operation: ["maskObjects"],
          },
        },
      },
      {
        displayName: "Output Storage (JSON)",
        name: "maskObjectsOutput",
        type: "json",
        default:
          '{\n  "href": "https://...",\n  "storage": "external",\n  "type": "image/png"\n}',
        required: true,
        description: "Output storage configuration",
        displayOptions: {
          show: {
            operation: ["maskObjects"],
          },
        },
      },
      {
        displayName: "Object Types",
        name: "objectTypes",
        type: "multiOptions",
        options: [
          { name: "Accessory", value: "accessory" },
          { name: "Bird", value: "bird" },
          { name: "Building", value: "building" },
          { name: "Cat", value: "cat" },
          { name: "Dog", value: "dog" },
          { name: "Food", value: "food" },
          { name: "Furniture", value: "furniture" },
          { name: "Ground", value: "ground" },
          { name: "Person", value: "person" },
          { name: "Plant", value: "plant" },
          { name: "Product", value: "product" },
          { name: "Sky", value: "sky" },
          { name: "Vehicle", value: "vehicle" },
        ],
        default: ["person"],
        required: true,
        description: "Types of objects to mask",
        displayOptions: {
          show: {
            operation: ["maskObjects"],
          },
        },
      },

      // ===== Mask Body Parts =====
      {
        displayName: "Input Storage (JSON)",
        name: "maskBodyPartsInput",
        type: "json",
        default: '{\n  "href": "https://...",\n  "storage": "external"\n}',
        required: true,
        description: "Input storage configuration",
        displayOptions: {
          show: {
            operation: ["maskBodyParts"],
          },
        },
      },
      {
        displayName: "Output Storage (JSON)",
        name: "maskBodyPartsOutput",
        type: "json",
        default:
          '{\n  "href": "https://...",\n  "storage": "external",\n  "type": "image/png"\n}',
        required: true,
        description: "Output storage configuration",
        displayOptions: {
          show: {
            operation: ["maskBodyParts"],
          },
        },
      },
      {
        displayName: "Body Parts",
        name: "bodyParts",
        type: "multiOptions",
        options: [
          { name: "Face", value: "face" },
          { name: "Hair", value: "hair" },
          { name: "Head", value: "head" },
          { name: "Left Arm", value: "left_arm" },
          { name: "Left Foot", value: "left_foot" },
          { name: "Left Hand", value: "left_hand" },
          { name: "Left Leg", value: "left_leg" },
          { name: "Neck", value: "neck" },
          { name: "Right Arm", value: "right_arm" },
          { name: "Right Foot", value: "right_foot" },
          { name: "Right Hand", value: "right_hand" },
          { name: "Right Leg", value: "right_leg" },
          { name: "Torso", value: "torso" },
        ],
        default: ["face"],
        required: true,
        description: "Body parts to mask",
        displayOptions: {
          show: {
            operation: ["maskBodyParts"],
          },
        },
      },

      // ===== Refine Mask =====
      {
        displayName: "Source Image (JSON)",
        name: "refineMaskSource",
        type: "json",
        default: '{\n  "href": "https://...",\n  "storage": "external"\n}',
        required: true,
        description: "Source image storage configuration",
        displayOptions: {
          show: {
            operation: ["refineMask"],
          },
        },
      },
      {
        displayName: "Mask Image (JSON)",
        name: "refineMaskMask",
        type: "json",
        default: '{\n  "href": "https://...",\n  "storage": "external"\n}',
        required: true,
        description: "Mask image storage configuration",
        displayOptions: {
          show: {
            operation: ["refineMask"],
          },
        },
      },
      {
        displayName: "Output Storage (JSON)",
        name: "refineMaskOutput",
        type: "json",
        default:
          '{\n  "href": "https://...",\n  "storage": "external",\n  "type": "image/png"\n}',
        required: true,
        description: "Output storage configuration",
        displayOptions: {
          show: {
            operation: ["refineMask"],
          },
        },
      },
      {
        displayName: "Refinement Options",
        name: "refinementOptions",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        displayOptions: {
          show: {
            operation: ["refineMask"],
          },
        },
        options: [
          {
            displayName: "Contrast",
            name: "contrast",
            type: "number",
            default: 0,
            typeOptions: {
              minValue: -100,
              maxValue: 100,
            },
            description: "Adjust mask contrast (-100 to 100)",
          },
          {
            displayName: "Decontaminate",
            name: "decontaminate",
            type: "boolean",
            default: false,
            description: "Whether to apply color decontamination",
          },
          {
            displayName: "Decontamination Amount",
            name: "decontaminationAmount",
            type: "number",
            default: 50,
            typeOptions: {
              minValue: 0,
              maxValue: 100,
            },
            description: "Strength of decontamination (0-100)",
          },
          {
            displayName: "Feather",
            name: "feather",
            type: "number",
            default: 0,
            typeOptions: {
              minValue: 0,
              maxValue: 250,
            },
            description: "Feather amount in pixels (0-250)",
          },
          {
            displayName: "Shift Edge",
            name: "shiftEdge",
            type: "number",
            default: 0,
            typeOptions: {
              minValue: -100,
              maxValue: 100,
            },
            description: "Shift mask edge (-100 to 100)",
          },
          {
            displayName: "Smoothness",
            name: "smoothness",
            type: "number",
            default: 0,
            typeOptions: {
              minValue: 0,
              maxValue: 100,
            },
            description: "Smoothness amount (0-100)",
          },
        ],
      },

      // ===== Fill Masked Areas =====
      {
        displayName: "Source Image (JSON)",
        name: "fillSource",
        type: "json",
        default: '{\n  "href": "https://...",\n  "storage": "external"\n}',
        required: true,
        description: "Source image storage configuration",
        displayOptions: {
          show: {
            operation: ["fillMaskedAreas"],
          },
        },
      },
      {
        displayName: "Mask Image (JSON)",
        name: "fillMask",
        type: "json",
        default: '{\n  "href": "https://...",\n  "storage": "external"\n}',
        required: true,
        description: "Mask image storage configuration",
        displayOptions: {
          show: {
            operation: ["fillMaskedAreas"],
          },
        },
      },
      {
        displayName: "Output Storage (JSON)",
        name: "fillOutput",
        type: "json",
        default:
          '{\n  "href": "https://...",\n  "storage": "external",\n  "type": "image/jpeg"\n}',
        required: true,
        description: "Output storage configuration",
        displayOptions: {
          show: {
            operation: ["fillMaskedAreas"],
          },
        },
      },
      {
        displayName: "Fill Method",
        name: "fillMethod",
        type: "options",
        options: [
          { name: "Content Aware", value: "contentAware" },
          { name: "Generative Fill", value: "generativeFill" },
        ],
        default: "generativeFill",
        description: "Method to use for filling",
        displayOptions: {
          show: {
            operation: ["fillMaskedAreas"],
          },
        },
      },
      {
        displayName: "Prompt",
        name: "fillPrompt",
        type: "string",
        default: "",
        typeOptions: {
          rows: 4,
        },
        description:
          "Text prompt for generative fill (required for generativeFill)",
        displayOptions: {
          show: {
            operation: ["fillMaskedAreas"],
            fillMethod: ["generativeFill"],
          },
        },
      },

      // ===== Create Rendition =====
      {
        displayName: "Inputs (JSON Array)",
        name: "renditionInputs",
        type: "json",
        default: '[{\n  "href": "https://...",\n  "storage": "external"\n}]',
        required: true,
        description: "Array of input storage configurations (PSD files)",
        displayOptions: {
          show: {
            operation: ["createRendition"],
          },
        },
      },
      {
        displayName: "Outputs (JSON Array)",
        name: "renditionOutputs",
        type: "json",
        default:
          '[{\n  "href": "https://...",\n  "storage": "external",\n  "type": "image/png",\n  "width": 800,\n  "height": 600\n}]',
        required: true,
        description:
          "Array of output configurations with dimensions and format",
        displayOptions: {
          show: {
            operation: ["createRendition"],
          },
        },
      },

      // ===== Edit Text Layer =====
      {
        displayName: "Inputs (JSON Array)",
        name: "textLayerInputs",
        type: "json",
        default: '[{\n  "href": "https://...",\n  "storage": "external"\n}]',
        required: true,
        description: "Array of input storage configurations (PSD files)",
        displayOptions: {
          show: {
            operation: ["editTextLayer"],
          },
        },
      },
      {
        displayName: "Text Layers (JSON)",
        name: "textLayers",
        type: "json",
        default:
          '{\n  "layers": [{\n    "name": "Title",\n    "text": {\n      "content": "New Text"\n    }\n  }]\n}',
        required: true,
        description: "Configuration for text layers to edit",
        displayOptions: {
          show: {
            operation: ["editTextLayer"],
          },
        },
      },
      {
        displayName: "Outputs (JSON Array)",
        name: "textLayerOutputs",
        type: "json",
        default:
          '[{\n  "href": "https://...",\n  "storage": "external",\n  "type": "image/vnd.adobe.photoshop"\n}]',
        required: true,
        description: "Array of output storage configurations",
        displayOptions: {
          show: {
            operation: ["editTextLayer"],
          },
        },
      },

      // ===== Replace Smart Object =====
      {
        displayName: "Inputs (JSON Array)",
        name: "smartObjectInputs",
        type: "json",
        default: '[{\n  "href": "https://...",\n  "storage": "external"\n}]',
        required: true,
        description: "Array of input storage configurations (PSD files)",
        displayOptions: {
          show: {
            operation: ["replaceSmartObject"],
          },
        },
      },
      {
        displayName: "Smart Object Layers (JSON)",
        name: "smartObjectLayers",
        type: "json",
        default:
          '{\n  "layers": [{\n    "name": "Logo",\n    "input": {\n      "href": "https://...",\n      "storage": "external"\n    }\n  }]\n}',
        required: true,
        description: "Configuration for smart objects to replace",
        displayOptions: {
          show: {
            operation: ["replaceSmartObject"],
          },
        },
      },
      {
        displayName: "Outputs (JSON Array)",
        name: "smartObjectOutputs",
        type: "json",
        default:
          '[{\n  "href": "https://...",\n  "storage": "external",\n  "type": "image/vnd.adobe.photoshop"\n}]',
        required: true,
        description: "Array of output storage configurations",
        displayOptions: {
          show: {
            operation: ["replaceSmartObject"],
          },
        },
      },

      // ===== Auto Crop =====
      {
        displayName: "Inputs (JSON Array)",
        name: "autoCropInputs",
        type: "json",
        default: '[{\n  "href": "https://...",\n  "storage": "external"\n}]',
        required: true,
        description: "Array of input storage configurations",
        displayOptions: {
          show: {
            operation: ["autoCrop"],
          },
        },
      },
      {
        displayName: "Outputs (JSON Array)",
        name: "autoCropOutputs",
        type: "json",
        default:
          '[{\n  "href": "https://...",\n  "storage": "external",\n  "type": "image/jpeg"\n}]',
        required: true,
        description: "Array of output storage configurations",
        displayOptions: {
          show: {
            operation: ["autoCrop"],
          },
        },
      },

      // ===== Depth Blur =====
      {
        displayName: "Inputs (JSON Array)",
        name: "depthBlurInputs",
        type: "json",
        default: '[{\n  "href": "https://...",\n  "storage": "external"\n}]',
        required: true,
        description: "Array of input storage configurations",
        displayOptions: {
          show: {
            operation: ["depthBlur"],
          },
        },
      },
      {
        displayName: "Outputs (JSON Array)",
        name: "depthBlurOutputs",
        type: "json",
        default:
          '[{\n  "href": "https://...",\n  "storage": "external",\n  "type": "image/jpeg"\n}]',
        required: true,
        description: "Array of output storage configurations",
        displayOptions: {
          show: {
            operation: ["depthBlur"],
          },
        },
      },
      {
        displayName: "Blur Options",
        name: "blurOptions",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        displayOptions: {
          show: {
            operation: ["depthBlur"],
          },
        },
        options: [
          {
            displayName: "Blur Strength",
            name: "blurStrength",
            type: "number",
            default: 50,
            typeOptions: {
              minValue: 1,
              maxValue: 100,
            },
            description: "Strength of the blur effect (1-100)",
          },
          {
            displayName: "Focal Point X",
            name: "focalX",
            type: "number",
            default: 0.5,
            typeOptions: {
              minValue: 0,
              maxValue: 1,
              numberPrecision: 2,
            },
            description: "Horizontal focal point position (0-1, relative)",
          },
          {
            displayName: "Focal Point Y",
            name: "focalY",
            type: "number",
            default: 0.5,
            typeOptions: {
              minValue: 0,
              maxValue: 1,
              numberPrecision: 2,
            },
            description: "Vertical focal point position (0-1, relative)",
          },
        ],
      },

      // ===== Get Job Status & Wait for Job =====
      {
        displayName: "Job ID",
        name: "jobId",
        type: "string",
        required: true,
        default: "={{ $json.jobId }}",
        description: "The job ID from the async operation",
        displayOptions: {
          show: {
            operation: ["getJobStatus", "waitForJob"],
          },
        },
      },
      {
        displayName: "Job Type",
        name: "jobType",
        type: "options",
        options: [
          { name: "Masking (V1)", value: "maskingV1" },
          { name: "Masking (V2)", value: "maskingV2" },
          { name: "PSD Operations", value: "psd" },
        ],
        default: "maskingV2",
        description: "Type of job to check",
        displayOptions: {
          show: {
            operation: ["getJobStatus", "waitForJob"],
          },
        },
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
        description: "How often to check job status (in seconds)",
        displayOptions: {
          show: {
            operation: ["waitForJob"],
          },
        },
      },
      {
        displayName: "Timeout (Minutes)",
        name: "timeout",
        type: "number",
        default: 5,
        typeOptions: {
          minValue: 1,
          maxValue: 60,
        },
        description: "Maximum time to wait for job completion (in minutes)",
        displayOptions: {
          show: {
            operation: ["waitForJob"],
          },
        },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: IDataObject[] = [];
    const operation = this.getNodeParameter("operation", 0) as string;

    // Initialize IMS and Photoshop clients
    const credentials = await this.getCredentials("fireflyServicesApi");
    const imsClient = new IMSClient({
      clientId: credentials.clientId as string,
      clientSecret: credentials.clientSecret as string,
      scope: (credentials.scopes as string) || "firefly_api,ff_apis",
    });
    const photoshopClient = new PhotoshopClient({ imsClient });

    Logger.info("Photoshop Node - Operation:", { operation });

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: IDataObject;

        switch (operation) {
          case "removeBackground":
            responseData = await executeRemoveBackground.call(
              this,
              i,
              photoshopClient,
            );
            break;

          case "maskObjects":
            responseData = await executeMaskObjects.call(
              this,
              i,
              photoshopClient,
            );
            break;

          case "maskBodyParts":
            responseData = await executeMaskBodyParts.call(
              this,
              i,
              photoshopClient,
            );
            break;

          case "refineMask":
            responseData = await executeRefineMask.call(
              this,
              i,
              photoshopClient,
            );
            break;

          case "fillMaskedAreas":
            responseData = await executeFillMaskedAreas.call(
              this,
              i,
              photoshopClient,
            );
            break;

          case "createRendition":
            responseData = await executeCreateRendition.call(
              this,
              i,
              photoshopClient,
            );
            break;

          case "editTextLayer":
            responseData = await executeEditTextLayer.call(
              this,
              i,
              photoshopClient,
            );
            break;

          case "replaceSmartObject":
            responseData = await executeReplaceSmartObject.call(
              this,
              i,
              photoshopClient,
            );
            break;

          case "autoCrop":
            responseData = await executeAutoCrop.call(this, i, photoshopClient);
            break;

          case "depthBlur":
            responseData = await executeDepthBlur.call(
              this,
              i,
              photoshopClient,
            );
            break;

          case "getJobStatus":
            responseData = await executeGetJobStatus.call(
              this,
              i,
              photoshopClient,
            );
            break;

          case "waitForJob":
            responseData = await executeWaitForJob.call(
              this,
              i,
              photoshopClient,
            );
            break;

          default:
            throw new ApplicationError(
              `The operation "${operation}" is not supported`,
            );
        }

        returnData.push(responseData);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ error: error.message });
          continue;
        }
        throw error;
      }
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}
