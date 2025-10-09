/**
 * Firefly API Client (Image & Video Generation)
 *
 * Implements:
 * - /v3/images/generate-async (image generation)
 * - /v3/images/expand-async (image expansion)
 * - /v3/images/fill-async (image fill)
 * - /v3/videos/generate (video generation)
 * - /v3/status/{jobId} (job status polling)
 * - /v3/cancel/{jobId} (job cancellation)
 * - /v2/storage/image (image upload)
 *
 * All endpoints use IMS authentication.
 *
 * References:
 * - .cursor/schema/image_generation_async_v3.json
 * - .cursor/schema/generative_expand_async_v3.json
 * - .cursor/schema/generative_fill_async_v3.json
 * - .cursor/schema/generate_video_api.json
 * - .cursor/rules/adobe-firefly-api.md
 */

import { GenerateImageJobResponse } from "./ffs-gen-image-job";
import type { IMSClient } from "./ims-client";

export type GenerateImagesV3AsyncRequest = {
  // See OpenAPI: #/components/schemas/GenerateImagesRequestV3
  // This is a partial type; extend as needed for your use case.
  prompt: string;
  customModelId?: string;
  [index: string]: string | number | boolean | object | undefined;
};

export type GenerateImagesV3AsyncResponse = {
  // See OpenAPI: #/components/schemas/AsyncAcceptResponseV3
  jobID: string;
  [input: string]: string | number | boolean | object | undefined;
};

export type UploadImageResponse = {
  // See OpenAPI: #/components/schemas/StorageImageResponse (upload_image.json)
  images: Array<{
    id: string;
  }>;
};

export type GenerateVideoV3AsyncRequest = {
  // See OpenAPI: #/components/schemas/GenerateVideoRequestV3
  prompt?: string;
  bitRateFactor?: number; // 0-63, default 18
  image?: {
    conditions?: Array<{
      source: {
        uploadId?: string;
        url?: string;
        creativeCloudFileId?: string;
      };
      placement: {
        position: number; // 0-1, 0 = first frame, 1 = last frame
      };
    }>;
  };
  seeds?: number[]; // max 1 seed currently supported
  sizes?: Array<{
    width: number;
    height: number;
  }>;
  videoSettings?: {
    cameraMotion?:
      | "camera pan left"
      | "camera pan right"
      | "camera zoom in"
      | "camera zoom out"
      | "camera tilt up"
      | "camera tilt down"
      | "camera locked down"
      | "camera handheld";
    promptStyle?:
      | "anime"
      | "3d"
      | "fantasy"
      | "cinematic"
      | "claymation"
      | "line art"
      | "stop motion"
      | "2d"
      | "vector art"
      | "black and white";
    shotAngle?:
      | "aerial shot"
      | "eye_level shot"
      | "high angle shot"
      | "low angle shot"
      | "top-down shot";
    shotSize?:
      | "close-up shot"
      | "extreme close-up"
      | "medium shot"
      | "long shot"
      | "extreme long shot";
  };
};

export type GenerateVideoV3AsyncResponse = {
  // See OpenAPI: 202 response for /v3/videos/generate
  jobId: string;
  statusUrl: string;
  cancelUrl: string;
};

export type VideoModelVersion = "video1_standard";

export type ExpandImageV3AsyncRequest = {
  // See OpenAPI: #/components/schemas/ExpandImageRequestV3
  image: {
    source: {
      uploadId?: string;
      url?: string;
    };
  };
  mask?: {
    source: {
      uploadId?: string;
      url?: string;
    };
    invert?: boolean;
  };
  numVariations?: number; // 1-4
  placement?: {
    alignment?: {
      horizontal?: "center" | "left" | "right";
      vertical?: "center" | "top" | "bottom";
    };
    inset?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
  };
  prompt?: string; // 1-1024 characters
  seeds?: number[]; // 1-4 items
  size?: {
    width: number; // 1-3999
    height: number; // 1-3999
  };
};

