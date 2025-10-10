/**
 * Job cancellation operation
 */

import type { IMSClient } from "../../ims-client";

export async function cancelJob(
  imsClient: IMSClient,
  baseUrl: string,
  jobID: string,
): Promise<void> {
  const url = `${baseUrl}/v3/cancel/${jobID}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: await imsClient.getAuthHeaders(),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Firefly cancelJob failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }
}

