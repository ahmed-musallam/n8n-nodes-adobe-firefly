import {
  type IExecuteFunctions,
  type IDataObject,
  LoggerProxy as Logger,
} from "n8n-workflow";
import type { PhotoshopClient } from "../../../clients/photoshop";

export async function executeGetJobStatus(
  this: IExecuteFunctions,
  i: number,
  photoshopClient: PhotoshopClient,
): Promise<IDataObject> {
  const statusUrl = this.getNodeParameter("statusUrl", i) as string;

  Logger.info("Getting job status via PhotoshopClient...", { statusUrl });

  const response = await photoshopClient.getJobStatus(statusUrl);

  Logger.info("Get job status response:", {
    jobId: response.jobId,
    status: response.status,
    responseData: response,
  });

  return response as unknown as IDataObject;
}
