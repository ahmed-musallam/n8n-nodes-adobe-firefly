/**
 * Types for 3D scene description
 * References: .cursor/schema/adobe-substance-openapi.yaml
 */

import type { SubstanceJobResponse, MountedSource } from "./common";

export interface SceneDescribeRequest {
  $schema?: string;
  sources: MountedSource[];
  sceneFile?: string;
}

export interface SceneDescribeResponse extends SubstanceJobResponse {
  result?: {
    stats: {
      metersPerSceneUnit: number;
      sceneUpAxis: string;
      numVertices: number;
      numEquivalentTriangles: number;
      numPoints: number;
      numLines: number;
      numTriangles: number;
      numQuads: number;
      numExtraPolygons: number;
      numFaces: number;
      numMeshes: number;
      numSubMeshes: number;
      numTextures: number;
      cameraNames: string[] | null;
      materialNames: string[] | null;
      nodesHierarchy: unknown;
    };
  };
}
