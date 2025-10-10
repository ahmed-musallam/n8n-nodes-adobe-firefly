/**
 * Types for 3D model rendering (basic version)
 * References: .cursor/schema/adobe-substance-openapi.yaml
 */

import type { MountedSource } from "./common";
import type { RenderSceneResponse } from "./render-scene";

export interface RenderModelRequest {
  $schema?: string;
  sources: MountedSource[];
  scene: {
    modelFile?: string;
    camera?: unknown;
    environment?: unknown;
    metersPerUnit?: number;
    modelTransform?: unknown;
    materialOverrides?: unknown[] | null;
    formatOptions?: unknown;
  };
  cameraName?: string;
  autoFraming?: {
    zoomFactor?: number;
  };
  background?: {
    backgroundColor?: number[];
    backgroundImage?: string;
    showEnvironment?: boolean;
  };
  groundPlane?: {
    enable?: boolean;
    autoGroundScene?: boolean;
    shadows?: boolean;
    shadowsOpacity?: number;
    reflections?: boolean;
    reflectionsOpacity?: number;
    reflectionsRoughness?: number;
  };
  size?: {
    width: number; // 16-3840
    height: number; // 16-2304
  };
  extraOutputs?: {
    exportObjectIds?: boolean;
    exportMaterialIds?: boolean;
    exportObjectMasks?: {
      selection?: string[] | null;
    };
    exportMaterialMasks?: {
      selection?: string[] | null;
    };
  };
}

export type RenderModelResponse = RenderSceneResponse;
