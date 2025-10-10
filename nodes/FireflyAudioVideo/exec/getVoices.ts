import {
  IExecuteFunctions,
  IDataObject,
  LoggerProxy as Logger,
} from "n8n-workflow";
import { AudioVideoClient } from "../../../clients/audio-video";

export async function executeGetVoices(
  this: IExecuteFunctions,
  i: number,
  audioVideoClient: AudioVideoClient,
): Promise<IDataObject> {
  Logger.info("Audio/Video: Getting available voices");

  const response = await audioVideoClient.getVoices();

  Logger.info("Audio/Video: Retrieved voices", {
    count: response.voices.length,
  });

  return response as unknown as IDataObject;
}
