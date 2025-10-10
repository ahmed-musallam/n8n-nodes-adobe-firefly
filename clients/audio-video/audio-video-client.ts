import type { IMSClient } from "../ims-client";
import { getVoices } from "./operations/get-voices";
import { getAvatars } from "./operations/get-avatars";
import { getJobStatus } from "./operations/get-job-status";
import { generateSpeech } from "./operations/generate-speech";
import { generateAvatar } from "./operations/generate-avatar";
import { reframeVideo } from "./operations/reframe-video";
import { transcribe } from "./operations/transcribe";
import { dub } from "./operations/dub";

// Re-export types
export type * from "./types/common";
export type * from "./types/text-to-speech";
export type * from "./types/avatar";
export type * from "./types/reframe";
export type * from "./types/transcribe";
export type * from "./types/dub";

export interface AudioVideoClientOptions {
  imsClient: IMSClient;
}

/**
 * Client for Adobe Firefly Audio/Video API
 * Provides text-to-speech, avatar generation, video reframing,
 * transcription, and dubbing capabilities.
 *
 * @see https://developer.adobe.com/audio-video-firefly-services/
 */
export class AudioVideoClient {
  private imsClient: IMSClient;

  constructor(options: AudioVideoClientOptions) {
    this.imsClient = options.imsClient;
  }

  /**
   * Get authentication headers for API requests
   */
  private async getAuthHeaders(): Promise<Record<string, string>> {
    return await this.imsClient.getAuthHeaders();
  }

  // ============================================
  // Text-to-Speech Operations
  // ============================================

  /**
   * Get available voices for text-to-speech
   */
  async getVoices() {
    const headers = await this.getAuthHeaders();
    return await getVoices(headers);
  }

  /**
   * Generate speech from text
   */
  async generateSpeech(
    ...args: Parameters<typeof generateSpeech> extends [
      infer R,
      Record<string, string>,
    ]
      ? [R]
      : never
  ) {
    const headers = await this.getAuthHeaders();
    return await generateSpeech(args[0], headers);
  }

  // ============================================
  // Avatar Operations
  // ============================================

  /**
   * Get available avatars
   */
  async getAvatars() {
    const headers = await this.getAuthHeaders();
    return await getAvatars(headers);
  }

  /**
   * Generate avatar video from text or audio
   */
  async generateAvatar(
    ...args: Parameters<typeof generateAvatar> extends [
      infer R,
      Record<string, string>,
    ]
      ? [R]
      : never
  ) {
    const headers = await this.getAuthHeaders();
    return await generateAvatar(args[0], headers);
  }

  // ============================================
  // Video Operations
  // ============================================

  /**
   * Reframe video using AI
   */
  async reframeVideo(
    ...args: Parameters<typeof reframeVideo> extends [
      infer R,
      Record<string, string>,
    ]
      ? [R]
      : never
  ) {
    const headers = await this.getAuthHeaders();
    return await reframeVideo(args[0], headers);
  }

  // ============================================
  // Transcription & Dubbing Operations
  // ============================================

  /**
   * Transcribe audio or video to text
   */
  async transcribe(
    ...args: Parameters<typeof transcribe> extends [
      infer R,
      Record<string, string>,
    ]
      ? [R]
      : never
  ) {
    const headers = await this.getAuthHeaders();
    return await transcribe(args[0], headers);
  }

  /**
   * Dub audio or video to another language
   */
  async dub(
    ...args: Parameters<typeof dub> extends [infer R, Record<string, string>]
      ? [R]
      : never
  ) {
    const headers = await this.getAuthHeaders();
    return await dub(args[0], headers);
  }

  // ============================================
  // Job Management
  // ============================================

  /**
   * Get the status of an asynchronous job
   */
  async getJobStatus(jobId: string) {
    const headers = await this.getAuthHeaders();
    return await getJobStatus(jobId, headers);
  }
}
