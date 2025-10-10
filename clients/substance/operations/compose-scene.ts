/**
 * 3D Object Composite generation operation
 */

import type { IMSClient } from "../../ims-client";
import type {
  ComposeSceneRequest,
  ComposeSceneResponse,
} from "../types/compose-scene";

export async function composeScene(
  imsClient: IMSClient,
  baseUrl: string,
  requestBody: ComposeSceneRequest,
): Promise<ComposeSceneResponse> {
  const url = `${baseUrl}/v1/composites/compose`;

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
      `Substance composeScene failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const data = (await response.json()) as ComposeSceneResponse;
  if (!data.id) {
    throw new Error("Substance API response missing job id");
  }
  return data;
}
