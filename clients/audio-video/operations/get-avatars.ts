import type { GetAvatarsResponse } from "../types/avatar";

const BASE_URL = "https://audio-video-api.adobe.io/v1";

/**
 * Get available avatars for avatar generation
 * @param authHeaders - Authentication headers (Bearer token + x-api-key)
 * @returns List of available avatars
 */
export async function getAvatars(
  authHeaders: Record<string, string>,
): Promise<GetAvatarsResponse> {
  const response = await fetch(`${BASE_URL}/avatars`, {
    method: "GET",
    headers: {
      ...authHeaders,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to get avatars: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as GetAvatarsResponse;
}
