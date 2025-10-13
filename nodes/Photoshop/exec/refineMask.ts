import {
  type IExecuteFunctions,
  type IDataObject,
  ApplicationError,
  LoggerProxy as Logger,
} from "n8n-workflow";
import type { PhotoshopClient } from "../../../clients/photoshop";

export async function executeRefineMask(
  this: IExecuteFunctions,
  i: number,
  photoshopClient: PhotoshopClient,
): Promise<IDataObject> {
  const sourceJson = this.getNodeParameter("refineMaskSource", i) as string;
  const maskJson = this.getNodeParameter("refineMaskMask", i) as string;
  const outputJson = this.getNodeParameter("refineMaskOutput", i) as string;
  const refinementOptions = this.getNodeParameter(
    "refinementOptions",
    i,
    {},
  ) as IDataObject;

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

  // Add refinement options if specified
  if (Object.keys(refinementOptions).length > 0) {
    request.options = {};
    const options = request.options as IDataObject;

    if (refinementOptions.feather !== undefined) {
      options.feather = refinementOptions.feather;
    }
    if (refinementOptions.smoothness !== undefined) {
      options.smoothness = refinementOptions.smoothness;
    }
    if (refinementOptions.contrast !== undefined) {
      options.contrast = refinementOptions.contrast;
    }
    if (refinementOptions.shiftEdge !== undefined) {
      options.shiftEdge = refinementOptions.shiftEdge;
    }
    if (refinementOptions.decontaminate !== undefined) {
      options.decontaminate = refinementOptions.decontaminate;
    }
    if (refinementOptions.decontaminationAmount !== undefined) {
      options.decontaminationAmount = refinementOptions.decontaminationAmount;
    }
  }

  Logger.info("Refining mask via PhotoshopClient...", { request });

  const response = await photoshopClient.refineMask(
    request as unknown as Parameters<typeof photoshopClient.refineMask>[0],
  );

  Logger.info("Refine mask response:", { responseData: response });

  // Extract job ID from response
  const jobId = response._links.self.href.split("/").pop();
  return {
    ...response,
    jobId,
  } as unknown as IDataObject;
}
