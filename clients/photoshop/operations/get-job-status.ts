import type { JobStatusResponse } from "../types/common";

/**
 * Get the status of a Photoshop API job using the status URL
 * @param statusUrl - The full status URL from the job response
 * @param headers - Authentication headers from IMS
 * @returns Job status response with jobId, status, and full response when complete
 */
export async function getJobStatus(
  statusUrl: string,
  headers: Record<string, string>,
): Promise<JobStatusResponse> {
  const response = await fetch(statusUrl, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Photoshop API - Get Job Status failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as JobStatusResponse;
}
