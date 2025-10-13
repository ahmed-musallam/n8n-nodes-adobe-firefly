import type { AutoCropRequest, AutoCropResponse } from "../types/effects";

const BASE_URL = "https://image.adobe.io";

/**
 * Automatically crop an image to its content
 * @param request - Auto crop request configuration
 * @param headers - Authentication headers from IMS
 * @returns Job submission response
 */
export async function autoCrop(
  request: AutoCropRequest,
  headers: Record<string, string>,
): Promise<AutoCropResponse> {
  const response = await fetch(`${BASE_URL}/pie/psdService/productCrop`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Photoshop API - Auto Crop failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as AutoCropResponse;
}

