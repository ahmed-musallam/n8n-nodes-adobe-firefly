/**
 * Adobe Photoshop API Client
 * Modular client for interacting with Adobe Photoshop API
 */

export { PhotoshopClient } from "./photoshop-client";
export type { PhotoshopClientOptions } from "./photoshop-client";

// Common types
export type {
  JobStatus,
  StorageType,
  InputStorage,
  OutputStorage,
  JobResponse,
  JobOutput,
  JobStatusResponse,
  ImageFormat,
  ColorSpace,
  CompressionLevel,
} from "./types/common";

// Remove background types (v2)
export type {
  UrlResource,
  RemoveBgInputImage,
  RemoveBgMode,
  RemoveBgOutputMediaType,
  RemoveBgOutputImageOptions,
  RemoveBgColor,
  RemoveBackgroundRequest,
  RemoveBackgroundResponse,
} from "./types/remove-background";

// Masking types
export type {
  CreateMaskRequest,
  ObjectType,
  BodyPartType,
  MaskObjectsRequest,
  MaskBodyPartsRequest,
  RefineMaskRequest,
  FillMaskedAreasRequest,
  CreateMaskResponse,
  MaskObjectsResponse,
  MaskBodyPartsResponse,
  RefineMaskResponse,
  FillMaskedAreasResponse,
} from "./types/masking";

// Document types
export type {
  DocumentManifestRequest,
  Layer,
  DocumentCreateRequest,
  DocumentOperationsRequest,
  RenditionCreateRequest,
  SmartObjectReplaceRequest,
  TextLayerEditRequest,
  ArtboardCreateRequest,
  DocumentManifestResponse,
  DocumentCreateResponse,
  DocumentOperationsResponse,
  RenditionCreateResponse,
  SmartObjectReplaceResponse,
  TextLayerEditResponse,
  ArtboardCreateResponse,
} from "./types/document";

// Actions types
export type {
  PhotoshopActionRequest,
  ActionJsonRequest,
  ConvertToActionJsonRequest,
  PhotoshopActionResponse,
  ActionJsonResponse,
  ConvertToActionJsonResponse,
} from "./types/actions";

// Effects types
export type {
  AutoCropRequest,
  DepthBlurRequest,
  AutoCropResponse,
  DepthBlurResponse,
} from "./types/effects";
