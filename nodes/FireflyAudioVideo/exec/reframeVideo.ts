import {
  IExecuteFunctions,
  IDataObject,
  ApplicationError,
  LoggerProxy as Logger,
} from "n8n-workflow";
import {
  AudioVideoClient,
  type ReframeVideoRequest,
} from "../../../clients/audio-video";

export async function executeReframeVideo(
  this: IExecuteFunctions,
  i: number,
  audioVideoClient: AudioVideoClient,
): Promise<IDataObject> {
  const videoUrl = this.getNodeParameter("videoUrl", i) as string;
  const mediaType = this.getNodeParameter("mediaType", i, "video/mp4") as
    | "video/mp4"
    | "video/quicktime";
  const aspectRatios = this.getNodeParameter("aspectRatios", i) as string;
  const sceneEditDetection = this.getNodeParameter(
    "sceneEditDetection",
    i,
    true,
  ) as boolean;

  // Parse aspect ratios (comma-separated)
  const aspectRatioArray = aspectRatios
    .split(",")
    .map((ratio) => ratio.trim())
    .filter((ratio) => ratio.length > 0);

  if (aspectRatioArray.length === 0) {
    throw new ApplicationError(
      "At least one aspect ratio is required (e.g., '1:1, 9:16')",
    );
  }

  const requestBody: ReframeVideoRequest = {
    video: {
      source: { url: videoUrl },
      mediaType,
    },
    sceneEditDetection,
    outputConfig: {
      aspectRatios: aspectRatioArray,
    },
  };

  Logger.info("Audio/Video: Reframing video", {
    aspectRatios: aspectRatioArray,
    sceneEditDetection,
  });

  const response = await audioVideoClient.reframeVideo(requestBody);

  Logger.info("Audio/Video: Video reframing started", {
    jobId: response.jobId,
  });

  return response as unknown as IDataObject;
}
