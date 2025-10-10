/**
 * Adobe Firefly Audio/Video API Client
 *
 * Provides a modular TypeScript client for interacting with the
 * Adobe Firefly Audio/Video API, including text-to-speech, avatar generation,
 * video reframing, transcription, and dubbing capabilities.
 *
 * @packageDocumentation
 */

export { AudioVideoClient } from "./audio-video-client";
export type { AudioVideoClientOptions } from "./audio-video-client";

// Re-export all types
export type * from "./types/common";
export type * from "./types/text-to-speech";
export type * from "./types/avatar";
export type * from "./types/reframe";
export type * from "./types/transcribe";
export type * from "./types/dub";
