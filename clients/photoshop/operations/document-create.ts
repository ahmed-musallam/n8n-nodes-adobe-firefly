import type {
  DocumentCreateRequest,
  DocumentCreateResponse,
} from "../types/document";

const BASE_URL = "https://image.adobe.io";

/**
 * Create a new PSD document
 * @param request - Document create request configuration
 * @param headers - Authentication headers from IMS
 * @returns Job submission response
 */
export async function createDocument(
  request: DocumentCreateRequest,
  headers: Record<string, string>,
): Promise<DocumentCreateResponse> {
  const response = await fetch(`${BASE_URL}/pie/psdService/documentCreate`, {
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
      `Photoshop API - Create Document failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as DocumentCreateResponse;
}
