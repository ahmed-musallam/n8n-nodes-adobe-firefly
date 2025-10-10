/**
 * Types for 3D object composite generation
 * References: .cursor/schema/adobe-substance-openapi.yaml
 */

import type { SubstanceJobResponse, MountedSource, OutputSize } from "./common";

export interface ComposeSceneRequest {
  $schema?: string;
  sources: MountedSource[];
  prompt: string;
  heroAsset: string;
  cameraName?: string | null;
  sceneFile?: string;
  contentClass?: "photo" | "art";
  modelVersion?: "image3_fast" | "image4_standard" | "image4_ultra";
  numVariations?: number; // 1-4
  seeds?: number[];
  lightingSeeds?: number[];
  size?: OutputSize;
  styleImage?: string;
  enableGroundPlane?: boolean;
  environmentExposure?: number; // -10 to 10
  environment?: {
    file: string;
    rotation?: {
      euler?: number[]; // [x, y, z] in degrees
      quaternion?: number[]; // [w, x, y, z]
    };
  };
  scene?: {
    camera?: {
      focal?: number; // 10-1000mm
      sensorWidth?: number; // 1-100mm
      transform?: unknown;
    };
  };
}

export interface ComposeSceneResponse extends SubstanceJobResponse {
  result?: {
    outputs: Array<{
      seed: number;
      lightingSeed: number;
      image: { url: string };
      backgroundImage: { url: string };
      maskImage: { url: string };
    }> | null;
    promptHasDeniedWords: boolean;
    promptHasBlockedArtists: boolean;
    warnings: Array<{ context: string; message: string }> | null;
  };
}
