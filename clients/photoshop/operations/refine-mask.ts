import type { RefineMaskRequest, RefineMaskResponse } from "../types/masking";

const BASE_URL = "https://image.adobe.io";

/**
 * Refine a mask with various adjustment options
 * @param request - Refine mask request configuration
 * @param headers - Authentication headers from IMS
 * @returns Job submission response
 */
export async function refineMask(
  request: RefineMaskRequest,
  headers: Record<string, string>,
): Promise<RefineMaskResponse> {
  const response = await fetch(`${BASE_URL}/v1/refine-mask`, {
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
      `Photoshop API - Refine Mask failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as RefineMaskResponse;
}

