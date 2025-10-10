import {
  IExecuteFunctions,
  IDataObject,
  LoggerProxy as Logger,
} from "n8n-workflow";
import { SubstanceClient } from "../../../clients/substance";

export async function executeGetJobStatus(
  this: IExecuteFunctions,
  i: number,
  substanceClient: SubstanceClient,
): Promise<IDataObject> {
  const jobId = this.getNodeParameter("jobId", i) as string;

  Logger.info("Substance: Getting job status", { jobId });

  const response = await substanceClient.getJobStatus(jobId);

  Logger.info("Substance: Job status retrieved", {
    jobId,
    status: response.status,
  });

  return response as unknown as IDataObject;
}
