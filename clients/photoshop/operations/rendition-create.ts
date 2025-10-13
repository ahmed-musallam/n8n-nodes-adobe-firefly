import type {
  RenditionCreateRequest,
  RenditionCreateResponse,
} from "../types/document";

const BASE_URL = "https://image.adobe.io";

/**
 * Create renditions (exports) from a PSD document
 * @param request - Rendition create request configuration
 * @param headers - Authentication headers from IMS
 * @returns Job submission response
 */
export async function createRendition(
  request: RenditionCreateRequest,
  headers: Record<string, string>,
): Promise<RenditionCreateResponse> {
  const response = await fetch(`${BASE_URL}/pie/psdService/renditionCreate`, {
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
      `Photoshop API - Create Rendition failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as RenditionCreateResponse;
}

