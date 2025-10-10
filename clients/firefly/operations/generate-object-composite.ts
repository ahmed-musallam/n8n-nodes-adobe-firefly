/**
 * Object composite generation operation
 */

import type { IMSClient } from "../../ims-client";
import type {
  GenerateObjectCompositeV3AsyncRequest,
  GenerateObjectCompositeV3AsyncResponse,
} from "../types/generate-object-composite";

export async function generateObjectCompositeAsync(
  imsClient: IMSClient,
  baseUrl: string,
  requestBody: GenerateObjectCompositeV3AsyncRequest,
): Promise<GenerateObjectCompositeV3AsyncResponse> {
  const url = `${baseUrl}/v3/images/generate-object-composite-async`;

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
      `Firefly generateObjectCompositeAsync failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const data =
    (await response.json()) as GenerateObjectCompositeV3AsyncResponse;
  if (!data.jobId) {
    throw new Error("Firefly API response missing jobId");
  }
  return data;
}

