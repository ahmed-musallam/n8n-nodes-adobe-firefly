import {
  IExecuteFunctions,
  IDataObject,
  ApplicationError,
  LoggerProxy as Logger,
} from "n8n-workflow";
import { AudioVideoClient } from "../../../clients/audio-video";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function executeWaitForJob(
  this: IExecuteFunctions,
  i: number,
  audioVideoClient: AudioVideoClient,
): Promise<IDataObject> {
  const jobId = this.getNodeParameter("jobId", i) as string;
  const pollingInterval =
    (this.getNodeParameter("pollingInterval", i, 3) as number) * 1000;
  const timeoutMinutes = this.getNodeParameter("timeout", i, 5) as number;
  const timeoutMs = timeoutMinutes * 60 * 1000;
  const startTime = Date.now();

  Logger.info("Audio/Video: Waiting for job completion", {
    jobId,
    pollingIntervalMs: pollingInterval,
    timeoutMinutes,
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

    const response = await audioVideoClient.getJobStatus(jobId);
    const status = response.status as string;

    Logger.info("Audio/Video: Job status check", {
      jobId,
      status,
      attempt: attempts,
      elapsedSeconds: Math.floor(elapsed / 1000),
    });

    const terminalStates = ["succeeded", "failed"];
    if (terminalStates.includes(status)) {
      if (status === "failed") {
        const errorMessage = (
          "message" in response
            ? response.message
            : "Job failed without error details"
        ) as string;
        throw new ApplicationError(`Job ${jobId} failed: ${errorMessage}`, {
          level: "warning",
          extra: { response },
        });
      }

      Logger.info("Audio/Video: Job completed successfully", {
        jobId,
        attempts,
        totalTimeSeconds: Math.floor(elapsed / 1000),
      });

      return response as unknown as IDataObject;
    }

    await sleep(pollingInterval);
  }
}
