import {
  IExecuteFunctions,
  IDataObject,
  LoggerProxy as Logger,
} from "n8n-workflow";
import {
  AudioVideoClient,
  type GenerateAvatarRequest,
  type SupportedLanguageCode,
  type BackgroundType,
} from "../../../clients/audio-video";

export async function executeGenerateAvatar(
  this: IExecuteFunctions,
  i: number,
  audioVideoClient: AudioVideoClient,
): Promise<IDataObject> {
  const inputType = this.getNodeParameter("inputType", i) as "text" | "audio";
  const avatarId = this.getNodeParameter("avatarId", i) as string;
  const backgroundType = this.getNodeParameter(
    "backgroundType",
    i,
    "color",
  ) as BackgroundType;

  let requestBody: GenerateAvatarRequest;

  if (inputType === "text") {
    const scriptInput = this.getNodeParameter("scriptInput", i) as string;
    const localeCode = this.getNodeParameter(
      "localeCode",
      i,
    ) as SupportedLanguageCode;
    const voiceId = this.getNodeParameter("voiceId", i) as string;

    const isUrl =
      scriptInput.trim().startsWith("http://") ||
      scriptInput.trim().startsWith("https://");

    requestBody = {
      script: {
        localeCode,
        mediaType: "text/plain",
        ...(isUrl ? { source: { url: scriptInput } } : { text: scriptInput }),
      },
      voiceId,
      avatarId,
      output: {
        mediaType: "video/mp4",
      },
    };
  } else {
    // Audio input
    const audioUrl = this.getNodeParameter("audioUrl", i) as string;
    const audioLocaleCode = this.getNodeParameter(
      "audioLocaleCode",
      i,
    ) as SupportedLanguageCode;

    requestBody = {
      audio: {
        source: { url: audioUrl },
        mediaType: "audio/wav",
        localeCode: audioLocaleCode,
      },
      avatarId,
      output: {
        mediaType: "video/mp4",
      },
    };
  }

  // Add background configuration
  if (backgroundType === "color") {
    const backgroundColor = this.getNodeParameter(
      "backgroundColor",
      i,
      "#FFFFFF",
    ) as string;
    requestBody.output.background = {
      type: "color",
      color: backgroundColor,
    };
  } else if (backgroundType === "image" || backgroundType === "video") {
    const backgroundUrl = this.getNodeParameter("backgroundUrl", i) as string;
    requestBody.output.background = {
      type: backgroundType,
      source: { url: backgroundUrl },
    };
  }

  Logger.info("Audio/Video: Generating avatar", {
    inputType,
    avatarId,
    backgroundType,
  });

  const response = await audioVideoClient.generateAvatar(requestBody);

  Logger.info("Audio/Video: Avatar generation started", {
    jobId: response.jobId,
  });

  return response as unknown as IDataObject;
}
