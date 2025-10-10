/**
 * Similar images generation operation
 */

import type { IMSClient } from "../../ims-client";
import type {
  GenerateSimilarImagesV3AsyncRequest,
  GenerateSimilarImagesV3AsyncResponse,
} from "../types/generate-similar";
import type { ModelVersion } from "../types/common";

export async function generateSimilarImagesAsync(
  imsClient: IMSClient,
  baseUrl: string,
  requestBody: GenerateSimilarImagesV3AsyncRequest,
  modelVersion?: ModelVersion,
): Promise<GenerateSimilarImagesV3AsyncResponse> {
  const url = `${baseUrl}/v3/images/generate-similar-async`;

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
      `Firefly generateSimilarImagesAsync failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const data =
    (await response.json()) as GenerateSimilarImagesV3AsyncResponse;
  if (!data.jobId) {
    throw new Error("Firefly API response missing jobId");
  }
  return data;
}

