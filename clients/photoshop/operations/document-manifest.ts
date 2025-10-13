import type {
  DocumentManifestRequest,
  DocumentManifestResponse,
} from "../types/document";

const BASE_URL = "https://image.adobe.io";

/**
 * Get document manifest (layer structure and metadata)
 * @param request - Document manifest request configuration
 * @param headers - Authentication headers from IMS
 * @returns Job submission response
 */
export async function getDocumentManifest(
  request: DocumentManifestRequest,
  headers: Record<string, string>,
): Promise<DocumentManifestResponse> {
  const response = await fetch(`${BASE_URL}/pie/psdService/documentManifest`, {
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
      `Photoshop API - Get Document Manifest failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as DocumentManifestResponse;
}