export type ExpandImageV3AsyncResponse = {
  // See OpenAPI: #/components/schemas/AsyncAcceptResponseV3
  jobId: string;
  statusUrl: string;
  cancelUrl: string;
};

export type FillImageV3AsyncRequest = {
  // See OpenAPI: #/components/schemas/FillImageRequestV3
  image: {
    source: {
      uploadId?: string;
      url?: string;
    };
  };
  mask: {
    // Required
    source: {
      uploadId?: string;
      url?: string;
    };
    invert?: boolean;
  };
  negativePrompt?: string; // max 1024 characters
  numVariations?: number; // 1-4
  prompt?: string; // 1-1024 characters
  promptBiasingLocaleCode?: string;
  seeds?: number[]; // 1-4 items
  size?: {
    width: number;
    height: number;
  };
};

export type FillImageV3AsyncResponse = {
  // See OpenAPI: #/components/schemas/AsyncAcceptResponseV3
  jobId: string;
  statusUrl: string;
  cancelUrl: string;
};

export type FireflyClientOptions = {
  imsClient: IMSClient;
  baseUrl?: string; // override for testing
};

export type ModelVersion =
  | "image3"
  | "image3_custom"
  | "image4_standard"
  | "image4_ultra"
  | "image4_custom";

export class FireflyClient {
  private imsClient: IMSClient;
  private baseUrl: string;

  constructor(options: FireflyClientOptions) {
    this.imsClient = options.imsClient;
    this.baseUrl = options.baseUrl ?? "https://firefly-api.adobe.io";
  }

  /**
   * Generate images asynchronously (V3).
   *
   * @param requestBody - The request payload (see OpenAPI spec for details)
   * @param modelVersion - Optional Firefly model version (header: x-model-version)
   * @returns The async job response (contains jobID)
   * @throws Error if the API call fails
   */
  async generateImagesAsync(
    requestBody: GenerateImagesV3AsyncRequest,
    modelVersion?: ModelVersion,
  ): Promise<GenerateImagesV3AsyncResponse> {
    const url = `${this.baseUrl}/v3/images/generate-async`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(await this.imsClient.getAuthHeaders()),
    };
    if (modelVersion) {
      headers["x-model-version"] = modelVersion;
    }

