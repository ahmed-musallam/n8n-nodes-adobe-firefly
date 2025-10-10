/**
 * 3D Model conversion operation
 */

import type { IMSClient } from "../../ims-client";
import type {
  ModelConvertRequest,
  ModelConvertResponse,
} from "../types/convert-model";

export async function convertModel(
  imsClient: IMSClient,
  baseUrl: string,
  requestBody: ModelConvertRequest,
): Promise<ModelConvertResponse> {
  const url = `${baseUrl}/v1/scenes/convert`;

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
      `Substance convertModel failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const data = (await response.json()) as ModelConvertResponse;
  if (!data.id) {
    throw new Error("Substance API response missing job id");
  }
  return data;
}
