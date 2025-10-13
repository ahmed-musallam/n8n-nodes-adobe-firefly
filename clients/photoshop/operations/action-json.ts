import type {
  ActionJsonRequest,
  ActionJsonResponse,
  ConvertToActionJsonRequest,
  ConvertToActionJsonResponse,
} from "../types/actions";

const BASE_URL = "https://image.adobe.io";

/**
 * Play Photoshop actions in JSON format on an image
 * @param request - Action JSON request configuration
 * @param headers - Authentication headers from IMS
 * @returns Job submission response
 */
export async function playActionJson(
  request: ActionJsonRequest,
  headers: Record<string, string>,
): Promise<ActionJsonResponse> {
  const response = await fetch(`${BASE_URL}/pie/psdService/actionJSON`, {
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
      `Photoshop API - Play Action JSON failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as ActionJsonResponse;
}

/**
 * Convert .atn action files to JSON format
 * @param request - Convert to Action JSON request configuration
 * @param headers - Authentication headers from IMS
 * @returns Job submission response
 */
export async function convertToActionJson(
  request: ConvertToActionJsonRequest,
  headers: Record<string, string>,
): Promise<ConvertToActionJsonResponse> {
  const response = await fetch(`${BASE_URL}/pie/psdService/actionJsonCreate`, {
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
      `Photoshop API - Convert to Action JSON failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as ConvertToActionJsonResponse;
}

