import type {
  MaskBodyPartsRequest,
  MaskBodyPartsResponse,
} from "../types/masking";

const BASE_URL = "https://image.adobe.io";

/**
 * Create masks for specific body parts in an image
 * @param request - Mask body parts request configuration
 * @param headers - Authentication headers from IMS
 * @returns Job submission response
 */
export async function maskBodyParts(
  request: MaskBodyPartsRequest,
  headers: Record<string, string>,
): Promise<MaskBodyPartsResponse> {
  const response = await fetch(`${BASE_URL}/v1/mask-body-parts`, {
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
      `Photoshop API - Mask Body Parts failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as MaskBodyPartsResponse;
}

