import {
  type IExecuteFunctions,
  type IDataObject,
  ApplicationError,
  LoggerProxy as Logger,
} from "n8n-workflow";
import type { PhotoshopClient } from "../../../clients/photoshop";

export async function executeGetJobStatus(
  this: IExecuteFunctions,
  i: number,
  photoshopClient: PhotoshopClient,
): Promise<IDataObject> {
  const jobId = this.getNodeParameter("jobId", i) as string;
  const jobType = this.getNodeParameter("jobType", i) as string;

  Logger.info("Getting job status via PhotoshopClient...", { jobId, jobType });

  let response;

  switch (jobType) {
    case "psd":
      response = await photoshopClient.getJobStatus(jobId);
      break;
    case "maskingV2":
      response = await photoshopClient.getMaskingJobStatus(jobId);
      break;
    case "maskingV1":
      response = await photoshopClient.getMaskingJobStatusV1(jobId);
      break;
    default:
      throw new ApplicationError(`Unknown job type: ${jobType}`);
  }

  Logger.info("Get job status response:", { responseData: response });

  return response as unknown as IDataObject;
}

