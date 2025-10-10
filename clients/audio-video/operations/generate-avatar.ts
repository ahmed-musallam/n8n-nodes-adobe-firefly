import type {
  GenerateAvatarRequest,
  GenerateAvatarResponse,
} from "../types/avatar";

const BASE_URL = "https://audio-video-api.adobe.io/v1";

/**
 * Generate avatar video from text or audio
 * @param request - Avatar generation request
 * @param authHeaders - Authentication headers (Bearer token + x-api-key)
 * @returns Job submission response with jobId and statusUrl
 */
export async function generateAvatar(
  request: GenerateAvatarRequest,
  authHeaders: Record<string, string>,
): Promise<GenerateAvatarResponse> {
  const response = await fetch(`${BASE_URL}/generate-avatar`, {
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
      `Failed to generate avatar: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as GenerateAvatarResponse;
}
