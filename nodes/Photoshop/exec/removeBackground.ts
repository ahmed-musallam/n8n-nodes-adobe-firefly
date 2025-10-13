import {
  type IExecuteFunctions,
  type IDataObject,
  ApplicationError,
  LoggerProxy as Logger,
} from "n8n-workflow";
import type { PhotoshopClient } from "../../../clients/photoshop";

export async function executeRemoveBackground(
  this: IExecuteFunctions,
  i: number,
  photoshopClient: PhotoshopClient,
): Promise<IDataObject> {
  const inputJson = this.getNodeParameter("removeBackgroundInput", i) as string;
  const outputJson = this.getNodeParameter(
    "removeBackgroundOutput",
    i,
  ) as string;
  const options = this.getNodeParameter(
    "removeBackgroundOptions",
    i,
    {},
  ) as IDataObject;

  let input: IDataObject;
  let output: IDataObject;

  try {
    input = JSON.parse(inputJson);
  } catch (error) {
    throw new ApplicationError(
      `Invalid JSON in "Input Storage": ${error.message}`,
    );
  }

  try {
    output = JSON.parse(outputJson);
  } catch (error) {
    throw new ApplicationError(
      `Invalid JSON in "Output Storage": ${error.message}`,
    );
  }

  // Build request
  const request: IDataObject = {
    input,
    output,
  };

  // Add mask format if specified
  if (options.maskFormat) {
    if (!request.output) {
      request.output = {};
    }
    (request.output as IDataObject).mask = {
      format: options.maskFormat,
    };
  }

  // Add options if specified
  if (Object.keys(options).length > 0) {
    request.options = {};
    if (options.optimize) {
      (request.options as IDataObject).optimize = options.optimize;
    }
    if (options.postprocess !== undefined) {
      (request.options as IDataObject).process = {
        postprocess: options.postprocess,
      };
    }
  }

  Logger.info("Removing background via PhotoshopClient...", { request });

  const response = await photoshopClient.removeBackground(
    request as object as Parameters<typeof photoshopClient.removeBackground>[0],
  );

  Logger.info("Remove background response:", { responseData: response });

  // Extract job ID from response
  const jobId = response._links.self.href.split("/").pop();
  return {
    ...response,
    jobId,
  } as unknown as IDataObject;
}

