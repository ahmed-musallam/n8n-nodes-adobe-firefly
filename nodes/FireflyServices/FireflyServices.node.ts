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
import { FireflyClient } from "../../clients/ffs-client";
import {
  executeExpandImageAsync,
  executeFillImageAsync,
  executeGenerateImagesAsync,
  executeGenerateVideoAsync,
  executeGetJobStatus,
  executeCancelJob,
  executeUploadImage,
} from "./exec";

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
            name: "Expand Image (Async)",
            value: "expandImageAsync",
            description:
              "Change aspect ratio or size of an image and expand it",
            action: "Expand image with optional prompt",
          },
          {
            name: "Fill Image (Async)",
            value: "fillImageAsync",
            description:
              "Fill areas of an image using a mask with AI-generated content",
            action: "Fill image with mask and prompt",
          },
          {
            name: "Generate Images (Async)",
            value: "generateImagesAsync",
            description: "Generate images from text prompt asynchronously",
            action: "Generate images from text prompt",
          },
          {
            name: "Generate Video (Async)",
            value: "generateVideoAsync",
            description:
              "Generate a 5-second video from text prompt asynchronously",
            action: "Generate video from text prompt",
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
              "Minimum 2 maximum 10, Adjust overall intensity (contrast, shadow, hue). Not supported with image4_custom.",
          },
        ],
      },
      // Expand Image Async parameters
      {
        displayName: "Source Image Upload ID",
        name: "sourceImageUploadId",
        type: "string",
        required: true,
        default: "",
        placeholder: "123e4567-e89b-12d3-a456-426614174000",
        description: "Upload ID from storage API of the image to expand",
        displayOptions: {
          show: {
            operation: ["expandImageAsync"],
          },
        },
      },
      {
        displayName: "Expand Options",
        name: "expandOptions",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        displayOptions: {
          show: {
            operation: ["expandImageAsync"],
          },
        },
        options: [
          {
            displayName: "Height",
            name: "height",
            type: "number",
            default: 2048,
            typeOptions: {
              minValue: 1,
              maxValue: 4096,
            },
            description: "Output image height in pixels (1-4096)",
          },
          {
            displayName: "Horizontal Alignment",
            name: "horizontalAlignment",
            type: "options",
            options: [
              { name: "Center", value: "center" },
              { name: "Left", value: "left" },
              { name: "Right", value: "right" },
            ],
            default: "center",
            description:
              "Horizontal placement of source image in expanded canvas",
          },
          {
            displayName: "Inset Bottom",
            name: "insetBottom",
            type: "number",
            default: 0,
            typeOptions: {
              minValue: 0,
            },
            description: "Margin from bottom edge in pixels",
          },
          {
            displayName: "Inset Left",
            name: "insetLeft",
            type: "number",
            default: 0,
            typeOptions: {
              minValue: 0,
            },
            description: "Margin from left edge in pixels",
          },
          {
            displayName: "Inset Right",
            name: "insetRight",
            type: "number",
            default: 0,
            typeOptions: {
              minValue: 0,
            },
            description: "Margin from right edge in pixels",
          },
          {
            displayName: "Inset Top",
            name: "insetTop",
            type: "number",
            default: 0,
            typeOptions: {
              minValue: 0,
            },
            description: "Margin from top edge in pixels",
          },
          {
            displayName: "Invert Mask",
            name: "invertMask",
            type: "boolean",
            default: false,
            description: "Whether to invert the mask image",
            displayOptions: {
              show: {
                "/expandOptions.maskUploadId": [{ _cnd: { not: "" } }],
              },
            },
          },
          {
            displayName: "Mask Upload ID",
            name: "maskUploadId",
            type: "string",
            default: "",
            placeholder: "123e4567-e89b-12d3-a456-426614174000",
            description: "Upload ID of mask image for selective expansion",
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
            displayName: "Prompt",
            name: "prompt",
            type: "string",
            default: "",
            placeholder: "Pine trees and a forest landscape",
            description:
              "Optional text prompt (1-1024 characters) to guide the expansion",
            typeOptions: {
              rows: 3,
              maxValue: 1024,
            },
          },
          {
            displayName: "Seeds",
            name: "seeds",
            type: "string",
            default: "",
            placeholder: "12345, 67890",
            description:
              "Comma-separated seed image IDs for consistent generation. Must match numVariations if specified.",
          },
          {
            displayName: "Vertical Alignment",
            name: "verticalAlignment",
            type: "options",
            options: [
              { name: "Center", value: "center" },
              { name: "Top", value: "top" },
              { name: "Bottom", value: "bottom" },
            ],
            default: "center",
            description:
              "Vertical placement of source image in expanded canvas",
          },
          {
            displayName: "Width",
            name: "width",
            type: "number",
            default: 2048,
            typeOptions: {
              minValue: 1,
              maxValue: 4096,
            },
            description: "Output image width in pixels (1-4096)",
          },
        ],
      },
      // Fill Image Async parameters
      {
        displayName: "Source Image Upload ID",
        name: "fillSourceImageUploadId",
        type: "string",
        required: true,
        default: "",
        placeholder: "123e4567-e89b-12d3-a456-426614174000",
        description: "Upload ID from storage API of the image to fill",
        displayOptions: {
          show: {
            operation: ["fillImageAsync"],
          },
        },
      },
      {
        displayName: "Mask Upload ID",
        name: "fillMaskUploadId",
        type: "string",
        required: true,
        default: "",
        placeholder: "123e4567-e89b-12d3-a456-426614174000",
        description:
          "Upload ID of mask image defining the area to fill (required)",
        displayOptions: {
          show: {
            operation: ["fillImageAsync"],
          },
        },
      },
      {
        displayName: "Fill Options",
        name: "fillOptions",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        displayOptions: {
          show: {
            operation: ["fillImageAsync"],
          },
        },
        options: [
          {
            displayName: "Invert Mask",
            name: "invertMask",
            type: "boolean",
            default: false,
            description: "Whether to invert the mask image",
          },
          {
            displayName: "Negative Prompt",
            name: "negativePrompt",
            type: "string",
            default: "",
            placeholder: "Avoid these characteristics",
            description:
              "Optional text prompt (max 1024 characters) to avoid certain characteristics",
            typeOptions: {
              rows: 2,
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
            description: "Number of variations to generate (1-4)",
          },
          {
            displayName: "Prompt",
            name: "prompt",
            type: "string",
            default: "",
            placeholder: "A planet in space",
            description:
              "Optional text prompt (1-1024 characters) to guide the fill generation",
            typeOptions: {
              rows: 3,
              maxValue: 1024,
            },
          },
          {
            displayName: "Prompt Biasing Locale Code",
            name: "promptBiasingLocaleCode",
            type: "string",
            default: "",
            placeholder: "en-US",
            description:
              "Locale code (e.g., en-US) to bias content for that region",
          },
          {
            displayName: "Seeds",
            name: "seeds",
            type: "string",
            default: "",
            placeholder: "12345, 67890",
            description:
              "Comma-separated seed image IDs for consistent generation. Must match numVariations if specified.",
          },
          {
            displayName: "Size",
            name: "size",
            type: "options",
            options: [
              { name: "1024x1024 (1:1 Square)", value: "1024x1024" },
              { name: "1152x896 (9:7)", value: "1152x896" },
              { name: "1344x768 (7:4)", value: "1344x768" },
              { name: "1792x2304 (3:4 Portrait)", value: "1792x2304" },
              { name: "2048x2048 (1:1 Square)", value: "2048x2048" },
              { name: "2304x1792 (4:3 Landscape)", value: "2304x1792" },
              { name: "2688x1536 (16:9 Widescreen)", value: "2688x1536" },
              { name: "896x1152 (7:9)", value: "896x1152" },
            ],
            default: "2048x2048",
            description:
              "Output image dimensions. Supported preset sizes for fill operation.",
          },
        ],
      },
      // Generate Video Async parameters
      {
        displayName: "Prompt",
        name: "videoPrompt",
        type: "string",
        required: true,
        default: "",
        placeholder: "A lone figure in a desert looking at the sky",
        description:
          "Text description of the video to generate. The longer the prompt, the better.",
        typeOptions: {
          rows: 4,
        },
        displayOptions: {
          show: {
            operation: ["generateVideoAsync"],
          },
        },
      },
      {
        displayName: "Video Options",
        name: "videoOptions",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        displayOptions: {
          show: {
            operation: ["generateVideoAsync"],
          },
        },
        options: [
          {
            displayName: "Bit Rate Factor",
            name: "bitRateFactor",
            type: "number",
            default: 18,
            typeOptions: {
              minValue: 0,
              maxValue: 63,
            },
            description:
              "Constant rate factor for encoding. 0 = lossless (largest file), 63 = worst quality (smallest file). Suggested range: 17-23.",
          },
          {
            displayName: "Camera Motion",
            name: "cameraMotion",
            type: "options",
            options: [
              { name: "Camera Handheld", value: "camera handheld" },
              { name: "Camera Locked Down", value: "camera locked down" },
              { name: "Camera Pan Left", value: "camera pan left" },
              { name: "Camera Pan Right", value: "camera pan right" },
              { name: "Camera Tilt Down", value: "camera tilt down" },
              { name: "Camera Tilt Up", value: "camera tilt up" },
              { name: "Camera Zoom In", value: "camera zoom in" },
              { name: "Camera Zoom Out", value: "camera zoom out" },
            ],
            default: "camera locked down",
            description: "Camera movement control for the video",
          },
          {
            displayName: "Keyframe Image Upload ID",
            name: "keyframeUploadId",
            type: "string",
            default: "",
            placeholder: "123e4567-e89b-12d3-a456-426614174000",
            description:
              "Upload ID from storage API to use as keyframe (first or last frame)",
          },
          {
            displayName: "Keyframe Position",
            name: "keyframePosition",
            type: "number",
            default: 0,
            typeOptions: {
              minValue: 0,
              maxValue: 1,
              numberPrecision: 2,
            },
            description:
              "Position of keyframe: 0 = first frame, 1 = last frame",
            displayOptions: {
              show: {
                "/videoOptions.keyframeUploadId": [{ _cnd: { not: "" } }],
              },
            },
          },
          {
            displayName: "Prompt Style",
            name: "promptStyle",
            type: "options",
            options: [
              { name: "2D", value: "2d" },
              { name: "3D", value: "3d" },
              { name: "Anime", value: "anime" },
              { name: "Black and White", value: "black and white" },
              { name: "Cinematic", value: "cinematic" },
              { name: "Claymation", value: "claymation" },
              { name: "Fantasy", value: "fantasy" },
              { name: "Line Art", value: "line art" },
              { name: "Stop Motion", value: "stop motion" },
              { name: "Vector Art", value: "vector art" },
            ],
            default: "cinematic",
            description: "Visual style of the generated video",
          },
          {
            displayName: "Seed",
            name: "seed",
            type: "number",
            default: "",
            placeholder: "1842533538",
            description:
              "Seed for reproducible generation (currently only 1 seed supported)",
          },
          {
            displayName: "Shot Angle",
            name: "shotAngle",
            type: "options",
            options: [
              { name: "Aerial Shot", value: "aerial shot" },
              { name: "Eye Level Shot", value: "eye_level shot" },
              { name: "High Angle Shot", value: "high angle shot" },
              { name: "Low Angle Shot", value: "low angle shot" },
              { name: "Top-Down Shot", value: "top-down shot" },
            ],
            default: "eye_level shot",
            description: "Camera angle for the video",
          },
          {
            displayName: "Shot Size",
            name: "shotSize",
            type: "options",
            options: [
              { name: "Close-Up Shot", value: "close-up shot" },
              { name: "Extreme Close-Up", value: "extreme close-up" },
              { name: "Extreme Long Shot", value: "extreme long shot" },
              { name: "Long Shot", value: "long shot" },
              { name: "Medium Shot", value: "medium shot" },
            ],
            default: "medium shot",
            description: "Framing of the shot",
          },
          {
            displayName: "Video Size",
            name: "videoSize",
            type: "options",
            options: [{ name: "720x720 (1:1 Square)", value: "720x720" }],
            default: "720x720",
            description: "Output video dimensions",
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

        if (operation === "expandImageAsync") {
          responseData = await executeExpandImageAsync.call(
            this,
            i,
            fireflyClient,
          );
        } else if (operation === "fillImageAsync") {
          responseData = await executeFillImageAsync.call(
            this,
            i,
            fireflyClient,
          );
        } else if (operation === "generateImagesAsync") {
          responseData = await executeGenerateImagesAsync.call(
            this,
            i,
            fireflyClient,
          );
        } else if (operation === "generateVideoAsync") {
          responseData = await executeGenerateVideoAsync.call(
            this,
            i,
            fireflyClient,
          );
        } else if (operation === "getJobStatus") {
          responseData = await executeGetJobStatus.call(this, i, fireflyClient);
        } else if (operation === "cancelJob") {
          responseData = await executeCancelJob.call(this, i, fireflyClient);
        } else if (operation === "uploadImage") {
          responseData = await executeUploadImage.call(this, i, fireflyClient);
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
