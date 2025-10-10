import {
  IExecuteFunctions,
  IDataObject,
  LoggerProxy as Logger,
} from "n8n-workflow";
import {
  AudioVideoClient,
  type GenerateSpeechRequest,
  type SupportedLanguageCode,
} from "../../../clients/audio-video";

export async function executeGenerateSpeech(
  this: IExecuteFunctions,
  i: number,
  audioVideoClient: AudioVideoClient,
): Promise<IDataObject> {
  const scriptInput = this.getNodeParameter("scriptInput", i) as string;
  const localeCode = this.getNodeParameter(
    "localeCode",
    i,
  ) as SupportedLanguageCode;
  const voiceId = this.getNodeParameter("voiceId", i) as string;

  // Determine if input is text or URL
  const isUrl =
    scriptInput.trim().startsWith("http://") ||
    scriptInput.trim().startsWith("https://");

  const requestBody: GenerateSpeechRequest = {
    script: {
      localeCode,
      mediaType: "text/plain",
      ...(isUrl ? { source: { url: scriptInput } } : { text: scriptInput }),
    },
    voiceId,
    output: {
      mediaType: "audio/wav",
    },
  };

  Logger.info("Audio/Video: Generating speech", {
    isUrl,
    localeCode,
    voiceId,
  });

  const response = await audioVideoClient.generateSpeech(requestBody);

  Logger.info("Audio/Video: Speech generation started", {
    jobId: response.jobId,
  });

  return response as unknown as IDataObject;
}
