import type {
  ArtboardCreateRequest,
  ArtboardCreateResponse,
} from "../types/document";

const BASE_URL = "https://image.adobe.io";

/**
 * Create artboards in a PSD document
 * @param request - Artboard create request configuration
 * @param headers - Authentication headers from IMS
 * @returns Job submission response
 */
export async function createArtboard(
  request: ArtboardCreateRequest,
  headers: Record<string, string>,
): Promise<ArtboardCreateResponse> {
  const response = await fetch(`${BASE_URL}/pie/psdService/artboardCreate`, {
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
      `Photoshop API - Create Artboard failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as ArtboardCreateResponse;
}

