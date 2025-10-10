import {
  type IExecuteFunctions,
  type IDataObject,
  LoggerProxy as Logger,
  ApplicationError,
} from "n8n-workflow";
import {
  FireflyClient,
  type ExpandImageV3AsyncRequest,
} from "../../../clients/firefly";

export async function executeExpandImageAsync(
  this: IExecuteFunctions,
  i: number,
  fireflyClient: FireflyClient,
): Promise<IDataObject> {
  const sourceImageUploadId = this.getNodeParameter(
    "sourceImageUploadId",
    i,
  ) as string;
  const expandOptions = this.getNodeParameter(
    "expandOptions",
    i,
    {},
  ) as IDataObject;

  if (!sourceImageUploadId || sourceImageUploadId.length === 0) {
    throw new ApplicationError(
      "Source Image Upload ID is required for expanding images.",
    );
  }

  // Build request body
  const requestBody: ExpandImageV3AsyncRequest = {
    image: {
      source: {
        uploadId: sourceImageUploadId,
      },
    },
  };

  // Add mask if specified
  if (
    expandOptions.maskUploadId &&
    (expandOptions.maskUploadId as string).length > 0
  ) {
    requestBody.mask = {
      source: {
        uploadId: expandOptions.maskUploadId as string,
      },
    };

    // Add invert flag if specified
    if (expandOptions.invertMask !== undefined) {
      requestBody.mask.invert = expandOptions.invertMask as boolean;
    }
  }

  // Add optional parameters
  if (expandOptions.numVariations !== undefined) {
    requestBody.numVariations = expandOptions.numVariations as number;
  }

  if (expandOptions.prompt && (expandOptions.prompt as string).length > 0) {
    const prompt = expandOptions.prompt as string;
    if (prompt.length > 1024) {
      throw new ApplicationError(
        `Prompt exceeds maximum length of 1024 characters (current: ${prompt.length} characters). Please shorten your prompt.`,
      );
    }
    requestBody.prompt = prompt;
  }

  // Parse seeds
  if (expandOptions.seeds && (expandOptions.seeds as string).length > 0) {
    const parsedSeeds = (expandOptions.seeds as string)
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
    if (parsedSeeds.length > 0) {
      requestBody.seeds = parsedSeeds;
    }
  }

  // Parse size (width and height)
  if (expandOptions.width !== undefined || expandOptions.height !== undefined) {
    requestBody.size = {
      width: (expandOptions.width as number) || 2048,
      height: (expandOptions.height as number) || 2048,
    };
  }

  // Build placement if any alignment or inset is specified
  const hasAlignment =
    expandOptions.horizontalAlignment || expandOptions.verticalAlignment;
  const hasInset =
    expandOptions.insetTop ||
    expandOptions.insetRight ||
    expandOptions.insetBottom ||
    expandOptions.insetLeft;

  if (hasAlignment || hasInset) {
    requestBody.placement = {};

    if (hasAlignment) {
      requestBody.placement.alignment = {};
      if (expandOptions.horizontalAlignment) {
        requestBody.placement.alignment.horizontal =
          expandOptions.horizontalAlignment as "center" | "left" | "right";
      }
      if (expandOptions.verticalAlignment) {
        requestBody.placement.alignment.vertical =
          expandOptions.verticalAlignment as "center" | "top" | "bottom";
      }
    }

    if (hasInset) {
      requestBody.placement.inset = {};
      if (expandOptions.insetTop) {
        requestBody.placement.inset.top = expandOptions.insetTop as number;
      }
      if (expandOptions.insetRight) {
        requestBody.placement.inset.right = expandOptions.insetRight as number;
      }
      if (expandOptions.insetBottom) {
        requestBody.placement.inset.bottom =
          expandOptions.insetBottom as number;
      }
      if (expandOptions.insetLeft) {
        requestBody.placement.inset.left = expandOptions.insetLeft as number;
      }
    }
  }

  Logger.info("Expanding image via FireflyClient...", {
    requestBody,
  });

  const response = await fireflyClient.expandImageAsync(requestBody);

  Logger.info("Expand image response:", { responseData: response });

  return response as unknown as IDataObject;
}
