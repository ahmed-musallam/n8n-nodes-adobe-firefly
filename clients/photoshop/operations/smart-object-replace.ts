import type {
  SmartObjectReplaceRequest,
  SmartObjectReplaceResponse,
} from "../types/document";

const BASE_URL = "https://image.adobe.io";

/**
 * Replace smart objects in a PSD document
 * @param request - Smart object replace request configuration
 * @param headers - Authentication headers from IMS
 * @returns Job submission response
 */
export async function replaceSmartObject(
  request: SmartObjectReplaceRequest,
  headers: Record<string, string>,
): Promise<SmartObjectReplaceResponse> {
  const response = await fetch(`${BASE_URL}/pie/psdService/smartObject`, {
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
      `Photoshop API - Replace Smart Object failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as SmartObjectReplaceResponse;
}

