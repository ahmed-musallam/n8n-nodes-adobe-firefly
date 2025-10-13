import {
  type IExecuteFunctions,
  type IDataObject,
  ApplicationError,
  LoggerProxy as Logger,
} from "n8n-workflow";
import type { PhotoshopClient } from "../../../clients/photoshop";

export async function executeMaskBodyParts(
  this: IExecuteFunctions,
  i: number,
  photoshopClient: PhotoshopClient,
): Promise<IDataObject> {
  const inputJson = this.getNodeParameter("maskBodyPartsInput", i) as string;
  const outputJson = this.getNodeParameter("maskBodyPartsOutput", i) as string;
  const bodyParts = this.getNodeParameter("bodyParts", i) as string[];

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

  const request = {
    input,
    output,
    bodyParts: bodyParts.length === 1 ? bodyParts[0] : bodyParts,
  };

  Logger.info("Masking body parts via PhotoshopClient...", { request });

  const response = await photoshopClient.maskBodyParts(
    request as unknown as Parameters<typeof photoshopClient.maskBodyParts>[0],
  );

  Logger.info("Mask body parts response:", { responseData: response });

  // Extract job ID from response
  const jobId = response._links.self.href.split("/").pop();
  return {
    ...response,
    jobId,
  } as unknown as IDataObject;
}
