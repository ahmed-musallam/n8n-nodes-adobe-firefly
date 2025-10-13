import {
  type IExecuteFunctions,
  type IDataObject,
  ApplicationError,
  LoggerProxy as Logger,
} from "n8n-workflow";
import type { PhotoshopClient } from "../../../clients/photoshop";

export async function executeFillMaskedAreas(
  this: IExecuteFunctions,
  i: number,
  photoshopClient: PhotoshopClient,
): Promise<IDataObject> {
  const sourceJson = this.getNodeParameter("fillSource", i) as string;
  const maskJson = this.getNodeParameter("fillMask", i) as string;
  const outputJson = this.getNodeParameter("fillOutput", i) as string;
  const fillMethod = this.getNodeParameter("fillMethod", i) as string;
  const prompt = this.getNodeParameter("fillPrompt", i, "") as string;

  let source: IDataObject;
  let mask: IDataObject;
  let output: IDataObject;

  try {
    source = JSON.parse(sourceJson);
  } catch (error) {
    throw new ApplicationError(
      `Invalid JSON in "Source Image": ${error.message}`,
    );
  }

  try {
    mask = JSON.parse(maskJson);
  } catch (error) {
    throw new ApplicationError(
      `Invalid JSON in "Mask Image": ${error.message}`,
    );
  }

  try {
    output = JSON.parse(outputJson);
  } catch (error) {
    throw new ApplicationError(
      `Invalid JSON in "Output Storage": ${error.message}`,
    );
  }

  const request: IDataObject = {
    input: {
      source,
      mask,
    },
    output,
  };

  // Add options if specified
  if (fillMethod || prompt) {
    request.options = {};
    if (fillMethod) {
      (request.options as IDataObject).fillMethod = fillMethod;
    }
    if (prompt && fillMethod === "generativeFill") {
      (request.options as IDataObject).prompt = prompt;
    }
  }

  Logger.info("Filling masked areas via PhotoshopClient...", { request });

  const response = await photoshopClient.fillMaskedAreas(
    request as unknown as Parameters<typeof photoshopClient.fillMaskedAreas>[0],
  );

  Logger.info("Fill masked areas response:", { responseData: response });

  // Extract job ID from response
  const jobId = response._links.self.href.split("/").pop();
  return {
    ...response,
    jobId,
  } as unknown as IDataObject;
}
