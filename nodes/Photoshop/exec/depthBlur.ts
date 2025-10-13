import {
  type IExecuteFunctions,
  type IDataObject,
  ApplicationError,
  LoggerProxy as Logger,
} from "n8n-workflow";
import type { PhotoshopClient } from "../../../clients/photoshop";

export async function executeDepthBlur(
  this: IExecuteFunctions,
  i: number,
  photoshopClient: PhotoshopClient,
): Promise<IDataObject> {
  const inputsJson = this.getNodeParameter("depthBlurInputs", i) as string;
  const outputsJson = this.getNodeParameter("depthBlurOutputs", i) as string;
  const blurOptions = this.getNodeParameter(
    "blurOptions",
    i,
    {},
  ) as IDataObject;

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

  const request: IDataObject = {
    inputs,
    outputs,
  };

  // Add blur options if specified
  if (Object.keys(blurOptions).length > 0) {
    request.options = {};
    if (blurOptions.blurStrength !== undefined) {
      (request.options as IDataObject).blurStrength = blurOptions.blurStrength;
    }
    if (blurOptions.focalX !== undefined || blurOptions.focalY !== undefined) {
      (request.options as IDataObject).focalSelector = {};
      if (blurOptions.focalX !== undefined) {
        ((request.options as IDataObject).focalSelector as IDataObject).x =
          blurOptions.focalX;
      }
      if (blurOptions.focalY !== undefined) {
        ((request.options as IDataObject).focalSelector as IDataObject).y =
          blurOptions.focalY;
      }
    }
  }

  Logger.info("Applying depth blur via PhotoshopClient...", { request });

  const response = await photoshopClient.applyDepthBlur(
    request as unknown as Parameters<typeof photoshopClient.applyDepthBlur>[0],
  );

  Logger.info("Apply depth blur response:", { responseData: response });

  // Extract job ID from response
  const jobId = response._links.self.href.split("/").pop();
  return {
    ...response,
    jobId,
  } as unknown as IDataObject;
}
