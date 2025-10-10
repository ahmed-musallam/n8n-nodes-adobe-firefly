/**
 * 3D Scene rendering operation (full version)
 */

import type { IMSClient } from "../../ims-client";
import type {
  RenderSceneRequest,
  RenderSceneResponse,
} from "../types/render-scene";

export async function renderScene(
  imsClient: IMSClient,
  baseUrl: string,
  requestBody: RenderSceneRequest,
): Promise<RenderSceneResponse> {
  const url = `${baseUrl}/v1/scenes/render`;

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
      `Substance renderScene failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const data = (await response.json()) as RenderSceneResponse;
  if (!data.id) {
    throw new Error("Substance API response missing job id");
  }
  return data;
}
