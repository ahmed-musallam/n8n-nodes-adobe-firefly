/**
 * Firefly API Client (Image & Video Generation)
 *
 * Main orchestration class that delegates to individual operation modules.
 *
 * All endpoints use IMS authentication.
 * For 3D rendering and scene composition, see substance-client.ts
 *
 * References:
 * - .cursor/schema/image_generation_async_v3.json
 * - .cursor/schema/generative_expand_async_v3.json
 * - .cursor/schema/generative_fill_async_v3.json
 * - .cursor/schema/generate_similar_async_v3.json
 * - .cursor/schema/generate_object_composite_async_v3.json
 * - .cursor/schema/generate_video_api.json
 * - .cursor/rules/adobe-firefly-api.md
 */

import { GenerateImageJobResponse } from "../ffs-gen-image-job";
import type { IMSClient } from "../ims-client";

// Types
import type {
  FireflyClientOptions,
  ModelVersion,
  VideoModelVersion,
} from "./types/common";
import type {
  GenerateImagesV3AsyncRequest,
  GenerateImagesV3AsyncResponse,
} from "./types/generate-images";
import type { UploadImageResponse } from "./types/upload-image";
import type {
  GenerateVideoV3AsyncRequest,
  GenerateVideoV3AsyncResponse,
} from "./types/generate-video";
import type {
  ExpandImageV3AsyncRequest,
  ExpandImageV3AsyncResponse,
} from "./types/expand-image";
import type {
  FillImageV3AsyncRequest,
  FillImageV3AsyncResponse,
} from "./types/fill-image";
import type {
  GenerateSimilarImagesV3AsyncRequest,
  GenerateSimilarImagesV3AsyncResponse,
} from "./types/generate-similar";
import type {
  GenerateObjectCompositeV3AsyncRequest,
  GenerateObjectCompositeV3AsyncResponse,
} from "./types/generate-object-composite";

// Operations
import * as generateImagesOps from "./operations/generate-images";
import * as getJobStatusOp from "./operations/get-job-status";
import * as cancelJobOp from "./operations/cancel-job";
import * as uploadImageOp from "./operations/upload-image";
import * as generateVideoOp from "./operations/generate-video";
import * as expandImageOp from "./operations/expand-image";
import * as fillImageOp from "./operations/fill-image";
import * as generateSimilarOp from "./operations/generate-similar";
import * as generateObjectCompositeOp from "./operations/generate-object-composite";

export class FireflyClient {
  private imsClient: IMSClient;
  private baseUrl: string;

  constructor(options: FireflyClientOptions) {
    this.imsClient = options.imsClient;
    this.baseUrl = options.baseUrl ?? "https://firefly-api.adobe.io";
  }

  /**
   * Generate images asynchronously (V3).
   */
  async generateImagesAsync(
    requestBody: GenerateImagesV3AsyncRequest,
    modelVersion?: ModelVersion,
  ): Promise<GenerateImagesV3AsyncResponse> {
    return generateImagesOps.generateImagesAsync(
      this.imsClient,
      this.baseUrl,
      requestBody,
      modelVersion,
    );
  }

  /**
   * Generate images and wait for completion.
   */
  async generateImagesAndWait(
    requestBody: GenerateImagesV3AsyncRequest,
    maxRetries: number = 20,
    interval: number = 1000,
    modelVersion?: ModelVersion,
  ): Promise<GenerateImageJobResponse> {
    return generateImagesOps.generateImagesAndWait(
      this.imsClient,
      this.baseUrl,
      this.getJobStatus.bind(this),
      requestBody,
      maxRetries,
      interval,
      modelVersion,
    );
  }

  /**
   * Get job status.
   */
  async getJobStatus(jobID: string): Promise<GenerateImageJobResponse> {
    return getJobStatusOp.getJobStatus(this.imsClient, this.baseUrl, jobID);
  }

  /**
   * Cancel a job.
   */
  async cancelJob(jobID: string): Promise<void> {
    return cancelJobOp.cancelJob(this.imsClient, this.baseUrl, jobID);
  }

  /**
   * Upload an image.
   */
  async uploadImage(
    imageData: Uint8Array | Blob | ArrayBuffer,
    contentType: "image/jpeg" | "image/png" | "image/webp",
  ): Promise<UploadImageResponse> {
    return uploadImageOp.uploadImage(
      this.imsClient,
      this.baseUrl,
      imageData,
      contentType,
    );
  }

  /**
   * Generate a video asynchronously (V3).
   */
  async generateVideoAsync(
    requestBody: GenerateVideoV3AsyncRequest,
    modelVersion?: VideoModelVersion,
  ): Promise<GenerateVideoV3AsyncResponse> {
    return generateVideoOp.generateVideoAsync(
      this.imsClient,
      this.baseUrl,
      requestBody,
      modelVersion,
    );
  }

  /**
   * Expand an image asynchronously (V3).
   */
  async expandImageAsync(
    requestBody: ExpandImageV3AsyncRequest,
  ): Promise<ExpandImageV3AsyncResponse> {
    return expandImageOp.expandImageAsync(
      this.imsClient,
      this.baseUrl,
      requestBody,
    );
  }

  /**
   * Fill an image asynchronously (V3).
   */
  async fillImageAsync(
    requestBody: FillImageV3AsyncRequest,
  ): Promise<FillImageV3AsyncResponse> {
    return fillImageOp.fillImageAsync(
      this.imsClient,
      this.baseUrl,
      requestBody,
    );
  }

  /**
   * Generate similar images asynchronously (V3).
   */
  async generateSimilarImagesAsync(
    requestBody: GenerateSimilarImagesV3AsyncRequest,
    modelVersion?: ModelVersion,
  ): Promise<GenerateSimilarImagesV3AsyncResponse> {
    return generateSimilarOp.generateSimilarImagesAsync(
      this.imsClient,
      this.baseUrl,
      requestBody,
      modelVersion,
    );
  }

  /**
   * Generate object composite asynchronously (V3).
   */
  async generateObjectCompositeAsync(
    requestBody: GenerateObjectCompositeV3AsyncRequest,
  ): Promise<GenerateObjectCompositeV3AsyncResponse> {
    return generateObjectCompositeOp.generateObjectCompositeAsync(
      this.imsClient,
      this.baseUrl,
      requestBody,
    );
  }
}
