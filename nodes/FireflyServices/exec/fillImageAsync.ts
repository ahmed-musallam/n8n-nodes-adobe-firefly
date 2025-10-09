import {
  type IExecuteFunctions,
  type IDataObject,
  LoggerProxy as Logger,
  ApplicationError,
} from "n8n-workflow";
import {
  FireflyClient,
  type FillImageV3AsyncRequest,
} from "../../../clients/ffs-client";

export async function executeFillImageAsync(
  this: IExecuteFunctions,
  i: number,
  fireflyClient: FireflyClient,
): Promise<IDataObject> {
  const fillSourceImageUploadId = this.getNodeParameter(
    "fillSourceImageUploadId",
    i,
  ) as string;
  const fillMaskUploadId = this.getNodeParameter(
    "fillMaskUploadId",
    i,
  ) as string;
  const fillOptions = this.getNodeParameter(
    "fillOptions",
    i,
    {},
  ) as IDataObject;

  if (!fillSourceImageUploadId || fillSourceImageUploadId.length === 0) {
    throw new ApplicationError(
      "Source Image Upload ID is required for filling images.",
    );
  }

  if (!fillMaskUploadId || fillMaskUploadId.length === 0) {
    throw new ApplicationError(
      "Mask Upload ID is required for filling images.",
    );
  }

  // Build request body
  const requestBody: FillImageV3AsyncRequest = {
    image: {
      source: {
        uploadId: fillSourceImageUploadId,
      },
    },
    mask: {
      source: {
        uploadId: fillMaskUploadId,
      },
    },
  };

  // Add invert mask if specified
  if (fillOptions.invertMask !== undefined) {
    requestBody.mask.invert = fillOptions.invertMask as boolean;
  }

  // Add optional parameters
  if (fillOptions.numVariations !== undefined) {
    requestBody.numVariations = fillOptions.numVariations as number;
  }

  // Validate and add prompt
  if (fillOptions.prompt && (fillOptions.prompt as string).length > 0) {
    const prompt = fillOptions.prompt as string;
    if (prompt.length > 1024) {
      throw new ApplicationError(
        `Prompt exceeds maximum length of 1024 characters (current: ${prompt.length} characters). Please shorten your prompt.`,
      );
    }
    requestBody.prompt = prompt;
  }

  // Validate and add negative prompt
  if (
    fillOptions.negativePrompt &&
    (fillOptions.negativePrompt as string).length > 0
  ) {
    const negativePrompt = fillOptions.negativePrompt as string;
    if (negativePrompt.length > 1024) {
      throw new ApplicationError(
        `Negative Prompt exceeds maximum length of 1024 characters (current: ${negativePrompt.length} characters). Please shorten your negative prompt.`,
      );
    }
    requestBody.negativePrompt = negativePrompt;
  }

  // Add promptBiasingLocaleCode if specified
  if (
    fillOptions.promptBiasingLocaleCode &&
    (fillOptions.promptBiasingLocaleCode as string).length > 0
  ) {
    requestBody.promptBiasingLocaleCode =
      fillOptions.promptBiasingLocaleCode as string;
  }

  // Parse seeds
  if (fillOptions.seeds && (fillOptions.seeds as string).length > 0) {
    const parsedSeeds = (fillOptions.seeds as string)
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
    if (parsedSeeds.length > 0) {
      requestBody.seeds = parsedSeeds;
    }
  }

  // Parse size
  if (fillOptions.size) {
    const [width, height] = (fillOptions.size as string).split("x").map(Number);
    requestBody.size = { width, height };
  }

  Logger.info("Filling image via FireflyClient...", {
    requestBody,
  });

  const response = await fireflyClient.fillImageAsync(requestBody);

  Logger.info("Fill image response:", { responseData: response });

  return response as unknown as IDataObject;
}
