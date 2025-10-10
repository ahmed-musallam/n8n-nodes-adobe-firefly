/**
 * Types for 3D scene assembly
 * References: .cursor/schema/adobe-substance-openapi.yaml
 */

import type {
  SubstanceJobResponse,
  SubstanceSpace,
  MountedSource,
} from "./common";

export interface CreateSceneRequest {
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
      imports?: Array<{
        file?: string;
        anchorName?: string;
        transform?: unknown;
        materialOverrides?: unknown[];
        formatOptions?: unknown;
      }> | null;
      modelsRootNodeTransform?: unknown;
    };
  };
  encoding: "glb" | "gltf" | "fbx" | "usdz" | "usda" | "usdc" | "obj";
  fileBaseName: string;
}

export interface CreateSceneResponse extends SubstanceJobResponse {
  result?: {
    sceneUrl: string;
    outputSpace?: SubstanceSpace;
  };
}
