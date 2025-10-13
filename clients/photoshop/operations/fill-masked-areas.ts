import type {
  FillMaskedAreasRequest,
  FillMaskedAreasResponse,
} from "../types/masking";

const BASE_URL = "https://image.adobe.io";

/**
 * Fill masked areas with generative or content-aware fill
 * @param request - Fill masked areas request configuration
 * @param headers - Authentication headers from IMS
 * @returns Job submission response
 */
export async function fillMaskedAreas(
  request: FillMaskedAreasRequest,
  headers: Record<string, string>,
): Promise<FillMaskedAreasResponse> {
  const response = await fetch(`${BASE_URL}/v1/fill-masked-areas`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Photoshop API - Fill Masked Areas failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as FillMaskedAreasResponse;
}

