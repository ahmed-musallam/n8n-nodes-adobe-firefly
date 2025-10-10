/**
 * Types for object composite generation operations
 * References: .cursor/schema/generate_object_composite_async_v3.json
 */

export type GenerateObjectCompositeV3AsyncRequest = {
  // See OpenAPI: #/components/schemas/GenerateObjectCompositeRequestV3
  image: {
    source: {
      uploadId?: string;
      url?: string;
    };
  };
  prompt: string; // required, 1-1024 characters
  mask?: {
    source: {
      uploadId?: string;
      url?: string;
    };
  };
  contentClass?: "photo" | "art";
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
  seeds?: number[]; // 1-4 items
  size?: {
    width: number;
    height: number;
  };
  style?: {
    imageReference?: {
      source: {
        uploadId?: string;
        url?: string;
      };
    };
    presets?: string[];
    strength?: number; // exclusive min 0, max 100
  };
};

export type GenerateObjectCompositeV3AsyncResponse = {
  // See OpenAPI: #/components/schemas/AsyncAcceptResponseV3
  jobId: string;
  statusUrl: string;
  cancelUrl: string;
};

