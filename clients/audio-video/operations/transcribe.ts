import type {
  TranscribeRequest,
  TranscribeResponse,
} from "../types/transcribe";

const BASE_URL = "https://audio-video-api.adobe.io/v1";

/**
 * Transcribe audio or video to text
 * @param request - Transcription request
 * @param authHeaders - Authentication headers (Bearer token + x-api-key)
 * @returns Job submission response with jobId and statusUrl
 */
export async function transcribe(
  request: TranscribeRequest,
  authHeaders: Record<string, string>,
): Promise<TranscribeResponse> {
  const response = await fetch(`${BASE_URL}/transcribe`, {
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
      `Failed to transcribe: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as TranscribeResponse;
}
