import {
  type IExecuteFunctions,
  type IDataObject,
  LoggerProxy as Logger,
} from "n8n-workflow";
import type { PhotoshopClient } from "../../../clients/photoshop";

export async function executeRemoveBackground(
  this: IExecuteFunctions,
  i: number,
  photoshopClient: PhotoshopClient,
): Promise<IDataObject> {
  const imageSourceUrl = this.getNodeParameter(
    "removeBackgroundImageUrl",
    i,
  ) as string;
  const mode = this.getNodeParameter(
    "removeBackgroundMode",
    i,
    "cutout",
  ) as string;
  const options = this.getNodeParameter(
    "removeBackgroundOptions",
    i,
    {},
  ) as IDataObject;

  // Build request according to v2 API
  const request: IDataObject = {
    image: {
      source: {
        url: imageSourceUrl,
      },
    },
    mode,
  };

  // Add output options if specified
  if (options.outputMediaType) {
    request.output = {
      mediaType: options.outputMediaType,
    };
  }

  // Add trim option if specified
  if (options.trim !== undefined) {
    request.trim = options.trim;
  }

  // Add background color if specified
  if (options.backgroundColor) {
    const bgColorWrapper = options.backgroundColor as IDataObject;
    // The backgroundColor is in a fixedCollection, so it's nested under 'color'
    if (bgColorWrapper.color) {
      const bgColor = bgColorWrapper.color as IDataObject;
      request.backgroundColor = {
        red: bgColor.red,
        green: bgColor.green,
        blue: bgColor.blue,
      };
      if (bgColor.alpha !== undefined) {
        (request.backgroundColor as IDataObject).alpha = bgColor.alpha;
      }
    }
  }

  // Add color decontamination if specified
  if (options.colorDecontamination !== undefined) {
    request.colorDecontamination = options.colorDecontamination;
  }

  Logger.info("Removing background via PhotoshopClient (v2)...", { request });

  const response = await photoshopClient.removeBackground(
    request as object as Parameters<typeof photoshopClient.removeBackground>[0],
  );

  Logger.info("Remove background response:", { responseData: response });

  // v2 API returns jobId and statusUrl directly
  return {
    ...response,
  } as unknown as IDataObject;
}
