import type {
  SupportedLanguageCode,
  AudioInputMediaType,
  VideoInputMediaType,
  JobSubmissionResponse,
  Source,
  Destination,
} from "./common";
import type { TranscribeOutput } from "./transcribe";

/**
 * Audio output media type
 */
export type AudioOutputMediaType = "audio/wav";

/**
 * Video output media type
 */
export type VideoOutputMediaType = "video/mp4" | "video/mov";

/**
 * Audio input for dubbing
 */
export interface DubAudioInput {
  source: Source;
  mediaType: AudioInputMediaType;
}

/**
 * Video input for dubbing
 */
export interface DubVideoInput {
  source: Source;
  mediaType: VideoInputMediaType;
  metadata?: {
    dialogTrackNumber?: number;
  };
}

/**
 * Transcript input for dubbing
 */
export interface TranscriptInput {
  source: Source;
}

/**
 * Request body for dubbing audio
 */
export interface DubAudioRequest {
  audio: DubAudioInput;
  targetLocaleCodes?: SupportedLanguageCode[];
  transcripts?: TranscriptInput[];
}

/**
 * Request body for dubbing video
 */
export interface DubVideoRequest {
  video: DubVideoInput;
  targetLocaleCodes?: SupportedLanguageCode[];
  transcripts?: TranscriptInput[];
  lipSync?: boolean;
}

/**
 * Union type for dub requests
 */
export type DubRequest = DubAudioRequest | DubVideoRequest;

/**
 * Response for dubbing (job submission)
 */
export type DubResponse = JobSubmissionResponse;

/**
 * Audio output in job result
 */
export interface AudioOutput {
  mediaType: AudioOutputMediaType;
  destination: Destination;
}

/**
 * Video output in job result
 */
export interface VideoOutput {
  mediaType: VideoOutputMediaType;
  destination: Destination;
}

/**
 * Successful dub output
 */
export interface DubSuccess {
  audioOutput?: AudioOutput;
  videoOutput?: VideoOutput;
  transcriptOutput?: TranscribeOutput[];
}

/**
 * Partial failure in dubbing
 */
export interface DubPartialFailure {
  error: {
    error_code: string;
    message: string;
  };
}

/**
 * Union type for dub job responses
 */
export type DubJobResponse = DubSuccess | DubPartialFailure;
