import type {
  SupportedLanguageCode,
  VideoOutputFormat,
  JobSubmissionResponse,
  Source,
} from "./common";

/**
 * Avatar entity details
 */
export interface AvatarEntity {
  avatarId: string;
  displayName: string;
  gender: string;
  clothingStyle?: "Casual" | "Formal" | "Professional";
  ageGroup?: "Young Adult" | "Middle Aged" | "Senior";
  ethnicity?: string;
  style?: string;
  status: "Active" | "Inactive";
  extendedPropertyMap?: {
    aspectRatio?: {
      x: number;
      y: number;
    };
    resolution?: {
      width: number;
      height: number;
    };
  };
  thumbnailUrls?: {
    hd?: string;
    lowRes?: string;
  };
  voiceId?: string;
  sampleVideo?: {
    webm?: string;
    mp4?: string;
  };
}

/**
 * Response containing list of available avatars
 */
export interface GetAvatarsResponse {
  avatars: AvatarEntity[];
}

/**
 * Background type for avatar output
 */
export type BackgroundType = "color" | "video" | "image";

/**
 * Avatar output background configuration
 */
export interface AvatarBackground {
  type: BackgroundType;
  source?: Source;
  color?: string; // Hex color code
}

/**
 * Avatar output resolution
 */
export interface AvatarResolution {
  width: string;
  height: string;
}

/**
 * Avatar output configuration
 */
export interface AvatarOutput {
  mediaType: VideoOutputFormat;
  background?: AvatarBackground;
  resolution?: AvatarResolution;
}

/**
 * Script for avatar generation (text or URL)
 */
export interface AvatarScript {
  localeCode: SupportedLanguageCode;
  mediaType: "text/plain";
  text?: string;
  source?: Source;
}

/**
 * Audio input for avatar generation
 */
export interface AvatarAudioInput {
  source: Source;
  mediaType: "audio/wav";
  localeCode: SupportedLanguageCode;
}

/**
 * Request body for generating avatar (using text/script)
 */
export interface GenerateAvatarWithScriptRequest {
  script: AvatarScript;
  voiceId: string;
  avatarId: string;
  output: AvatarOutput;
}

/**
 * Request body for generating avatar (using audio)
 */
export interface GenerateAvatarWithAudioRequest {
  audio: AvatarAudioInput;
  avatarId: string;
  output: AvatarOutput;
}

/**
 * Union type for avatar generation requests
 */
export type GenerateAvatarRequest =
  | GenerateAvatarWithScriptRequest
  | GenerateAvatarWithAudioRequest;

/**
 * Response for avatar generation (job submission)
 */
export type GenerateAvatarResponse = JobSubmissionResponse;
