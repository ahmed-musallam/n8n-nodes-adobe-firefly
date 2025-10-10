/**
 * Job status polling operation
 */

import type { IMSClient } from "../../ims-client";
import type { SubstanceJobResponse } from "../types/common";

export async function getJobStatus(
  imsClient: IMSClient,
  baseUrl: string,
  jobId: string,
): Promise<SubstanceJobResponse> {
  const url = `${baseUrl}/v1/jobs/${jobId}`;

  const response = await fetch(url, {
    method: "GET",
    headers: await imsClient.getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Substance getJobStatus failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as SubstanceJobResponse;
}
