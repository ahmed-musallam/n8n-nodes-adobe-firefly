/**
 * Video generation operation
 */

import type { IMSClient } from "../../ims-client";
import type {
  GenerateVideoV3AsyncRequest,
  GenerateVideoV3AsyncResponse,
} from "../types/generate-video";
import type { VideoModelVersion } from "../types/common";

export async function generateVideoAsync(
  imsClient: IMSClient,
  baseUrl: string,
  requestBody: GenerateVideoV3AsyncRequest,
  modelVersion?: VideoModelVersion,
): Promise<GenerateVideoV3AsyncResponse> {
  const url = `${baseUrl}/v3/videos/generate`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(await imsClient.getAuthHeaders()),
  };
  if (modelVersion) {
    headers["x-model-version"] = modelVersion;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Firefly generateVideoAsync failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const data = (await response.json()) as GenerateVideoV3AsyncResponse;
  if (!data.jobId) {
    throw new Error("Firefly API response missing jobId");
  }
  return data;
}

