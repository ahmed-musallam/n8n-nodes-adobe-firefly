import type { DubRequest, DubResponse } from "../types/dub";

const BASE_URL = "https://audio-video-api.adobe.io/v1";

/**
 * Dub audio or video to another language
 * @param request - Dubbing request
 * @param authHeaders - Authentication headers (Bearer token + x-api-key)
 * @returns Job submission response with jobId and statusUrl
 */
export async function dub(
  request: DubRequest,
  authHeaders: Record<string, string>,
): Promise<DubResponse> {
  const response = await fetch(`${BASE_URL}/dub`, {
    method: "POST",
    headers: {
      ...authHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request) as BodyInit,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to dub: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as DubResponse;
}
