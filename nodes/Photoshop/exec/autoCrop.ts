import {
  type IExecuteFunctions,
  type IDataObject,
  ApplicationError,
  LoggerProxy as Logger,
} from "n8n-workflow";
import type { PhotoshopClient } from "../../../clients/photoshop";

export async function executeAutoCrop(
  this: IExecuteFunctions,
  i: number,
  photoshopClient: PhotoshopClient,
): Promise<IDataObject> {
  const inputsJson = this.getNodeParameter("autoCropInputs", i) as string;
  const outputsJson = this.getNodeParameter("autoCropOutputs", i) as string;

  let inputs: unknown[];
  let outputs: unknown[];

  try {
    inputs = JSON.parse(inputsJson);
    if (!Array.isArray(inputs)) {
      throw new Error("Inputs must be an array");
    }
  } catch (error) {
    throw new ApplicationError(`Invalid JSON in "Inputs": ${error.message}`);
  }

  try {
    outputs = JSON.parse(outputsJson);
    if (!Array.isArray(outputs)) {
      throw new Error("Outputs must be an array");
    }
  } catch (error) {
    throw new ApplicationError(`Invalid JSON in "Outputs": ${error.message}`);
  }

  const request = {
    inputs,
    outputs,
  };

  Logger.info("Auto cropping via PhotoshopClient...", { request });

  const response = await photoshopClient.autoCrop(
    request as Parameters<typeof photoshopClient.autoCrop>[0],
  );

  Logger.info("Auto crop response:", { responseData: response });

  // Extract job ID from response
  const jobId = response._links.self.href.split("/").pop();
  return {
    ...response,
    jobId,
  } as unknown as IDataObject;
}

