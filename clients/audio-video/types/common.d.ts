/**
 * Common types for Adobe Firefly Audio/Video API
 * Base URL: https://audio-video-api.adobe.io/v1
 */

/**
 * Supported language codes for audio/video operations
 */
export type SupportedLanguageCode =
  | "en-US"
  | "es-ES"
  | "de-DE"
  | "fr-FR"
  | "da-DK"
  | "en-GB"
  | "en-IN"
  | "es-419"
  | "es-AR"
  | "fr-CA"
  | "hi-IN"
  | "it-IT"
  | "ja-JP"
  | "ko-KR"
  | "nb-NO"
  | "pt-BR"
  | "pt-PT"
  | "nl-NL"
  | "zh-CN"
  | "sv-SE";

/**
 * Supported audio input media types
 */
export type AudioInputMediaType =
  | "audio/mp3"
  | "audio/wav"
  | "audio/mpeg"
  | "audio/x-m4a"
  | "audio/aac";

/**
 * Supported video input media types
 */
export type VideoInputMediaType =
  | "video/mp4"
  | "video/mov"
  | "video/quicktime"
  | "video/x-msvideo"
  | "video/x-matroska";

/**
 * Supported audio output formats
 */
export type AudioOutputFormat = "audio/wav";

/**
 * Supported video output formats
 */
export type VideoOutputFormat = "video/mp4";

/**
 * Job status values
 */
export type JobStatus = "pending" | "running" | "failed" | "succeeded";

/**
 * Job submission response
 */
export interface JobSubmissionResponse {
  jobId: string;
  statusUrl: string;
}

/**
 * Source object with URL
 */
export interface Source {
  url: string;
}

/**
 * Destination object with URL
 */
export interface Destination {
  url: string;
}

/**
 * Job status response (in-progress)
 */
export interface JobStatusInProgressResponse {
  jobId: string;
  status: "pending" | "running";
}

/**
 * Job status response (completed)
 */
export interface JobStatusCompletedResponse {
  jobId: string;
  status: "succeeded";
  output: {
    destination: Destination;
  };
}

/**
 * Job status response (failed)
 */
export interface JobStatusFailedResponse {
  jobId: string;
  status: "failed";
  error_code: string;
  message: string;
}

/**
 * Union type for job status responses
 */
export type JobStatusResponse =
  | JobStatusInProgressResponse
  | JobStatusCompletedResponse
  | JobStatusFailedResponse;
