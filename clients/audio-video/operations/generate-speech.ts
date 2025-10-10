import type {
  GenerateSpeechRequest,
  GenerateSpeechResponse,
} from "../types/text-to-speech";

const BASE_URL = "https://audio-video-api.adobe.io/v1";

/**
 * Generate speech from text (text-to-speech)
 * @param request - Speech generation request
 * @param authHeaders - Authentication headers (Bearer token + x-api-key)
 * @returns Job submission response with jobId and statusUrl
 */
export async function generateSpeech(
  request: GenerateSpeechRequest,
  authHeaders: Record<string, string>,
): Promise<GenerateSpeechResponse> {
  const response = await fetch(`${BASE_URL}/generate-speech`, {
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
      `Failed to generate speech: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as GenerateSpeechResponse;
}
