import type { DepthBlurRequest, DepthBlurResponse } from "../types/effects";

const BASE_URL = "https://image.adobe.io";

/**
 * Apply depth-based blur to an image
 * @param request - Depth blur request configuration
 * @param headers - Authentication headers from IMS
 * @returns Job submission response
 */
export async function applyDepthBlur(
  request: DepthBlurRequest,
  headers: Record<string, string>,
): Promise<DepthBlurResponse> {
  const response = await fetch(`${BASE_URL}/pie/psdService/depthBlur`, {
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
      `Photoshop API - Apply Depth Blur failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as DepthBlurResponse;
}

