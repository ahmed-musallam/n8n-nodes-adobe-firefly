import type { JobResponse } from "./common";

/**
 * URL resource for input image
 */
export interface UrlResource {
  url: string;
}

/**
 * Input image for remove background v2
 */
export interface RemoveBgInputImage {
  source: UrlResource;
}

/**
 * Mode of background removal
 */
export type RemoveBgMode = "cutout" | "mask" | "psd";

/**
 * Output image media type
 */
export type RemoveBgOutputMediaType =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/vnd.adobe.photoshop";

/**
 * Output image options
 */
export interface RemoveBgOutputImageOptions {
  mediaType?: RemoveBgOutputMediaType;
}

/**
 * Background color for replacement
 */
export interface RemoveBgColor {
  /** Red value (0-255) */
  red: number;
  /** Green value (0-255) */
  green: number;
  /** Blue value (0-255) */
  blue: number;
  /** Transparency value (0-1). 0 is fully transparent, 1 is fully opaque */
  alpha?: number;
}

/**
 * Request body for remove background v2
 */
export interface RemoveBackgroundRequest {
  /** The image to be processed */
  image: RemoveBgInputImage;
  /** The mode of background removal (default: "cutout") */
  mode?: RemoveBgMode;
  /** The options for the output image */
  output?: RemoveBgOutputImageOptions;
  /** If true, the image is cropped to the cutout border. Transparent pixels are removed (default: false) */
  trim?: boolean;
  /** The background color to replace with */
  backgroundColor?: RemoveBgColor;
  /** If > 0, removes colored reflections from the background (0-1, default: 1) */
  colorDecontamination?: number;
}

/**
 * Response for remove background v2 (job submission)
 */
export type RemoveBackgroundResponse = JobResponse;
