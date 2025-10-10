/**
 * 3D Scene assembly operation
 */

import type { IMSClient } from "../../ims-client";
import type {
  CreateSceneRequest,
  CreateSceneResponse,
} from "../types/assemble-scene";

export async function assembleScene(
  imsClient: IMSClient,
  baseUrl: string,
  requestBody: CreateSceneRequest,
): Promise<CreateSceneResponse> {
  const url = `${baseUrl}/v1/scenes/assemble`;

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
      `Substance assembleScene failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const data = (await response.json()) as CreateSceneResponse;
  if (!data.id) {
    throw new Error("Substance API response missing job id");
  }
  return data;
}
