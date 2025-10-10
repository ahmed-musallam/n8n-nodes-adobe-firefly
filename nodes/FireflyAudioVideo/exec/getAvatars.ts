import {
  IExecuteFunctions,
  IDataObject,
  LoggerProxy as Logger,
} from "n8n-workflow";
import { AudioVideoClient } from "../../../clients/audio-video";

export async function executeGetAvatars(
  this: IExecuteFunctions,
  i: number,
  audioVideoClient: AudioVideoClient,
): Promise<IDataObject> {
  Logger.info("Audio/Video: Getting available avatars");

  const response = await audioVideoClient.getAvatars();

  Logger.info("Audio/Video: Retrieved avatars", {
    count: response.avatars.length,
  });

  return response as unknown as IDataObject;
}
