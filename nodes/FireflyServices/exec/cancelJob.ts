import {
  type IExecuteFunctions,
  type IDataObject,
  LoggerProxy as Logger,
} from "n8n-workflow";
import { FireflyClient } from "../../../clients/ffs-client";

export async function executeCancelJob(
  this: IExecuteFunctions,
  i: number,
  fireflyClient: FireflyClient,
): Promise<IDataObject> {
  const jobId = this.getNodeParameter("jobId", i) as string;

  Logger.info("Canceling job via HTTP request...", { jobId });

  await fireflyClient.cancelJob(jobId);

  Logger.info("Job canceled successfully");

  return {};
}
