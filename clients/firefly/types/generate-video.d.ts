/**
 * Types for video generation operations
 * References: .cursor/schema/generate_video_api.json
 */

export type GenerateVideoV3AsyncRequest = {
  // See OpenAPI: #/components/schemas/GenerateVideoRequestV3
  prompt?: string;
  bitRateFactor?: number; // 0-63, default 18
  image?: {
    conditions?: Array<{
      source: {
        uploadId?: string;
        url?: string;
        creativeCloudFileId?: string;
      };
      placement: {
        position: number; // 0-1, 0 = first frame, 1 = last frame
      };
    }>;
  };
  seeds?: number[]; // max 1 seed currently supported
  sizes?: Array<{
    width: number;
    height: number;
  }>;
  videoSettings?: {
    cameraMotion?:
      | "camera pan left"
      | "camera pan right"
      | "camera zoom in"
      | "camera zoom out"
      | "camera tilt up"
      | "camera tilt down"
      | "camera locked down"
      | "camera handheld";
    promptStyle?:
      | "anime"
      | "3d"
      | "fantasy"
      | "cinematic"
      | "claymation"
      | "line art"
      | "stop motion"
      | "2d"
      | "vector art"
      | "black and white";
    shotAngle?:
      | "aerial shot"
      | "eye_level shot"
      | "high angle shot"
      | "low angle shot"
      | "top-down shot";
    shotSize?:
      | "close-up shot"
      | "extreme close-up"
      | "medium shot"
      | "long shot"
      | "extreme long shot";
  };
};

export type GenerateVideoV3AsyncResponse = {
  // See OpenAPI: 202 response for /v3/videos/generate
  jobId: string;
  statusUrl: string;
  cancelUrl: string;
};

