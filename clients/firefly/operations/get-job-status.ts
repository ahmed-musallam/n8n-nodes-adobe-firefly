/**
 * Job status polling operation
 */

import type { IMSClient } from "../../ims-client";
import { GenerateImageJobResponse } from "../../ffs-gen-image-job";

export async function getJobStatus(
  imsClient: IMSClient,
  baseUrl: string,
  jobID: string,
): Promise<GenerateImageJobResponse> {
  const url = `${baseUrl}/v3/status/${jobID}`;
  const response = await fetch(url, {
    method: "GET",
    headers: await imsClient.getAuthHeaders(),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Firefly getJobStatus failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }
  return (await response.json()) as GenerateImageJobResponse;
}

