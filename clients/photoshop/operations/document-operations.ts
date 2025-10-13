import type {
  DocumentOperationsRequest,
  DocumentOperationsResponse,
} from "../types/document";

const BASE_URL = "https://image.adobe.io";

/**
 * Perform operations on a PSD document (add/edit/delete/move layers)
 * @param request - Document operations request configuration
 * @param headers - Authentication headers from IMS
 * @returns Job submission response
 */
export async function modifyDocument(
  request: DocumentOperationsRequest,
  headers: Record<string, string>,
): Promise<DocumentOperationsResponse> {
  const response = await fetch(
    `${BASE_URL}/pie/psdService/documentOperations`,
    {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Photoshop API - Modify Document failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return (await response.json()) as DocumentOperationsResponse;
}

