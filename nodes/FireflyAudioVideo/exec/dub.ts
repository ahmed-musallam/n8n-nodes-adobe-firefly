import {
  IExecuteFunctions,
  IDataObject,
  ApplicationError,
  LoggerProxy as Logger,
} from "n8n-workflow";
import {
  AudioVideoClient,
  type DubRequest,
  type SupportedLanguageCode,
  type AudioInputMediaType,
  type VideoInputMediaType,
} from "../../../clients/audio-video";

export async function executeDub(
  this: IExecuteFunctions,
  i: number,
  audioVideoClient: AudioVideoClient,
): Promise<IDataObject> {
  const inputType = this.getNodeParameter("inputType", i) as "audio" | "video";
  const sourceUrl = this.getNodeParameter("sourceUrl", i) as string;
  const targetLocaleCodes = this.getNodeParameter(
    "targetLocaleCodes",
    i,
  ) as string;

  // Parse target locale codes (comma-separated, required for dubbing)
  const localeCodesArray = targetLocaleCodes
    .split(",")
    .map((code) => code.trim())
    .filter((code) => code.length > 0) as SupportedLanguageCode[];

  if (localeCodesArray.length === 0) {
    throw new ApplicationError(
      "At least one target locale code is required for dubbing (e.g., 'es-ES, fr-FR')",
    );
  }

  let requestBody: DubRequest;

  if (inputType === "audio") {
    const audioMediaType = this.getNodeParameter(
      "audioMediaType",
      i,
      "audio/wav",
    ) as AudioInputMediaType;

    requestBody = {
      audio: {
        source: { url: sourceUrl },
        mediaType: audioMediaType,
      },
      targetLocaleCodes: localeCodesArray,
    };
  } else {
    const videoMediaType = this.getNodeParameter(
      "videoMediaType",
      i,
      "video/mp4",
    ) as VideoInputMediaType;
    const lipSync = this.getNodeParameter("lipSync", i, false) as boolean;

    requestBody = {
      video: {
        source: { url: sourceUrl },
        mediaType: videoMediaType,
      },
      targetLocaleCodes: localeCodesArray,
      lipSync,
    };
  }

  Logger.info("Audio/Video: Dubbing media", {
    inputType,
    targetLocales: localeCodesArray.length,
    lipSync: "lipSync" in requestBody ? requestBody.lipSync : false,
  });

  const response = await audioVideoClient.dub(requestBody);

  Logger.info("Audio/Video: Dubbing started", { jobId: response.jobId });

  return response as unknown as IDataObject;
}
