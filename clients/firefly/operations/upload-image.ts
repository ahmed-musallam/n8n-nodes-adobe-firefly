/**
 * Image upload operation
 */

import type { IMSClient } from "../../ims-client";
import type { UploadImageResponse } from "../types/upload-image";

export async function uploadImage(
  imsClient: IMSClient,
  baseUrl: string,
  imageData: Uint8Array | Blob | ArrayBuffer,
  contentType: "image/jpeg" | "image/png" | "image/webp",
): Promise<UploadImageResponse> {
  const url = `${baseUrl}/v2/storage/image`;

  const headers: Record<string, string> = {
    "Content-Type": contentType,
    ...(await imsClient.getAuthHeaders()),
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: imageData as BodyInit,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Firefly uploadImage failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const data = (await response.json()) as UploadImageResponse;
  if (!data.images || data.images.length === 0) {
    throw new Error("Firefly API response missing image IDs");
  }
  return data;
}

