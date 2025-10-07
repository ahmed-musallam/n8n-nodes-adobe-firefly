/**
 * Firefly API GenerateImage Job Statuses
 * See: .cursor/rules/adobe-firefly-api.md and OpenAPI spec
 */
export type GenerateImageJobStatus =
  | "pending"
  | "running"
  | "succeeded"
  | "failed"
  | "canceled";

/**
 * Common fields for all GenerateImage job responses
 */
export interface GenerateImageJobBase {
  jobID: string;
  status: GenerateImageJobStatus;
  createdAt?: string; // ISO8601, if present
  updatedAt?: string; // ISO8601, if present
  [key: string]: string | number | boolean | object | undefined; // allow extension for vendor fields
}

/**
 * GenerateImage job response for a pending/running job
 */
export interface GenerateImageJobInProgress extends GenerateImageJobBase {
  status: "pending" | "running";
  // Optionally, progress or ETA fields may be present
  progress?: number; // 0-100
  etaSeconds?: number;
}

/**
 * GenerateImage job response for a succeeded job
 */
export interface GenerateImageJobSucceeded extends GenerateImageJobBase {
  status: "succeeded";
  // The result field(s) will contain the generated image(s) and metadata
  result: {
    images: Array<{
      url: string;
      mimeType?: string;
      width?: number;
      height?: number;
      [key: string]: string | number | boolean | object | undefined;
    }>;
    [key: string]: string | number | boolean | object | undefined;
  };
}

/**
 * GenerateImage job response for a failed job
 */
export interface GenerateImageJobFailed extends GenerateImageJobBase {
  status: "failed";
  error: {
    code: string;
    message: string;
    [key: string]: string | number | boolean | object | undefined;
  };
}

/**
 * GenerateImage job response for a canceled job
 */
export interface GenerateImageJobCanceled extends GenerateImageJobBase {
  status: "canceled";
  reason?: string;
}

/**
 * Union type for all possible GenerateImage job responses
 */
export type GenerateImageJobResponse =
  | GenerateImageJobInProgress
  | GenerateImageJobSucceeded
  | GenerateImageJobFailed
  | GenerateImageJobCanceled;
