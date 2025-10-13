import type {
  InputStorage,
  OutputStorage,
  JobResponse,
  ColorSpace,
} from "./common";

/**
 * Document manifest request
 */
export interface DocumentManifestRequest {
  inputs: InputStorage[];
  options?: {
    thumbnails?: {
      width?: number;
      height?: number;
    };
  };
}

/**
 * Layer structure
 */
export interface Layer {
  id?: number;
  index?: number;
  type?:
    | "layer"
    | "textLayer"
    | "adjustmentLayer"
    | "layerSection"
    | "smartObject"
    | "backgroundLayer";
  name?: string;
  locked?: boolean;
  visible?: boolean;
  bounds?: {
    top?: number;
    left?: number;
    width?: number;
    height?: number;
  };
  children?: Layer[];
}

/**
 * Document create request
 */
export interface DocumentCreateRequest {
  options: {
    document: {
      width: number;
      height: number;
      resolution?: number; // DPI, default 72
      fill?: "white" | "backgroundColor" | "transparent";
      mode?: ColorSpace;
    };
  };
  outputs: OutputStorage[];
}

/**
 * Document operations request
 */
export interface DocumentOperationsRequest {
  inputs: InputStorage[];
  options: {
    layers?: Array<{
      add?: object;
      edit?: object;
      delete?: number | number[];
      move?: object;
      name?: string;
    }>;
  };
  outputs: OutputStorage[];
}

/**
 * Rendition create request
 */
export interface RenditionCreateRequest {
  inputs: InputStorage[];
  outputs: Array<
    OutputStorage & {
      width?: number;
      height?: number;
      quality?: number; // 1-7 for JPEG, 1-12 for PNG
      compression?: CompressionLevel;
      trimToCanvas?: boolean;
      layers?: Array<{
        id?: number;
        name?: string;
      }>;
    }
  >;
}

/**
 * Smart object replacement request
 */
export interface SmartObjectReplaceRequest {
  inputs: InputStorage[];
  options: {
    layers: Array<{
      name?: string;
      id?: number;
      input: InputStorage;
    }>;
  };
  outputs: OutputStorage[];
}

/**
 * Text layer edit request
 */
export interface TextLayerEditRequest {
  inputs: InputStorage[];
  options: {
    fonts?: Array<{
      storage?: string;
      href: string;
    }>;
    layers: Array<{
      name?: string;
      id?: number;
      text?: {
        content?: string;
        characterStyles?: Array<{
          fontSize?: number;
          fontName?: string;
          fontColor?: {
            rgb?: {
              red?: number; // 0-255
              green?: number; // 0-255
              blue?: number; // 0-255
            };
          };
        }>;
        paragraphStyles?: Array<{
          alignment?: "left" | "center" | "right" | "justify";
        }>;
      };
    }>;
  };
  outputs: OutputStorage[];
}

/**
 * Artboard create request
 */
export interface ArtboardCreateRequest {
  inputs: InputStorage[];
  options: {
    artboards: Array<{
      name: string;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
    }>;
  };
  outputs: OutputStorage[];
}

/**
 * Response types for document operations
 */
export type DocumentManifestResponse = JobResponse;
export type DocumentCreateResponse = JobResponse;
export type DocumentOperationsResponse = JobResponse;
export type RenditionCreateResponse = JobResponse;
export type SmartObjectReplaceResponse = JobResponse;
export type TextLayerEditResponse = JobResponse;
export type ArtboardCreateResponse = JobResponse;
