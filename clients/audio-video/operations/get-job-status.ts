import type { JobStatusResponse } from "../types/common";

const BASE_URL = "https://audio-video-api.adobe.io/v1";

/**
 * Get the status of an asynchronous job
 * @param jobId - The job ID to check
 * @param authHeaders - Authentication headers (Bearer token + x-api-key)
 * @returns Job status response
 */
export async function getJobStatus(
  jobId: string,
  authHeaders: Record<string, string>,
): Promise<JobStatusResponse> {
  const response = await fetch(`${BASE_URL}/status/${jobId}`, {
    method: "GET",
    headers: {
      ...authHeaders,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to get job status: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as JobStatusResponse;
}
