import {
  type IExecuteFunctions,
  type IDataObject,
  LoggerProxy as Logger,
  ApplicationError,
} from "n8n-workflow";
import { readFile } from "fs/promises";
import { FireflyClient } from "../../../clients/ffs-client";

export async function executeUploadImage(
  this: IExecuteFunctions,
  i: number,
  fireflyClient: FireflyClient,
): Promise<IDataObject> {
  const inputType = this.getNodeParameter("inputType", i) as string;

  Logger.info("Uploading image via FireflyClient...", { inputType });

  let binaryDataBuffer: Buffer | undefined;
  let detectedMimeType = "";

  if (inputType === "binary") {
    const items = this.getInputData();
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

  if (detectedMimeType.includes("jpeg") || detectedMimeType.includes("jpg")) {
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

  Logger.info("Upload image response:", { responseData: response });

  return response as unknown as IDataObject;
}