    // clean any properties that are undefined
    Object.keys(requestBody).forEach((key) => {
      if (requestBody[key] === undefined) {
        delete requestBody[key];
      }
    });

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Firefly generateImagesAsync failed: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    const data = (await response.json()) as GenerateImagesV3AsyncResponse;
    if (!data.jobId) {
      throw new Error("Firefly API response missing jobID");
    }
    return data;
  }

  async generateImagesAndWait(
    requestBody: GenerateImagesV3AsyncRequest,
    maxRetries: number = 20,
    interval: number = 1000, // 1 second
    modelVersion?: ModelVersion,
  ): Promise<GenerateImageJobResponse> {
    const genImageResponse = await this.generateImagesAsync(
      requestBody,
      modelVersion,
    );
    let retries = 0;
    while (retries < maxRetries) {
      const jobStatus = await this.getJobStatus(genImageResponse.jobID);
      if (!["pending", "running"].includes(jobStatus.status)) {
        // job is done if not pending or running
        return jobStatus;
      }
      retries++;
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    throw new Error(
      "Firefly generateImagesAndWait failed: job timed out after " +
        maxRetries +
        " retries over " +
        maxRetries * interval +
        " milliseconds",
    );
  }

  async getJobStatus(jobID: string): Promise<GenerateImageJobResponse> {
    const url = `${this.baseUrl}/v3/status/${jobID}`;
    const response = await fetch(url, {
      method: "GET",
      headers: await this.imsClient.getAuthHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Firefly getJobStatus failed: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }
    return (await response.json()) as GenerateImageJobResponse;
  }

  /**
   * Cancels an async Firefly job.
   * Implements the /v3/cancel/{jobId} endpoint per image_generation_async_v3.json.
   * Throws if the cancel fails.
   */
  async cancelJob(jobID: string): Promise<void> {
    const url = `${this.baseUrl}/v3/cancel/${jobID}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: await this.imsClient.getAuthHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Firefly cancelJob failed: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }
  }

  /**
   * Upload an image to Firefly Storage API.
   * Implements the POST /v2/storage/image endpoint per upload_image.json.
   * The uploaded asset will be valid for 7 days from the date of upload.
   *
   * @param imageData - Binary image data (Buffer, Blob, or Uint8Array)
   * @param contentType - MIME type (image/jpeg, image/png, or image/webp)
   * @returns Upload response containing the image ID
   * @throws Error if the API call fails
   */
  async uploadImage(
    imageData: Uint8Array | Blob | ArrayBuffer,
    contentType: "image/jpeg" | "image/png" | "image/webp",
  ): Promise<UploadImageResponse> {
    const url = `${this.baseUrl}/v2/storage/image`;

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      ...(await this.imsClient.getAuthHeaders()),
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: imageData as BodyInit,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Firefly uploadImage failed: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    const data = (await response.json()) as UploadImageResponse;
    if (!data.images || data.images.length === 0) {
      throw new Error("Firefly API response missing image IDs");
    }
    return data;
  }

  /**
   * Generate a video asynchronously (V3).
   * Implements the POST /v3/videos/generate endpoint per generate_video_api.json.
   *
   * @param requestBody - The request payload (see OpenAPI spec for details)
   * @param modelVersion - Optional Firefly video model version (header: x-model-version)
   * @returns The async job response (contains jobId, statusUrl, cancelUrl)
   * @throws Error if the API call fails
   */
  async generateVideoAsync(
    requestBody: GenerateVideoV3AsyncRequest,
    modelVersion?: VideoModelVersion,
  ): Promise<GenerateVideoV3AsyncResponse> {
    const url = `${this.baseUrl}/v3/videos/generate`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(await this.imsClient.getAuthHeaders()),
    };
    if (modelVersion) {
      headers["x-model-version"] = modelVersion;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Firefly generateVideoAsync failed: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    const data = (await response.json()) as GenerateVideoV3AsyncResponse;
    if (!data.jobId) {
      throw new Error("Firefly API response missing jobId");
    }
    return data;
  }

  /**
   * Expand an image asynchronously (V3).
   * Implements the POST /v3/images/expand-async endpoint per generative_expand_async_v3.json.
   * Change the aspect ratio or size of an image and expand it with optional text prompt.
   *
   * @param requestBody - The request payload (see OpenAPI spec for details)
   * @returns The async job response (contains jobId, statusUrl, cancelUrl)
   * @throws Error if the API call fails
   */
  async expandImageAsync(
    requestBody: ExpandImageV3AsyncRequest,
  ): Promise<ExpandImageV3AsyncResponse> {
    const url = `${this.baseUrl}/v3/images/expand-async`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(await this.imsClient.getAuthHeaders()),
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Firefly expandImageAsync failed: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    const data = (await response.json()) as ExpandImageV3AsyncResponse;
    if (!data.jobId) {
      throw new Error("Firefly API response missing jobId");
    }
    return data;
  }

  /**
   * Fill an image asynchronously (V3).
   * Implements the POST /v3/images/fill-async endpoint per generative_fill_async_v3.json.
   * Fills an area of an image based on a mask with AI-generated content from prompt.
   *
   * @param requestBody - The request payload (see OpenAPI spec for details)
   * @returns The async job response (contains jobId, statusUrl, cancelUrl)
   * @throws Error if the API call fails
   */
  async fillImageAsync(
    requestBody: FillImageV3AsyncRequest,
  ): Promise<FillImageV3AsyncResponse> {
    const url = `${this.baseUrl}/v3/images/fill-async`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(await this.imsClient.getAuthHeaders()),
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Firefly fillImageAsync failed: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    const data = (await response.json()) as FillImageV3AsyncResponse;
    if (!data.jobId) {
      throw new Error("Firefly API response missing jobId");
    }
    return data;
  }
}
