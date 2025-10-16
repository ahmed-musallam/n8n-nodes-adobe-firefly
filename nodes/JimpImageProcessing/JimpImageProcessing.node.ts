import type {
  IExecuteFunctions,
  INodeType,
  INodeTypeDescription,
  IDataObject,
  IBinaryData,
} from "n8n-workflow";
import { NodeConnectionTypes, ApplicationError } from "n8n-workflow";
import { Jimp, ResizeStrategy } from "jimp";

export class JimpImageProcessing implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Jimp - Image Processing",
    name: "jimpImageProcessing",
    icon: "file:jimp.svg",
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: "Process images with Jimp - resize, crop, and transform",
    defaults: {
      name: "Jimp - Image Processing",
    },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    properties: [
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        options: [
          {
            name: "Ensure Max Size",
            value: "ensureMaxSize",
            description:
              "Ensure image is under max dimensions, resize if larger while maintaining aspect ratio",
            action: "Ensure image is under maximum size",
          },
          {
            name: "Overlay Images",
            value: "overlayImages",
            description:
              "Overlay a foreground image onto a background image with positioning and margins",
            action: "Overlay foreground onto background image",
          },
        ],
        default: "ensureMaxSize",
      },
      {
        displayName: "Binary Property",
        name: "binaryProperty",
        type: "string",
        default: "data",
        required: true,
        description: "Name of the binary property containing the image file",
        displayOptions: {
          show: {
            operation: ["ensureMaxSize"],
          },
        },
      },
      {
        displayName: "Max Width",
        name: "maxWidth",
        type: "number",
        default: 5000,
        required: true,
        description:
          "Maximum width in pixels. Image will be resized if larger while maintaining aspect ratio.",
        typeOptions: {
          minValue: 1,
        },
        displayOptions: {
          show: {
            operation: ["ensureMaxSize"],
          },
        },
      },
      {
        displayName: "Max Height",
        name: "maxHeight",
        type: "number",
        default: 5000,
        required: true,
        description:
          "Maximum height in pixels. Image will be resized if larger while maintaining aspect ratio.",
        typeOptions: {
          minValue: 1,
        },
        displayOptions: {
          show: {
            operation: ["ensureMaxSize"],
          },
        },
      },
      {
        displayName: "Output Property Name",
        name: "outputBinaryProperty",
        type: "string",
        default: "data",
        required: true,
        description: "Name of the binary property to store the processed image",
        displayOptions: {
          show: {
            operation: ["ensureMaxSize"],
          },
        },
      },
      {
        displayName: "Options",
        name: "options",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        displayOptions: {
          show: {
            operation: ["ensureMaxSize"],
          },
        },
        options: [
          {
            displayName: "Resize Algorithm",
            name: "resizeAlgorithm",
            type: "options",
            options: [
              {
                name: "Bilinear",
                value: "bilinearInterpolation",
                description: "Good balance of quality and speed (default)",
              },
              {
                name: "Bicubic",
                value: "bicubicInterpolation",
                description: "Higher quality, slower",
              },
              {
                name: "Nearest Neighbor",
                value: "nearestNeighbor",
                description: "Fastest, lower quality",
              },
            ],
            default: "bilinearInterpolation",
            description: "Algorithm to use for resizing",
          },
          {
            displayName: "Only Resize If Larger",
            name: "onlyResizeIfLarger",
            type: "boolean",
            default: true,
            description:
              "Whether to only resize if image exceeds max dimensions. If false, will also upscale smaller images.",
          },
        ],
      },
      // Overlay Images operation parameters
      {
        displayName: "Background Property",
        name: "backgroundProperty",
        type: "string",
        default: "data",
        required: true,
        description:
          "Name of the binary property containing the background image",
        displayOptions: {
          show: {
            operation: ["overlayImages"],
          },
        },
      },
      {
        displayName: "Foreground Property",
        name: "foregroundProperty",
        type: "string",
        default: "foreground",
        required: true,
        description:
          "Name of the binary property containing the foreground image to overlay",
        displayOptions: {
          show: {
            operation: ["overlayImages"],
          },
        },
      },
      {
        displayName: "Output Property Name",
        name: "overlayOutputProperty",
        type: "string",
        default: "data",
        required: true,
        description:
          "Name of the binary property to store the composited image",
        displayOptions: {
          show: {
            operation: ["overlayImages"],
          },
        },
      },
      {
        displayName: "Horizontal Alignment",
        name: "horizontalAlign",
        type: "options",
        options: [
          {
            name: "Left",
            value: "left",
            description: "Align foreground to the left",
          },
          {
            name: "Center",
            value: "center",
            description: "Center foreground horizontally",
          },
          {
            name: "Right",
            value: "right",
            description: "Align foreground to the right",
          },
        ],
        default: "center",
        description: "Horizontal placement of the foreground image",
        displayOptions: {
          show: {
            operation: ["overlayImages"],
          },
        },
      },
      {
        displayName: "Vertical Alignment",
        name: "verticalAlign",
        type: "options",
        options: [
          {
            name: "Top",
            value: "top",
            description: "Align foreground to the top",
          },
          {
            name: "Middle",
            value: "middle",
            description: "Center foreground vertically",
          },
          {
            name: "Bottom",
            value: "bottom",
            description: "Align foreground to the bottom",
          },
        ],
        default: "middle",
        description: "Vertical placement of the foreground image",
        displayOptions: {
          show: {
            operation: ["overlayImages"],
          },
        },
      },
      {
        displayName: "Inset (Margins)",
        name: "insets",
        type: "collection",
        placeholder: "Add Inset",
        default: {},
        description:
          "Margins between the edge of the background and the foreground image",
        displayOptions: {
          show: {
            operation: ["overlayImages"],
          },
        },
        options: [
          {
            displayName: "Top",
            name: "top",
            type: "number",
            default: 0,
            description: "Top margin in pixels",
            typeOptions: {
              minValue: 0,
            },
          },
          {
            displayName: "Bottom",
            name: "bottom",
            type: "number",
            default: 0,
            description: "Bottom margin in pixels",
            typeOptions: {
              minValue: 0,
            },
          },
          {
            displayName: "Left",
            name: "left",
            type: "number",
            default: 0,
            description: "Left margin in pixels",
            typeOptions: {
              minValue: 0,
            },
          },
          {
            displayName: "Right",
            name: "right",
            type: "number",
            default: 0,
            description: "Right margin in pixels",
            typeOptions: {
              minValue: 0,
            },
          },
        ],
      },
      {
        displayName: "Overlay Options",
        name: "overlayOptions",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        displayOptions: {
          show: {
            operation: ["overlayImages"],
          },
        },
        options: [
          {
            displayName: "Resize Algorithm",
            name: "resizeAlgorithm",
            type: "options",
            options: [
              {
                name: "Bilinear",
                value: "bilinearInterpolation",
                description: "Good balance of quality and speed (default)",
              },
              {
                name: "Bicubic",
                value: "bicubicInterpolation",
                description: "Higher quality, slower",
              },
              {
                name: "Nearest Neighbor",
                value: "nearestNeighbor",
                description: "Fastest, lower quality",
              },
            ],
            default: "bilinearInterpolation",
            description: "Algorithm to use for resizing foreground",
          },
          {
            displayName: "Opacity",
            name: "opacity",
            type: "number",
            default: 1,
            description: "Opacity of the foreground image (0-1)",
            typeOptions: {
              minValue: 0,
              maxValue: 1,
              numberPrecision: 2,
            },
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<{ json: IDataObject }[][]> {
    const items = this.getInputData();
    const returnData: Array<{
      json: IDataObject;
      binary?: Record<string, IBinaryData>;
    }> = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const operation = this.getNodeParameter("operation", i) as string;

        if (operation === "ensureMaxSize") {
          const binaryProperty = this.getNodeParameter(
            "binaryProperty",
            i,
          ) as string;
          const maxWidth = this.getNodeParameter("maxWidth", i) as number;
          const maxHeight = this.getNodeParameter("maxHeight", i) as number;
          const outputBinaryProperty = this.getNodeParameter(
            "outputBinaryProperty",
            i,
          ) as string;
          const options = this.getNodeParameter(
            "options",
            i,
            {},
          ) as IDataObject;

          const resizeAlgorithm =
            (options.resizeAlgorithm as string) || "bilinearInterpolation";
          const onlyResizeIfLarger = options.onlyResizeIfLarger !== false;

          // Get binary data
          const binaryData = this.helpers.assertBinaryData(i, binaryProperty);
          const binaryDataBuffer = await this.helpers.getBinaryDataBuffer(
            i,
            binaryProperty,
          );

          // Read image with Jimp
          let image;
          try {
            image = await Jimp.fromBuffer(binaryDataBuffer);
          } catch (error) {
            throw new ApplicationError(
              `Failed to read image: ${(error as Error).message}`,
              { level: "warning" },
            );
          }

          const originalWidth = image.width;
          const originalHeight = image.height;
          let resized = false;
          let newWidth = originalWidth;
          let newHeight = originalHeight;

          // Check if resizing is needed
          const needsResize =
            originalWidth > maxWidth || originalHeight > maxHeight;

          if (needsResize || !onlyResizeIfLarger) {
            // Calculate aspect ratio
            const aspectRatio = originalWidth / originalHeight;

            // Determine new dimensions while maintaining aspect ratio
            if (originalWidth > maxWidth || originalHeight > maxHeight) {
              if (aspectRatio > 1) {
                // Landscape: width is larger
                newWidth = Math.min(maxWidth, originalWidth);
                newHeight = Math.round(newWidth / aspectRatio);

                // If height still exceeds max, recalculate based on height
                if (newHeight > maxHeight) {
                  newHeight = maxHeight;
                  newWidth = Math.round(newHeight * aspectRatio);
                }
              } else {
                // Portrait or square: height is larger or equal
                newHeight = Math.min(maxHeight, originalHeight);
                newWidth = Math.round(newHeight * aspectRatio);

                // If width still exceeds max, recalculate based on width
                if (newWidth > maxWidth) {
                  newWidth = maxWidth;
                  newHeight = Math.round(newWidth / aspectRatio);
                }
              }

              // Map resize algorithm to Jimp constants
              let resizeMode = ResizeStrategy.BILINEAR;
              if (resizeAlgorithm === "bicubicInterpolation") {
                resizeMode = ResizeStrategy.BICUBIC;
              } else if (resizeAlgorithm === "nearestNeighbor") {
                resizeMode = ResizeStrategy.NEAREST_NEIGHBOR;
              }

              // Resize the image
              image.resize({ w: newWidth, h: newHeight, mode: resizeMode });
              resized = true;
            }
          }

          // Convert to buffer
          // Get the buffer based on the mime type
          const mimeType = binaryData.mimeType || "image/jpeg";
          const processedBuffer = await image.getBuffer(
            mimeType as
              | "image/jpeg"
              | "image/bmp"
              | "image/tiff"
              | "image/x-ms-bmp"
              | "image/gif"
              | "image/png",
          );

          // Determine file extension
          let fileExtension = "jpg";
          if (mimeType.includes("png")) fileExtension = "png";
          else if (mimeType.includes("gif")) fileExtension = "gif";
          else if (mimeType.includes("bmp")) fileExtension = "bmp";
          else if (mimeType.includes("tiff")) fileExtension = "tiff";

          // Prepare output binary data
          const newBinaryData: IBinaryData = {
            data: processedBuffer.toString("base64"),
            mimeType: mimeType,
            fileName: binaryData.fileName || `processed-image.${fileExtension}`,
            fileExtension: fileExtension,
          };

          // Prepare JSON output with details
          const jsonData: IDataObject = {
            originalWidth,
            originalHeight,
            newWidth,
            newHeight,
            resized,
            fileSize: processedBuffer.length,
            mimeType: mimeType,
            fileName: newBinaryData.fileName,
          };

          // Copy existing binary data and add/replace the processed image
          const binaryDataCopy = { ...items[i].binary };
          binaryDataCopy[outputBinaryProperty] = newBinaryData;

          returnData.push({
            json: jsonData,
            binary: binaryDataCopy,
          });
        } else if (operation === "overlayImages") {
          // Get parameters
          const backgroundProperty = this.getNodeParameter(
            "backgroundProperty",
            i,
          ) as string;
          const foregroundProperty = this.getNodeParameter(
            "foregroundProperty",
            i,
          ) as string;
          const overlayOutputProperty = this.getNodeParameter(
            "overlayOutputProperty",
            i,
          ) as string;
          const horizontalAlign = this.getNodeParameter(
            "horizontalAlign",
            i,
          ) as string;
          const verticalAlign = this.getNodeParameter(
            "verticalAlign",
            i,
          ) as string;
          const insets = this.getNodeParameter("insets", i, {}) as IDataObject;
          const overlayOptions = this.getNodeParameter(
            "overlayOptions",
            i,
            {},
          ) as IDataObject;

          // Get inset values
          const insetTop = (insets.top as number) || 0;
          const insetBottom = (insets.bottom as number) || 0;
          const insetLeft = (insets.left as number) || 0;
          const insetRight = (insets.right as number) || 0;

          // Get overlay options
          const resizeAlgorithm =
            (overlayOptions.resizeAlgorithm as string) ||
            "bilinearInterpolation";
          const opacity =
            (overlayOptions.opacity as number) !== undefined
              ? (overlayOptions.opacity as number)
              : 1;

          // Get binary data for background
          const backgroundBinaryData = this.helpers.assertBinaryData(
            i,
            backgroundProperty,
          );
          const backgroundBuffer = await this.helpers.getBinaryDataBuffer(
            i,
            backgroundProperty,
          );

          // Get binary data for foreground
          this.helpers.assertBinaryData(i, foregroundProperty);
          const foregroundBuffer = await this.helpers.getBinaryDataBuffer(
            i,
            foregroundProperty,
          );

          // Read images with Jimp
          let background;
          let foreground;
          try {
            background = await Jimp.fromBuffer(backgroundBuffer);
            foreground = await Jimp.fromBuffer(foregroundBuffer);
          } catch (error) {
            throw new ApplicationError(
              `Failed to read images: ${(error as Error).message}`,
              { level: "warning" },
            );
          }

          const bgWidth = background.width;
          const bgHeight = background.height;
          const fgWidth = foreground.width;
          const fgHeight = foreground.height;

          // Calculate available space after insets
          const availableWidth = bgWidth - insetLeft - insetRight;
          const availableHeight = bgHeight - insetTop - insetBottom;

          if (availableWidth <= 0 || availableHeight <= 0) {
            throw new ApplicationError(
              "Insets are too large - no space available for foreground image",
              { level: "warning" },
            );
          }

          // Calculate foreground aspect ratio
          const fgAspectRatio = fgWidth / fgHeight;

          // Fit foreground within available space while maintaining aspect ratio
          let newFgWidth = availableWidth;
          let newFgHeight = availableWidth / fgAspectRatio;

          // If height exceeds available height, scale based on height instead
          if (newFgHeight > availableHeight) {
            newFgHeight = availableHeight;
            newFgWidth = availableHeight * fgAspectRatio;
          }

          // Round to integers
          newFgWidth = Math.round(newFgWidth);
          newFgHeight = Math.round(newFgHeight);

          // Map resize algorithm
          let resizeMode = ResizeStrategy.BILINEAR;
          if (resizeAlgorithm === "bicubicInterpolation") {
            resizeMode = ResizeStrategy.BICUBIC;
          } else if (resizeAlgorithm === "nearestNeighbor") {
            resizeMode = ResizeStrategy.NEAREST_NEIGHBOR;
          }

          // Resize foreground if needed
          if (newFgWidth !== fgWidth || newFgHeight !== fgHeight) {
            foreground.resize({
              w: newFgWidth,
              h: newFgHeight,
              mode: resizeMode,
            });
          }

          // Apply opacity if not 1
          if (opacity !== 1) {
            foreground.opacity(opacity);
          }

          // Calculate position based on alignment
          let x = insetLeft;
          let y = insetTop;

          // Horizontal alignment
          if (horizontalAlign === "center") {
            x = insetLeft + Math.round((availableWidth - newFgWidth) / 2);
          } else if (horizontalAlign === "right") {
            x = bgWidth - insetRight - newFgWidth;
          }

          // Vertical alignment
          if (verticalAlign === "middle") {
            y = insetTop + Math.round((availableHeight - newFgHeight) / 2);
          } else if (verticalAlign === "bottom") {
            y = bgHeight - insetBottom - newFgHeight;
          }

          // Composite the images
          background.composite(foreground, x, y);

          // Convert to buffer
          const mimeType = backgroundBinaryData.mimeType || "image/png";
          const compositedBuffer = await background.getBuffer(
            mimeType as
              | "image/png"
              | "image/bmp"
              | "image/tiff"
              | "image/x-ms-bmp"
              | "image/gif"
              | "image/jpeg",
          );

          // Determine file extension
          let fileExtension = "png";
          if (mimeType.includes("jpeg") || mimeType.includes("jpg")) {
            fileExtension = "jpg";
          } else if (mimeType.includes("gif")) fileExtension = "gif";
          else if (mimeType.includes("bmp")) fileExtension = "bmp";
          else if (mimeType.includes("tiff")) fileExtension = "tiff";

          // Prepare output binary data
          const newBinaryData: IBinaryData = {
            data: compositedBuffer.toString("base64"),
            mimeType: mimeType,
            fileName:
              backgroundBinaryData.fileName ||
              `composited-image.${fileExtension}`,
            fileExtension: fileExtension,
          };

          // Prepare JSON output with details
          const jsonData: IDataObject = {
            backgroundWidth: bgWidth,
            backgroundHeight: bgHeight,
            foregroundOriginalWidth: fgWidth,
            foregroundOriginalHeight: fgHeight,
            foregroundResizedWidth: newFgWidth,
            foregroundResizedHeight: newFgHeight,
            positionX: x,
            positionY: y,
            insets: {
              top: insetTop,
              bottom: insetBottom,
              left: insetLeft,
              right: insetRight,
            },
            alignment: {
              horizontal: horizontalAlign,
              vertical: verticalAlign,
            },
            fileSize: compositedBuffer.length,
            mimeType: mimeType,
            fileName: newBinaryData.fileName,
          };

          // Copy existing binary data and add/replace the composited image
          const binaryDataCopy = { ...items[i].binary };
          binaryDataCopy[overlayOutputProperty] = newBinaryData;

          returnData.push({
            json: jsonData,
            binary: binaryDataCopy,
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
        throw error;
      }
    }

    return [returnData];
  }
}
