import {
  IExecuteFunctions,
  IDataObject,
  ApplicationError,
  LoggerProxy as Logger,
} from "n8n-workflow";
import { SubstanceClient } from "../../../clients/substance";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function executeWaitForJob(
  this: IExecuteFunctions,
  i: number,
  substanceClient: SubstanceClient,
): Promise<IDataObject> {
  const jobId = this.getNodeParameter("jobId", i) as string;
  const pollingInterval =
    (this.getNodeParameter("pollingInterval", i, 3) as number) * 1000;
  const timeoutMinutes = this.getNodeParameter("timeout", i, 10) as number;
  const timeoutMs = timeoutMinutes * 60 * 1000;
  const startTime = Date.now();

  Logger.info("Substance: Starting to wait for job", {
    jobId,
    pollingInterval: pollingInterval / 1000,
    timeoutMinutes,
  });

  let attempts = 0;
  while (true) {
    attempts++;
    const elapsed = Date.now() - startTime;
    if (elapsed > timeoutMs) {
      throw new ApplicationError(
        `Substance job ${jobId} did not complete within ${timeoutMinutes} minutes. Last status check after ${attempts} attempts.`,
      );
    }

    const response = await substanceClient.getJobStatus(jobId);
    const status = response.status as string;

    Logger.info("Substance: Job status check", {
      jobId,
      status,
      attempt: attempts,
      elapsedSeconds: Math.round(elapsed / 1000),
    });

    const terminalStates = ["succeeded", "failed"];
    if (terminalStates.includes(status)) {
      if (status === "failed") {
        const errorMessage =
          response.error || "Job failed without error details";
        throw new ApplicationError(
          `Substance job ${jobId} failed: ${errorMessage}`,
          {
            level: "warning",
            extra: { response },
          },
        );
      }

      Logger.info("Substance: Job completed successfully", {
        jobId,
        attempts,
        totalTime: Math.round(elapsed / 1000) + "s",
      });

      return response as unknown as IDataObject;
    }

    await sleep(pollingInterval);
  }
}
