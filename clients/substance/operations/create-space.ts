/**
 * Space creation operation (file upload)
 */

import type { IMSClient } from "../../ims-client";
import type { SubstanceSpace } from "../types/common";

export async function createSpace(
  imsClient: IMSClient,
  baseUrl: string,
  file: Blob | Uint8Array | ArrayBuffer,
  filename: string,
  name?: string,
): Promise<SubstanceSpace> {
  const url = `${baseUrl}/v1/spaces`;

  const formData = new FormData();
  // Convert to Blob if needed
  const fileBlob = file instanceof Blob ? file : new Blob([file as BlobPart]);
  formData.append("filename", fileBlob, filename);
  if (name) {
    formData.append("name", name);
  }

  const headers = await imsClient.getAuthHeaders();
  // Don't set Content-Type - let the browser set it with boundary for multipart/form-data

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData as BodyInit,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Substance createSpace failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const data = (await response.json()) as SubstanceSpace;
  if (!data.id) {
    throw new Error("Substance API response missing space id");
  }
  return data;
}
