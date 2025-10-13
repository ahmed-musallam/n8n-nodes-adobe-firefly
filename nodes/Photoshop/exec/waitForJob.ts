import {
  type IExecuteFunctions,
  type IDataObject,
  ApplicationError,
  LoggerProxy as Logger,
} from "n8n-workflow";
import type { PhotoshopClient } from "../../../clients/photoshop";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function executeWaitForJob(
  this: IExecuteFunctions,
  i: number,
  photoshopClient: PhotoshopClient,
): Promise<IDataObject> {
  const jobId = this.getNodeParameter("jobId", i) as string;
  const jobType = this.getNodeParameter("jobType", i) as string;
  const pollingInterval =
    (this.getNodeParameter("pollingInterval", i, 3) as number) * 1000;
  const timeoutMinutes = this.getNodeParameter("timeout", i, 5) as number;
  const timeoutMs = timeoutMinutes * 60 * 1000;
  const startTime = Date.now();

  Logger.info("Waiting for job completion...", {
    jobId,
    jobType,
    pollingInterval,
    timeout: timeoutMinutes,
  });

  let attempts = 0;
  while (true) {
    attempts++;
    const elapsed = Date.now() - startTime;

    if (elapsed > timeoutMs) {
      throw new ApplicationError(
        `Job ${jobId} did not complete within ${timeoutMinutes} minutes. Last status check after ${attempts} attempts.`,
      );
    }

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

    const status = response.status as string;

    Logger.info(`Job status check #${attempts}:`, { status, elapsed });

    const terminalStates = ["succeeded", "failed", "cancelled"];
    if (terminalStates.includes(status)) {
      if (status === "failed") {
        const errorMessage =
          (response.errors as { title?: string })?.title ||
          "Job failed without error details";
        throw new ApplicationError(`Job ${jobId} failed: ${errorMessage}`, {
          level: "warning",
          extra: { response },
        });
      }
      Logger.info("Job completed successfully:", { jobId, attempts, elapsed });
      return response as unknown as IDataObject;
    }

    await sleep(pollingInterval);
  }
}

