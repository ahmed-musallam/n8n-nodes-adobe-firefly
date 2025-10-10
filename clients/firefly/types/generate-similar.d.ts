/**
 * Types for similar image generation operations
 * References: .cursor/schema/generate_similar_async_v3.json
 */

export type GenerateSimilarImagesV3AsyncRequest = {
  // See OpenAPI: #/components/schemas/GenerateSimilarImagesRequestV3
  image: {
    source: {
      uploadId?: string;
      url?: string;
    };
  };
  numVariations?: number; // 1-4
  seeds?: number[]; // 1-4 items
  size?: {
    width: number;
    height: number;
  };
};

export type GenerateSimilarImagesV3AsyncResponse = {
  // See OpenAPI: #/components/schemas/AsyncAcceptResponseV3
  jobId: string;
  statusUrl: string;
  cancelUrl: string;
};

