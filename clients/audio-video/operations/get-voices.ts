import type { GetVoicesResponse } from "../types/text-to-speech";

const BASE_URL = "https://audio-video-api.adobe.io/v1";

/**
 * Get available voices for text-to-speech
 * @param authHeaders - Authentication headers (Bearer token + x-api-key)
 * @returns List of available voices
 */
export async function getVoices(
  authHeaders: Record<string, string>,
): Promise<GetVoicesResponse> {
  const response = await fetch(`${BASE_URL}/voices`, {
    method: "GET",
    headers: {
      ...authHeaders,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to get voices: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as GetVoicesResponse;
}
