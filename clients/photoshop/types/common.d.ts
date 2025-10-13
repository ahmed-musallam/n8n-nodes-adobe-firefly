/**
 * Common types for Adobe Photoshop API
 * Base URL: https://image.adobe.io
 */

/**
 * Job status values
 */
export type JobStatus =
  | "pending"
  | "running"
  | "succeeded"
  | "failed"
  | "cancelled";

/**
 * Storage type for input/output
 */
export type StorageType =
  | "adobe"
  | "azure"
  | "dropbox"
  | "external"
  | "lightroom";

/**
 * Input storage configuration
 */
export interface InputStorage {
  href: string;
  storage?: StorageType;
}

/**
 * Output storage configuration
 */
export interface OutputStorage {
  href: string;
  storage?: StorageType;
  type?: string; // MIME type
  overwrite?: boolean;
  width?: number;
  height?: number;
}

/**
 * Job submission response
 */
export interface JobResponse {
  _links: {
    self: {
      href: string;
    };
  };
}

/**
 * Job output details
 */
export interface JobOutput {
  input?: string;
  status?: string;
  created?: string;
  modified?: string;
  _links?: {
    self?: {
      href: string;
    };
  };
  errors?: {
    type?: string;
    code?: string;
    title?: string;
    errorDetails?: Array<{
      name?: string;
      reason?: string;
    }>;
  };
}

/**
 * Job status response
 */
export interface JobStatusResponse {
  jobId?: string;
  status?: JobStatus;
  created?: string;
  modified?: string;
  _links?: {
    self?: {
      href: string;
    };
  };
  outputs?: JobOutput[];
  errors?: {
    type?: string;
    code?: string;
    title?: string;
    errorDetails?: Array<{
      name?: string;
      reason?: string;
    }>;
  };
}

/**
 * Image format types
 */
export type ImageFormat =
  | "image/jpeg"
  | "image/png"
  | "image/tiff"
  | "image/vnd.adobe.photoshop";

/**
 * Color space types
 */
export type ColorSpace = "rgb" | "cmyk" | "lab" | "bitmap" | "greyscale";

/**
 * Compression level for JPEG
 */
export type CompressionLevel = "low" | "medium" | "high" | "veryhigh";

