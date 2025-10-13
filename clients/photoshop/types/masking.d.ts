import type { InputStorage, OutputStorage, JobResponse } from "./common";

/**
 * Request body for create mask
 */
export interface CreateMaskRequest {
  input: InputStorage;
  output: OutputStorage;
}

/**
 * Object type for object masking
 */
export type ObjectType =
  | "person"
  | "dog"
  | "cat"
  | "bird"
  | "product"
  | "accessory"
  | "vehicle"
  | "furniture"
  | "plant"
  | "food"
  | "building"
  | "sky"
  | "ground";

/**
 * Body part type for body part masking
 */
export type BodyPartType =
  | "head"
  | "torso"
  | "left_arm"
  | "right_arm"
  | "left_leg"
  | "right_leg"
  | "left_hand"
  | "right_hand"
  | "left_foot"
  | "right_foot"
  | "face"
  | "hair"
  | "neck";

/**
 * Request body for mask objects
 */
export interface MaskObjectsRequest {
  input: InputStorage;
  output: OutputStorage;
  objectType: ObjectType | ObjectType[];
}

/**
 * Request body for mask body parts
 */
export interface MaskBodyPartsRequest {
  input: InputStorage;
  output: OutputStorage;
  bodyParts: BodyPartType | BodyPartType[];
}

/**
 * Request body for refine mask
 */
export interface RefineMaskRequest {
  input: {
    source: InputStorage;
    mask: InputStorage;
  };
  output: OutputStorage;
  options?: {
    feather?: number; // 0-250
    smoothness?: number; // 0-100
    contrast?: number; // -100 to 100
    shiftEdge?: number; // -100 to 100
    decontaminate?: boolean;
    decontaminationAmount?: number; // 0-100
  };
}

/**
 * Request body for fill masked areas
 */
export interface FillMaskedAreasRequest {
  input: {
    source: InputStorage;
    mask: InputStorage;
  };
  output: OutputStorage;
  options?: {
    fillMethod?: "generativeFill" | "contentAware";
    prompt?: string; // For generativeFill
  };
}

/**
 * Response types for masking operations
 */
export type CreateMaskResponse = JobResponse;
export type MaskObjectsResponse = JobResponse;
export type MaskBodyPartsResponse = JobResponse;
export type RefineMaskResponse = JobResponse;
export type FillMaskedAreasResponse = JobResponse;

