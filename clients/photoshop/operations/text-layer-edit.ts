import type {
  TextLayerEditRequest,
  TextLayerEditResponse,
} from "../types/document";

const BASE_URL = "https://image.adobe.io";

/**
 * Edit text layers in a PSD document
 * @param request - Text layer edit request configuration
 * @param headers - Authentication headers from IMS
 * @returns Job submission response
 */
export async function editTextLayer(
  request: TextLayerEditRequest,
  headers: Record<string, string>,
): Promise<TextLayerEditResponse> {
  const response = await fetch(`${BASE_URL}/pie/psdService/text`, {
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
      `Photoshop API - Edit Text Layer failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as TextLayerEditResponse;
}

