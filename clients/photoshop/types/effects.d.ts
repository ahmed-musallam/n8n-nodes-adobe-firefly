import type { InputStorage, OutputStorage, JobResponse } from "./common";

/**
 * Auto crop request
 */
export interface AutoCropRequest {
  inputs: InputStorage[];
  outputs: OutputStorage[];
}

/**
 * Depth blur request
 */
export interface DepthBlurRequest {
  inputs: InputStorage[];
  options?: {
    focalSelector?: {
      x?: number; // 0-1, relative position
      y?: number; // 0-1, relative position
    };
    blurStrength?: number; // 1-100
  };
  outputs: OutputStorage[];
}

/**
 * Response types for effects operations
 */
export type AutoCropResponse = JobResponse;
export type DepthBlurResponse = JobResponse;

