/**
 * 3D Model rendering operation (basic version)
 */

import type { IMSClient } from "../../ims-client";
import type {
  RenderModelRequest,
  RenderModelResponse,
} from "../types/render-model";

export async function renderModel(
  imsClient: IMSClient,
  baseUrl: string,
  requestBody: RenderModelRequest,
): Promise<RenderModelResponse> {
  const url = `${baseUrl}/v1/scenes/render-basic`;

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
      `Substance renderModel failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const data = (await response.json()) as RenderModelResponse;
  if (!data.id) {
    throw new Error("Substance API response missing job id");
  }
  return data;
}
