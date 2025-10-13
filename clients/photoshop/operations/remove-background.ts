import type {
  RemoveBackgroundRequest,
  RemoveBackgroundResponse,
} from "../types/remove-background";

const BASE_URL = "https://image.adobe.io";

/**
 * Remove background from an image (v2)
 * @param request - Remove background request configuration
 * @param headers - Authentication headers from IMS
 * @returns Job submission response
 */
export async function removeBackground(
  request: RemoveBackgroundRequest,
  headers: Record<string, string>,
): Promise<RemoveBackgroundResponse> {
  const response = await fetch(`${BASE_URL}/v2/remove-background`, {
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
      `Photoshop API - Remove Background failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as RemoveBackgroundResponse;
}

