import type { InputStorage, OutputStorage, JobResponse } from "./common";

/**
 * Photoshop action request
 */
export interface PhotoshopActionRequest {
  inputs: InputStorage[];
  options: {
    actions: Array<{
      storage?: string;
      href: string;
    }>;
  };
  outputs: OutputStorage[];
}

/**
 * Action JSON request
 */
export interface ActionJsonRequest {
  inputs: InputStorage[];
  options: {
    actionJSON: Array<{
      [key: string]: unknown;
    }>;
  };
  outputs: OutputStorage[];
}

/**
 * Convert to Action JSON request
 */
export interface ConvertToActionJsonRequest {
  inputs: Array<{
    storage?: string;
    href: string;
  }>;
}

/**
 * Response types for action operations
 */
export type PhotoshopActionResponse = JobResponse;
export type ActionJsonResponse = JobResponse;
export type ConvertToActionJsonResponse = JobResponse;

