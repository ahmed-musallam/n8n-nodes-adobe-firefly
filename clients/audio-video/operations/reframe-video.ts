import type {
  ReframeVideoRequest,
  ReframeVideoResponse,
} from "../types/reframe";

const BASE_URL = "https://audio-video-api.adobe.io/v1";

/**
 * Reframe video using AI
 * @param request - Video reframing request
 * @param authHeaders - Authentication headers (Bearer token + x-api-key)
 * @returns Job submission response with jobId and statusUrl
 */
export async function reframeVideo(
  request: ReframeVideoRequest,
  authHeaders: Record<string, string>,
): Promise<ReframeVideoResponse> {
  const response = await fetch(`${BASE_URL}/reframe`, {
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
      `Failed to reframe video: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as ReframeVideoResponse;
}
