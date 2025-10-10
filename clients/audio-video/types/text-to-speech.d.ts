import type {
  SupportedLanguageCode,
  AudioOutputFormat,
  JobSubmissionResponse,
  Source,
} from "./common";

/**
 * Voice entity details
 */
export interface VoiceEntity {
  voiceId: string;
  displayName: string;
  gender: string;
  style?: "Casual" | "Excited";
  voiceType?: string;
  status: "Active" | "Inactive";
  extendedPropertyMap?: Record<string, unknown>;
  wordsPerMinute?: string;
  rolePlayList?: string[];
  sampleURL?: string;
}

/**
 * Response containing list of available voices
 */
export interface GetVoicesResponse {
  voices: VoiceEntity[];
}

/**
 * Text source for script
 */
export interface TextSource {
  text: string;
}

/**
 * URL source for script
 */
export interface URLSource {
  source: Source;
}

/**
 * Script object (text or URL)
 */
export interface Script {
  localeCode: SupportedLanguageCode;
  mediaType: "text/plain";
  text?: string;
  source?: Source;
}

/**
 * Output configuration for text-to-speech
 */
export interface TTSOutput {
  mediaType: AudioOutputFormat;
}

/**
 * Request body for generating speech
 */
export interface GenerateSpeechRequest {
  script: Script;
  voiceId: string;
  output: TTSOutput;
}

/**
 * Response for speech generation (job submission)
 */
export type GenerateSpeechResponse = JobSubmissionResponse;
