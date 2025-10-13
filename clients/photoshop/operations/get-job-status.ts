import type { JobStatusResponse } from "../types/common";

const BASE_URL = "https://image.adobe.io";

/**
 * Get the status of a Photoshop API job (PSD operations)
 * @param jobId - The job ID to check
 * @param headers - Authentication headers from IMS
 * @returns Job status response
 */
export async function getJobStatus(
  jobId: string,
  headers: Record<string, string>,
): Promise<JobStatusResponse> {
  const response = await fetch(`${BASE_URL}/pie/psdService/status/${jobId}`, {
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

/**
 * Get the status of a masking/background removal job (v2)
 * @param jobId - The job ID to check
 * @param headers - Authentication headers from IMS
 * @returns Job status response
 */
export async function getMaskingJobStatus(
  jobId: string,
  headers: Record<string, string>,
): Promise<JobStatusResponse> {
  const response = await fetch(`${BASE_URL}/v2/status/${jobId}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Photoshop API - Get Masking Job Status failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as JobStatusResponse;
}

/**
 * Get the status of a masking job (v1)
 * @param jobId - The job ID to check
 * @param headers - Authentication headers from IMS
 * @returns Job status response
 */
export async function getMaskingJobStatusV1(
  jobId: string,
  headers: Record<string, string>,
): Promise<JobStatusResponse> {
  const response = await fetch(`${BASE_URL}/v1/status/${jobId}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Photoshop API - Get Masking Job Status (v1) failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as JobStatusResponse;
}

