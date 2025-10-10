/**
 * Types for 3D model conversion
 * References: .cursor/schema/adobe-substance-openapi.yaml
 */

import type {
  SubstanceJobResponse,
  SubstanceSpace,
  MountedSource,
} from "./common";

export interface ModelConvertRequest {
  $schema?: string;
  sources: MountedSource[];
  format: "glb" | "gltf" | "fbx" | "usdz" | "usda" | "usdc" | "obj";
  modelEntrypoint?: string;
}

export interface ModelConvertResponse extends SubstanceJobResponse {
  result?: {
    outputSpace?: SubstanceSpace;
  };
}
