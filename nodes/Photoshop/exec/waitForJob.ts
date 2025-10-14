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
  const statusUrl = this.getNodeParameter("statusUrl", i) as string;
  const pollingInterval =
    (this.getNodeParameter("pollingInterval", i, 3) as number) * 1000;
  const timeoutMinutes = this.getNodeParameter("timeout", i, 5) as number;
  const timeoutMs = timeoutMinutes * 60 * 1000;
  const startTime = Date.now();

  Logger.info("Waiting for job completion...", {
    statusUrl,
    pollingInterval,
    timeout: timeoutMinutes,
  });

  let attempts = 0;
  let jobId = "unknown";

  while (true) {
    attempts++;
    const elapsed = Date.now() - startTime;

    if (elapsed > timeoutMs) {
      throw new ApplicationError(
        `Job did not complete within ${timeoutMinutes} minutes. Last status check after ${attempts} attempts.`,
      );
    }

    const response = await photoshopClient.getJobStatus(statusUrl);

    // Extract jobId from response for logging
    if (response.jobId) {
      jobId = response.jobId;
    }

    const status = response.status as string;

    Logger.info(`Job status check #${attempts}:`, { jobId, status, elapsed });

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
