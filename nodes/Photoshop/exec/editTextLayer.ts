import {
  type IExecuteFunctions,
  type IDataObject,
  ApplicationError,
  LoggerProxy as Logger,
} from "n8n-workflow";
import type { PhotoshopClient } from "../../../clients/photoshop";

export async function executeEditTextLayer(
  this: IExecuteFunctions,
  i: number,
  photoshopClient: PhotoshopClient,
): Promise<IDataObject> {
  const inputsJson = this.getNodeParameter("textLayerInputs", i) as string;
  const textLayersJson = this.getNodeParameter("textLayers", i) as string;
  const outputsJson = this.getNodeParameter("textLayerOutputs", i) as string;

  let inputs: unknown[];
  let textLayersOptions: IDataObject;
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
    textLayersOptions = JSON.parse(textLayersJson);
  } catch (error) {
    throw new ApplicationError(
      `Invalid JSON in "Text Layers": ${error.message}`,
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
    options: textLayersOptions,
    outputs,
  };

  Logger.info("Editing text layer via PhotoshopClient...", { request });

  const response = await photoshopClient.editTextLayer(
    request as Parameters<typeof photoshopClient.editTextLayer>[0],
  );

  Logger.info("Edit text layer response:", { responseData: response });

  // Extract job ID from response
  const jobId = response._links.self.href.split("/").pop();
  return {
    ...response,
    jobId,
  } as unknown as IDataObject;
}

