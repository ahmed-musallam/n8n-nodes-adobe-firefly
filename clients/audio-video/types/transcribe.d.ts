import type {
  SupportedLanguageCode,
  AudioInputMediaType,
  VideoInputMediaType,
  JobSubmissionResponse,
  Source,
  Destination,
} from "./common";

/**
 * Target caption format
 */
export type CaptionFormat = "SRT";

/**
 * Audio input for transcription
 */
export interface TranscribeAudioInput {
  source: Source;
  mediaType: AudioInputMediaType;
}

/**
 * Video input for transcription
 */
export interface TranscribeVideoInput {
  source: Source;
  mediaType: VideoInputMediaType;
  metadata?: {
    dialogTrackNumber?: number;
  };
}

/**
 * Caption configuration
 */
export interface CaptionConfig {
  targetFormats: CaptionFormat[];
}

/**
 * Request body for transcribing audio
 */
export interface TranscribeAudioRequest {
  audio: TranscribeAudioInput;
  targetLocaleCodes?: SupportedLanguageCode[];
  captions?: CaptionConfig;
}

/**
 * Request body for transcribing video
 */
export interface TranscribeVideoRequest {
  video: TranscribeVideoInput;
  targetLocaleCodes?: SupportedLanguageCode[];
  captions?: CaptionConfig;
}

/**
 * Union type for transcribe requests
 */
export type TranscribeRequest = TranscribeAudioRequest | TranscribeVideoRequest;

/**
 * Response for transcription (job submission)
 */
export type TranscribeResponse = JobSubmissionResponse;

/**
 * Caption output in job result
 */
export interface CaptionOutput {
  destination: Destination;
  format: CaptionFormat;
}

/**
 * Transcribe output in job result
 */
export interface TranscribeOutput {
  destination: Destination;
  captions?: CaptionOutput[];
  localeCode: SupportedLanguageCode;
}
