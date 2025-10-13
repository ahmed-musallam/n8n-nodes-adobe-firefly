import {
  type IExecuteFunctions,
  type IDataObject,
  ApplicationError,
  LoggerProxy as Logger,
} from "n8n-workflow";
import type { PhotoshopClient } from "../../../clients/photoshop";

export async function executeMaskObjects(
  this: IExecuteFunctions,
  i: number,
  photoshopClient: PhotoshopClient,
): Promise<IDataObject> {
  const inputJson = this.getNodeParameter("maskObjectsInput", i) as string;
  const outputJson = this.getNodeParameter("maskObjectsOutput", i) as string;
  const objectTypes = this.getNodeParameter("objectTypes", i) as string[];

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
    objectType: objectTypes.length === 1 ? objectTypes[0] : objectTypes,
  };

  Logger.info("Masking objects via PhotoshopClient...", { request });

  const response = await photoshopClient.maskObjects(
    request as unknown as Parameters<typeof photoshopClient.maskObjects>[0],
  );

  Logger.info("Mask objects response:", { responseData: response });

  // Extract job ID from response
  const jobId = response._links.self.href.split("/").pop();
  return {
    ...response,
    jobId,
  } as unknown as IDataObject;
}
