import type {
  PhotoshopActionRequest,
  PhotoshopActionResponse,
} from "../types/actions";

const BASE_URL = "https://image.adobe.io";

/**
 * Play Photoshop actions (.atn files) on an image
 * @param request - Photoshop action request configuration
 * @param headers - Authentication headers from IMS
 * @returns Job submission response
 */
export async function playPhotoshopActions(
  request: PhotoshopActionRequest,
  headers: Record<string, string>,
): Promise<PhotoshopActionResponse> {
  const response = await fetch(`${BASE_URL}/pie/psdService/photoshopActions`, {
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
      `Photoshop API - Play Photoshop Actions failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as PhotoshopActionResponse;
}

