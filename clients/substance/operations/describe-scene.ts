/**
 * 3D Scene description operation
 */

import type { IMSClient } from "../../ims-client";
import type {
  SceneDescribeRequest,
  SceneDescribeResponse,
} from "../types/describe-scene";

export async function describeScene(
  imsClient: IMSClient,
  baseUrl: string,
  requestBody: SceneDescribeRequest,
): Promise<SceneDescribeResponse> {
  const url = `${baseUrl}/v1/scenes/describe`;

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
      `Substance describeScene failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const data = (await response.json()) as SceneDescribeResponse;
  if (!data.id) {
    throw new Error("Substance API response missing job id");
  }
  return data;
}
