import {
  type IExecuteFunctions,
  type IDataObject,
  ApplicationError,
  LoggerProxy as Logger,
} from "n8n-workflow";
import type { PhotoshopClient } from "../../../clients/photoshop";

export async function executeReplaceSmartObject(
  this: IExecuteFunctions,
  i: number,
  photoshopClient: PhotoshopClient,
): Promise<IDataObject> {
  const inputsJson = this.getNodeParameter("smartObjectInputs", i) as string;
  const smartObjectLayersJson = this.getNodeParameter(
    "smartObjectLayers",
    i,
  ) as string;
  const outputsJson = this.getNodeParameter("smartObjectOutputs", i) as string;

  let inputs: unknown[];
  let smartObjectOptions: IDataObject;
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
    smartObjectOptions = JSON.parse(smartObjectLayersJson);
  } catch (error) {
    throw new ApplicationError(
      `Invalid JSON in "Smart Object Layers": ${error.message}`,
    );
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
    options: smartObjectOptions,
    outputs,
  };

  Logger.info("Replacing smart object via PhotoshopClient...", { request });

  const response = await photoshopClient.replaceSmartObject(
    request as Parameters<typeof photoshopClient.replaceSmartObject>[0],
  );

  Logger.info("Replace smart object response:", { responseData: response });

  // Extract job ID from response
  const jobId = response._links.self.href.split("/").pop();
  return {
    ...response,
    jobId,
  } as unknown as IDataObject;
}

