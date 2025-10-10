/**
 * Types for image fill operations
 * References: .cursor/schema/generative_fill_async_v3.json
 */

export type FillImageV3AsyncRequest = {
  // See OpenAPI: #/components/schemas/FillImageRequestV3
  image: {
    source: {
      uploadId?: string;
      url?: string;
    };
  };
  mask: {
    // Required
    source: {
      uploadId?: string;
      url?: string;
    };
    invert?: boolean;
  };
  negativePrompt?: string; // max 1024 characters
  numVariations?: number; // 1-4
  prompt?: string; // 1-1024 characters
  promptBiasingLocaleCode?: string;
  seeds?: number[]; // 1-4 items
  size?: {
    width: number;
    height: number;
  };
};

export type FillImageV3AsyncResponse = {
  // See OpenAPI: #/components/schemas/AsyncAcceptResponseV3
  jobId: string;
  statusUrl: string;
  cancelUrl: string;
};

