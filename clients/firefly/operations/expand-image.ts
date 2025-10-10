/**
 * Image expansion operation
 */

import type { IMSClient } from "../../ims-client";
import type {
  ExpandImageV3AsyncRequest,
  ExpandImageV3AsyncResponse,
} from "../types/expand-image";

export async function expandImageAsync(
  imsClient: IMSClient,
  baseUrl: string,
  requestBody: ExpandImageV3AsyncRequest,
): Promise<ExpandImageV3AsyncResponse> {
  const url = `${baseUrl}/v3/images/expand-async`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(await imsClient.getAuthHeaders()),
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Firefly expandImageAsync failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const data = (await response.json()) as ExpandImageV3AsyncResponse;
  if (!data.jobId) {
    throw new Error("Firefly API response missing jobId");
  }
  return data;
}

