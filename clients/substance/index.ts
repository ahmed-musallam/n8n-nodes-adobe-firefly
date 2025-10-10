/**
 * Adobe Substance 3D API Client - Public exports
 */

// Main client
export { SubstanceClient } from "./substance-client";

// Common types
export type {
  SubstanceClientOptions,
  SubstanceJobStatus,
  SubstanceJobResponse,
  SubstanceSpace,
  MountedSource,
  OutputSize,
} from "./types/common";

// Compose Scene types
export type {
  ComposeSceneRequest,
  ComposeSceneResponse,
} from "./types/compose-scene";

// Assemble Scene types
export type {
  CreateSceneRequest,
  CreateSceneResponse,
} from "./types/assemble-scene";

// Convert Model types
export type {
  ModelConvertRequest,
  ModelConvertResponse,
} from "./types/convert-model";

// Describe Scene types
export type {
  SceneDescribeRequest,
  SceneDescribeResponse,
} from "./types/describe-scene";

// Render Scene types
export type {
  RenderSceneRequest,
  RenderSceneResponse,
} from "./types/render-scene";

// Render Model types
export type {
  RenderModelRequest,
  RenderModelResponse,
} from "./types/render-model";
