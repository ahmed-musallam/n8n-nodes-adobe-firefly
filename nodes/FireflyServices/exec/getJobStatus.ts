import {
  type IExecuteFunctions,
  type IDataObject,
  ApplicationError,
  LoggerProxy as Logger,
} from "n8n-workflow";
import { FireflyClient } from "../../../clients/firefly";

/**
 * Sleep helper function
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function executeGetJobStatus(
  this: IExecuteFunctions,
  i: number,
  fireflyClient: FireflyClient,
): Promise<IDataObject> {
  const jobId = this.getNodeParameter("jobId", i) as string;
  const waitForCompletion = this.getNodeParameter(
    "waitForCompletion",
    i,
    false,
  ) as boolean;

  Logger.info("Getting job status via FireflyClient...", {
    jobId,
    waitForCompletion,
  });

  // If not waiting for completion, just get the status once
  if (!waitForCompletion) {
    const response = await fireflyClient.getJobStatus(jobId);
    Logger.info("Job status response:", { responseData: response });
    return response as unknown as IDataObject;
  }

  // Wait for completion: poll until terminal state
  const pollingInterval =
    (this.getNodeParameter("pollingInterval", i, 3) as number) * 1000; // Convert to milliseconds
  const timeoutMinutes = this.getNodeParameter("timeout", i, 5) as number;
  const timeoutMs = timeoutMinutes * 60 * 1000; // Convert to milliseconds
  const startTime = Date.now();

  Logger.info("Waiting for job completion...", {
    pollingInterval: `${pollingInterval}ms`,
    timeout: `${timeoutMinutes} minutes`,
  });

  let attempts = 0;
  while (true) {
    attempts++;

    // Check for timeout
    const elapsed = Date.now() - startTime;
    if (elapsed > timeoutMs) {
      throw new ApplicationError(
        `Job ${jobId} did not complete within ${timeoutMinutes} minutes. Last status check after ${attempts} attempts.`,
      );
    }

    // Get job status
    const response = await fireflyClient.getJobStatus(jobId);
    const status = response.status as string;

    Logger.info(`Job status check #${attempts}:`, {
      jobId,
      status,
      elapsed: `${Math.round(elapsed / 1000)}s`,
    });

    // Check if job reached a terminal state
    const terminalStates = ["succeeded", "failed", "canceled"];
    if (terminalStates.includes(status)) {
      Logger.info("Job reached terminal state:", {
        jobId,
        status,
        attempts,
        totalTime: `${Math.round(elapsed / 1000)}s`,
      });

      // If failed, throw an error with details
      if (status === "failed") {
        const errorMessage =
          (response.error as { message?: string })?.message ||
          "Job failed without error details";
        throw new ApplicationError(`Job ${jobId} failed: ${errorMessage}`, {
          level: "warning",
          extra: { response },
        });
      }

      // If canceled, provide info but still return the response
      if (status === "canceled") {
        Logger.warn("Job was canceled:", { jobId, response });
      }

      return response as unknown as IDataObject;
    }

    // Job still in progress, wait before next poll
    await sleep(pollingInterval);
  }
}
