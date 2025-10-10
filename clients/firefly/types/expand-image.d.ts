/**
 * Types for image expansion operations
 * References: .cursor/schema/generative_expand_async_v3.json
 */

export type ExpandImageV3AsyncRequest = {
  // See OpenAPI: #/components/schemas/ExpandImageRequestV3
  image: {
    source: {
      uploadId?: string;
      url?: string;
    };
  };
  mask?: {
    source: {
      uploadId?: string;
      url?: string;
    };
    invert?: boolean;
  };
  numVariations?: number; // 1-4
  placement?: {
    alignment?: {
      horizontal?: "center" | "left" | "right";
      vertical?: "center" | "top" | "bottom";
    };
    inset?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
  };
  prompt?: string; // 1-1024 characters
  seeds?: number[]; // 1-4 items
  size?: {
    width: number; // 1-3999
    height: number; // 1-3999
  };
};

export type ExpandImageV3AsyncResponse = {
  // See OpenAPI: #/components/schemas/AsyncAcceptResponseV3
  jobId: string;
  statusUrl: string;
  cancelUrl: string;
};

