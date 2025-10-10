/**
 * Image fill operation
 */

import type { IMSClient } from "../../ims-client";
import type {
  FillImageV3AsyncRequest,
  FillImageV3AsyncResponse,
} from "../types/fill-image";

export async function fillImageAsync(
  imsClient: IMSClient,
  baseUrl: string,
  requestBody: FillImageV3AsyncRequest,
): Promise<FillImageV3AsyncResponse> {
  const url = `${baseUrl}/v3/images/fill-async`;

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
      `Firefly fillImageAsync failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const data = (await response.json()) as FillImageV3AsyncResponse;
  if (!data.jobId) {
    throw new Error("Firefly API response missing jobId");
  }
  return data;
}

