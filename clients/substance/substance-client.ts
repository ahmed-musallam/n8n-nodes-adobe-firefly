/**
 * Adobe Substance 3D API Client
 *
 * Main orchestration class that delegates to individual operation modules.
 *
 * References:
 * - .cursor/schema/adobe-substance-openapi.yaml
 */

import type { IMSClient } from "../ims-client";
import type {
  SubstanceClientOptions,
  SubstanceJobResponse,
  SubstanceSpace,
} from "./types/common";
import type {
  ComposeSceneRequest,
  ComposeSceneResponse,
} from "./types/compose-scene";
import type {
  CreateSceneRequest,
  CreateSceneResponse,
} from "./types/assemble-scene";
import type {
  ModelConvertRequest,
  ModelConvertResponse,
} from "./types/convert-model";
import type {
  SceneDescribeRequest,
  SceneDescribeResponse,
} from "./types/describe-scene";
import type {
  RenderSceneRequest,
  RenderSceneResponse,
} from "./types/render-scene";
import type {
  RenderModelRequest,
  RenderModelResponse,
} from "./types/render-model";

import * as composeSceneOp from "./operations/compose-scene";
import * as assembleSceneOp from "./operations/assemble-scene";
import * as convertModelOp from "./operations/convert-model";
import * as describeSceneOp from "./operations/describe-scene";
import * as renderSceneOp from "./operations/render-scene";
import * as renderModelOp from "./operations/render-model";
import * as getJobStatusOp from "./operations/get-job-status";
import * as createSpaceOp from "./operations/create-space";

export class SubstanceClient {
  private imsClient: IMSClient;
  private baseUrl: string;

  constructor(options: SubstanceClientOptions) {
    this.imsClient = options.imsClient;
    this.baseUrl = options.baseUrl ?? "https://s3d.adobe.io";
  }

  /**
   * Generate a 3D Object Composite with AI-generated background.
   * Combines a 3D hero asset with a Firefly-generated background scene.
   *
   * @param requestBody - The request payload
   * @returns The async job response
   * @throws Error if the API call fails
   */
  async composeScene(
    requestBody: ComposeSceneRequest,
  ): Promise<ComposeSceneResponse> {
    return composeSceneOp.composeScene(
      this.imsClient,
      this.baseUrl,
      requestBody,
    );
  }

  /**
   * Create/assemble a 3D scene from multiple 3D files.
   *
   * @param requestBody - The request payload
   * @returns The async job response
   * @throws Error if the API call fails
   */
  async assembleScene(
    requestBody: CreateSceneRequest,
  ): Promise<CreateSceneResponse> {
    return assembleSceneOp.assembleScene(
      this.imsClient,
      this.baseUrl,
      requestBody,
    );
  }

  /**
   * Convert a 3D file into another 3D format.
   *
   * @param requestBody - The request payload
   * @returns The async job response
   * @throws Error if the API call fails
   */
  async convertModel(
    requestBody: ModelConvertRequest,
  ): Promise<ModelConvertResponse> {
    return convertModelOp.convertModel(
      this.imsClient,
      this.baseUrl,
      requestBody,
    );
  }

  /**
   * Describe a 3D scene (get statistics and metadata).
   *
   * @param requestBody - The request payload
   * @returns The async job response
   * @throws Error if the API call fails
   */
  async describeScene(
    requestBody: SceneDescribeRequest,
  ): Promise<SceneDescribeResponse> {
    return describeSceneOp.describeScene(
      this.imsClient,
      this.baseUrl,
      requestBody,
    );
  }

  /**
   * Render a 3D scene (full version with advanced options).
   *
   * @param requestBody - The request payload
   * @returns The async job response
   * @throws Error if the API call fails
   */
  async renderScene(
    requestBody: RenderSceneRequest,
  ): Promise<RenderSceneResponse> {
    return renderSceneOp.renderScene(this.imsClient, this.baseUrl, requestBody);
  }

  /**
   * Render a 3D model (basic version - simpler API).
   *
   * @param requestBody - The request payload
   * @returns The async job response
   * @throws Error if the API call fails
   */
  async renderModel(
    requestBody: RenderModelRequest,
  ): Promise<RenderModelResponse> {
    return renderModelOp.renderModel(this.imsClient, this.baseUrl, requestBody);
  }

  /**
   * Get the status of an async Substance job.
   * Can poll this endpoint to check when a job is complete.
   *
   * @param jobId - The job ID returned from any async operation
   * @returns The job status response
   * @throws Error if the API call fails
   */
  async getJobStatus(jobId: string): Promise<SubstanceJobResponse> {
    return getJobStatusOp.getJobStatus(this.imsClient, this.baseUrl, jobId);
  }

  /**
   * Create a Space from uploaded 3D files (multipart/form-data upload).
   * Note: This is a direct response (201 Created), not an async job.
   *
   * @param file - The 3D file binary data
   * @param filename - The filename
   * @param name - General purpose name for multipart form value
   * @returns The created space
   * @throws Error if the API call fails
   */
  async createSpace(
    file: Blob | Uint8Array | ArrayBuffer,
    filename: string,
    name?: string,
  ): Promise<SubstanceSpace> {
    return createSpaceOp.createSpace(
      this.imsClient,
      this.baseUrl,
      file,
      filename,
      name,
    );
  }
}
