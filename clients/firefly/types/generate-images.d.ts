/**
 * Types for image generation operations
 * References: .cursor/schema/image_generation_async_v3.json
 */

export type GenerateImagesV3AsyncRequest = {
  // See OpenAPI: #/components/schemas/GenerateImagesRequestV3
  // This is a partial type; extend as needed for your use case.
  prompt: string;
  customModelId?: string;
  [index: string]: string | number | boolean | object | undefined;
};

export type GenerateImagesV3AsyncResponse = {
  // See OpenAPI: #/components/schemas/AsyncAcceptResponseV3
  jobID: string;
  [input: string]: string | number | boolean | object | undefined;
};

