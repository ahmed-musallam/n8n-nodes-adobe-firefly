import type { MaskObjectsRequest, MaskObjectsResponse } from "../types/masking";

const BASE_URL = "https://image.adobe.io";

/**
 * Create masks for specific objects in an image
 * @param request - Mask objects request configuration
 * @param headers - Authentication headers from IMS
 * @returns Job submission response
 */
export async function maskObjects(
  request: MaskObjectsRequest,
  headers: Record<string, string>,
): Promise<MaskObjectsResponse> {
  const response = await fetch(`${BASE_URL}/v1/mask-objects`, {
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
      `Photoshop API - Mask Objects failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as MaskObjectsResponse;
}

