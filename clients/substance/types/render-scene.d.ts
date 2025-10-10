/**
 * Types for 3D scene rendering
 * References: .cursor/schema/adobe-substance-openapi.yaml
 */

import type {
  SubstanceJobResponse,
  SubstanceSpace,
  MountedSource,
} from "./common";

export interface RenderSceneRequest {
  $schema?: string;
  sources: MountedSource[];
  scene: {
    baseFile?: {
      file: string;
      modelsRootNodeName?: string;
    };
    camera?: unknown;
    environment?: unknown;
    metersPerUnit?: number;
    models?: {
      imports?: unknown[] | null;
      modelsRootNodeTransform?: unknown;
    };
  };
  cameraName?: string;
  autoFraming?: {
    zoomFactor?: number; // 0.001-100, default 0.8
  };
  background?: {
    backgroundColor?: number[]; // [R, G, B, A] in 0-1 range
    backgroundImage?: string;
    showEnvironment?: boolean;
  };
  groundPlane?: {
    enable?: boolean;
    autoGroundScene?: boolean;
    shadows?: boolean;
    shadowsOpacity?: number; // 0-1
    reflections?: boolean;
    reflectionsOpacity?: number; // 0-1
    reflectionsRoughness?: number; // 0-1
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

export interface RenderSceneResponse extends SubstanceJobResponse {
  result?: {
    renderUrl: string;
    warnings: Array<{ context: string; message: string }> | null;
    objectIds?: unknown;
    materialIds?: unknown;
    objectMasks?: unknown[];
    materialMasks?: unknown[];
    outputSpace?: SubstanceSpace;
  };
}
