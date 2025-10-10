import {
  IExecuteFunctions,
  IDataObject,
  LoggerProxy as Logger,
} from "n8n-workflow";
import {
  AudioVideoClient,
  type TranscribeRequest,
  type SupportedLanguageCode,
  type AudioInputMediaType,
  type VideoInputMediaType,
} from "../../../clients/audio-video";

export async function executeTranscribe(
  this: IExecuteFunctions,
  i: number,
  audioVideoClient: AudioVideoClient,
): Promise<IDataObject> {
  const inputType = this.getNodeParameter("inputType", i) as "audio" | "video";
  const sourceUrl = this.getNodeParameter("sourceUrl", i) as string;
  const targetLocaleCodes = this.getNodeParameter(
    "targetLocaleCodes",
    i,
    "",
  ) as string;
  const generateCaptions = this.getNodeParameter(
    "generateCaptions",
    i,
    false,
  ) as boolean;

  // Parse target locale codes (comma-separated)
  const localeCodesArray =
    targetLocaleCodes.length > 0
      ? (targetLocaleCodes
          .split(",")
          .map((code) => code.trim())
          .filter((code) => code.length > 0) as SupportedLanguageCode[])
      : undefined;

  let requestBody: TranscribeRequest;

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
    };
  } else {
    const videoMediaType = this.getNodeParameter(
      "videoMediaType",
      i,
      "video/mp4",
    ) as VideoInputMediaType;

    requestBody = {
      video: {
        source: { url: sourceUrl },
        mediaType: videoMediaType,
      },
    };
  }

  if (localeCodesArray && localeCodesArray.length > 0) {
    requestBody.targetLocaleCodes = localeCodesArray;
  }

  if (generateCaptions) {
    requestBody.captions = {
      targetFormats: ["SRT"],
    };
  }

  Logger.info("Audio/Video: Transcribing media", {
    inputType,
    targetLocales: localeCodesArray?.length || 0,
    generateCaptions,
  });

  const response = await audioVideoClient.transcribe(requestBody);

  Logger.info("Audio/Video: Transcription started", {
    jobId: response.jobId,
  });

  return response as unknown as IDataObject;
}
