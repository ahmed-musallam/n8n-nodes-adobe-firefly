import type { InputStorage, OutputStorage, JobResponse } from "./common";

/**
 * Output format for remove background
 */
export interface RemoveBackgroundOutput extends OutputStorage {
  mask?: {
    format?: "binary" | "soft";
  };
}

/**
 * Options for remove background operation
 */
export interface RemoveBackgroundOptions {
  optimize?: "performance" | "batch";
  process?: {
    postprocess?: boolean;
  };
  service?: {
    version?: string;
  };
}

/**
 * Request body for remove background v2
 */
export interface RemoveBackgroundRequest {
  input: InputStorage;
  output: RemoveBackgroundOutput;
  options?: RemoveBackgroundOptions;
}

/**
 * Response for remove background (job submission)
 */
export type RemoveBackgroundResponse = JobResponse;

