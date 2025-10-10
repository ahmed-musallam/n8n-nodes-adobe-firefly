import {
  IExecuteFunctions,
  IDataObject,
  LoggerProxy as Logger,
} from "n8n-workflow";
import { SubstanceClient } from "../../../clients/substance";

export async function executeCreateSpace(
  this: IExecuteFunctions,
  i: number,
  substanceClient: SubstanceClient,
): Promise<IDataObject> {
  const items = this.getInputData();
  const item = items[i];

  // Get binary property name from JSON field or use default
  const binaryProperty =
    (item.json?.Binary_Property as string) ||
    (this.getNodeParameter("binaryProperty", i, "data") as string) ||
    "data";

  Logger.info("Getting 3D file binary data from property:", {
    binaryProperty,
  });

  // Get binary data
  const binaryData = this.helpers.assertBinaryData(i, binaryProperty);
  const binaryDataBuffer = await this.helpers.getBinaryDataBuffer(
    i,
    binaryProperty,
  );

  // Get filename - try from binary data first, then parameter, then default
  const filename =
    binaryData.fileName ||
    (this.getNodeParameter("filename", i, undefined) as string | undefined) ||
    "model.glb";

  // Optional name parameter
  const name = this.getNodeParameter("name", i, undefined) as
    | string
    | undefined;

  Logger.info("Substance: Creating space", {
    filename,
    name,
    fileSize: binaryDataBuffer.length,
  });

  const response = await substanceClient.createSpace(
    binaryDataBuffer,
    filename,
    name,
  );

  Logger.info("Substance: Space created", { spaceId: response.id });

  return response as unknown as IDataObject;
}
