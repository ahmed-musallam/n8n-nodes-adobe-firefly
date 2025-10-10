import {
  IExecuteFunctions,
  IDataObject,
  LoggerProxy as Logger,
} from "n8n-workflow";
import { AudioVideoClient } from "../../../clients/audio-video";

export async function executeGetJobStatus(
  this: IExecuteFunctions,
  i: number,
  audioVideoClient: AudioVideoClient,
): Promise<IDataObject> {
  const jobId = this.getNodeParameter("jobId", i) as string;

  Logger.info("Audio/Video: Getting job status", { jobId });

  const response = await audioVideoClient.getJobStatus(jobId);

  Logger.info("Audio/Video: Job status retrieved", {
    jobId,
    status: response.status,
  });

  return response as unknown as IDataObject;
}
