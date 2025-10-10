/**
 * Image generation operations
 */

import type { IMSClient } from "../../ims-client";
import { GenerateImageJobResponse } from "../../ffs-gen-image-job";
import type {
  GenerateImagesV3AsyncRequest,
  GenerateImagesV3AsyncResponse,
} from "../types/generate-images";
import type { ModelVersion } from "../types/common";

export async function generateImagesAsync(
  imsClient: IMSClient,
  baseUrl: string,
  requestBody: GenerateImagesV3AsyncRequest,
  modelVersion?: ModelVersion,
): Promise<GenerateImagesV3AsyncResponse> {
  const url = `${baseUrl}/v3/images/generate-async`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(await imsClient.getAuthHeaders()),
  };
  if (modelVersion) {
    headers["x-model-version"] = modelVersion;
  }

  // clean any properties that are undefined
  Object.keys(requestBody).forEach((key) => {
    if (requestBody[key] === undefined) {
      delete requestBody[key];
    }
  });

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Firefly generateImagesAsync failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const data = (await response.json()) as GenerateImagesV3AsyncResponse;
  if (!data.jobId) {
    throw new Error("Firefly API response missing jobID");
  }
  return data;
}

export async function generateImagesAndWait(
  imsClient: IMSClient,
  baseUrl: string,
  getJobStatusFn: (jobID: string) => Promise<GenerateImageJobResponse>,
  requestBody: GenerateImagesV3AsyncRequest,
  maxRetries: number = 20,
  interval: number = 1000, // 1 second
  modelVersion?: ModelVersion,
): Promise<GenerateImageJobResponse> {
  const genImageResponse = await generateImagesAsync(
    imsClient,
    baseUrl,
    requestBody,
    modelVersion,
  );
  let retries = 0;
  while (retries < maxRetries) {
    const jobStatus = await getJobStatusFn(genImageResponse.jobID);
    if (!["pending", "running"].includes(jobStatus.status)) {
      // job is done if not pending or running
      return jobStatus;
    }
    retries++;
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  throw new Error(
    "Firefly generateImagesAndWait failed: job timed out after " +
      maxRetries +
      " retries over " +
      maxRetries * interval +
      " milliseconds",
  );
}

