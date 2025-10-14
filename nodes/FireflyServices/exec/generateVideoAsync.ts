import {
  type IExecuteFunctions,
  type IDataObject,
  LoggerProxy as Logger,
  ApplicationError,
} from "n8n-workflow";
import {
  FireflyClient,
  type GenerateVideoV3AsyncRequest,
  type VideoModelVersion,
} from "../../../clients/firefly";

export async function executeGenerateVideoAsync(
  this: IExecuteFunctions,
  i: number,
  fireflyClient: FireflyClient,
): Promise<IDataObject> {
  const videoPrompt = this.getNodeParameter("videoPrompt", i) as string;
  const videoOptions = this.getNodeParameter(
    "videoOptions",
    i,
    {},
  ) as IDataObject;

  if (!videoPrompt || videoPrompt.length < 1) {
    throw new ApplicationError("Prompt must be at least 1 character long.");
  }

  // Build request body
  const requestBody: GenerateVideoV3AsyncRequest = {
    prompt: videoPrompt,
  };

  // Add bit rate factor if specified
  if (videoOptions.bitRateFactor !== undefined) {
    requestBody.bitRateFactor = videoOptions.bitRateFactor as number;
  }

  // Add seed if specified
  if (videoOptions.seed !== undefined && videoOptions.seed !== "") {
    requestBody.seeds = [videoOptions.seed as number];
  }

  // Add video size if specified
  if (videoOptions.videoSize) {
    const [width, height] = (videoOptions.videoSize as string)
      .split("x")
      .map(Number);
    requestBody.sizes = [{ width, height }];
  }

  // Build keyframe images if specified
  const conditions: Array<{
    source: { uploadId?: string; url?: string };
    placement: { position: number };
  }> = [];

  // Add beginning keyframe (position 0)
  const beginningSourceType =
    videoOptions.beginningKeyframeSourceType as string;
  if (beginningSourceType === "uploadId") {
    const uploadId = videoOptions.beginningKeyframeUploadId as string;
    if (uploadId && uploadId.length > 0) {
      conditions.push({
        source: { uploadId },
        placement: { position: 0 },
      });
    }
  } else if (beginningSourceType === "url") {
    const url = videoOptions.beginningKeyframeUrl as string;
    if (url && url.length > 0) {
      conditions.push({
        source: { url },
        placement: { position: 0 },
      });
    }
  }

  // Add ending keyframe (position 1)
  const endingSourceType = videoOptions.endingKeyframeSourceType as string;
  if (endingSourceType === "uploadId") {
    const uploadId = videoOptions.endingKeyframeUploadId as string;
    if (uploadId && uploadId.length > 0) {
      conditions.push({
        source: { uploadId },
        placement: { position: 1 },
      });
    }
  } else if (endingSourceType === "url") {
    const url = videoOptions.endingKeyframeUrl as string;
    if (url && url.length > 0) {
      conditions.push({
        source: { url },
        placement: { position: 1 },
      });
    }
  }

  // Add keyframes to request if any were specified
  if (conditions.length > 0) {
    requestBody.image = {
      conditions,
    };
  }

  // Build video settings if any are specified
  const hasVideoSettings =
    videoOptions.cameraMotion ||
    videoOptions.promptStyle ||
    videoOptions.shotAngle ||
    videoOptions.shotSize;

  if (hasVideoSettings) {
    requestBody.videoSettings = {};

    if (videoOptions.cameraMotion) {
      requestBody.videoSettings.cameraMotion = videoOptions.cameraMotion as
        | "camera pan left"
        | "camera pan right"
        | "camera zoom in"
        | "camera zoom out"
        | "camera tilt up"
        | "camera tilt down"
        | "camera locked down"
        | "camera handheld";
    }

    if (videoOptions.promptStyle) {
      requestBody.videoSettings.promptStyle = videoOptions.promptStyle as
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
    }

    if (videoOptions.shotAngle) {
      requestBody.videoSettings.shotAngle = videoOptions.shotAngle as
        | "aerial shot"
        | "eye_level shot"
        | "high angle shot"
        | "low angle shot"
        | "top-down shot";
    }

    if (videoOptions.shotSize) {
      requestBody.videoSettings.shotSize = videoOptions.shotSize as
        | "close-up shot"
        | "extreme close-up"
        | "medium shot"
        | "long shot"
        | "extreme long shot";
    }
  }

  Logger.info("Generating video via FireflyClient...", {
    requestBody,
  });

  const modelVersion: VideoModelVersion = "video1_standard";
  const response = await fireflyClient.generateVideoAsync(
    requestBody,
    modelVersion,
  );

  Logger.info("Generate video response:", { responseData: response });

  return response as unknown as IDataObject;
}
