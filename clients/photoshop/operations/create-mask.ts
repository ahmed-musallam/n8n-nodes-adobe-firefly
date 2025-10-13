import type { CreateMaskRequest, CreateMaskResponse } from "../types/masking";

const BASE_URL = "https://image.adobe.io";

/**
 * Create a mask from an image (deprecated, use mask-objects instead)
 * @param request - Create mask request configuration
 * @param headers - Authentication headers from IMS
 * @returns Job submission response
 */
export async function createMask(
  request: CreateMaskRequest,
  headers: Record<string, string>,
): Promise<CreateMaskResponse> {
  const response = await fetch(`${BASE_URL}/sensei/mask`, {
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
      `Photoshop API - Create Mask failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as CreateMaskResponse;
}

