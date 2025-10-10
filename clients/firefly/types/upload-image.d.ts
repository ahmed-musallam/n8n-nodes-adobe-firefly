/**
 * Types for image upload operations
 * References: .cursor/schema/upload_image.json
 */

export type UploadImageResponse = {
  // See OpenAPI: #/components/schemas/StorageImageResponse (upload_image.json)
  images: Array<{
    id: string;
  }>;
};

