import type { JobSubmissionResponse, Source } from "./common";

/**
 * Overlay media type
 */
export type OverlayMediaType = "image/gif" | "image/png" | "image/jpeg";

/**
 * Overlay anchor point
 */
export type OverlayAnchorPoint =
  | "top_left"
  | "top_right"
  | "bottom_left"
  | "bottom_right"
  | "center";

/**
 * Overlay repeat behavior
 */
export type OverlayRepeat = "loop" | "once";

/**
 * Overlay scale configuration
 */
export interface OverlayScale {
  width: number;
  height: number;
}

/**
 * Overlay position configuration
 */
export interface OverlayPosition {
  anchorPoint: OverlayAnchorPoint;
  offsetX: number;
  offsetY: number;
}

/**
 * Overlay configuration
 */
export interface Overlay {
  mediaType: OverlayMediaType;
  source: Source;
  startTime: string; // Timecode format: HH:MM:SS:FF
  duration: string; // Timecode format: HH:MM:SS:FF
  scale: OverlayScale;
  position: OverlayPosition;
  repeat?: OverlayRepeat;
}

/**
 * Video input for reframing
 */
export interface ReframeVideoInput {
  source: Source;
  mediaType: "video/mp4" | "video/quicktime";
}

/**
 * Output configuration for reframing
 */
export interface ReframeOutputConfig {
  aspectRatios: string[]; // e.g., ["1:1", "9:16", "4:5"]
}

/**
 * Request body for reframing video
 */
export interface ReframeVideoRequest {
  video: ReframeVideoInput;
  sceneEditDetection?: boolean;
  overlays?: Overlay[];
  outputConfig: ReframeOutputConfig;
}

/**
 * Response for video reframing (job submission)
 */
export type ReframeVideoResponse = JobSubmissionResponse;
