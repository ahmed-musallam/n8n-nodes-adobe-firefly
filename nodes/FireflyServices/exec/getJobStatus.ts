import {
  type IExecuteFunctions,
  type IDataObject,
  LoggerProxy as Logger,
} from "n8n-workflow";
import { FireflyClient } from "../../../clients/ffs-client";

export async function executeGetJobStatus(
  this: IExecuteFunctions,
  i: number,
  fireflyClient: FireflyClient,
): Promise<IDataObject> {
  const jobId = this.getNodeParameter("jobId", i) as string;

  Logger.info("Getting job status via FireflyClient...", { jobId });

  const response = await fireflyClient.getJobStatus(jobId);

  Logger.info("Job status response:", { responseData: response });

  return response as unknown as IDataObject;
}
