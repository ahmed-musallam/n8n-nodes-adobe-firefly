import {
  type IExecuteFunctions,
  type IDataObject,
  LoggerProxy as Logger,
  ApplicationError,
} from "n8n-workflow";
import {
  FireflyClient,
  type GenerateObjectCompositeV3AsyncRequest,
} from "../../../clients/ffs-client";

export async function executeGenerateObjectCompositeAsync(
  this: IExecuteFunctions,
  i: number,
  fireflyClient: FireflyClient,
): Promise<IDataObject> {
  const compositeImageUploadId = this.getNodeParameter(
    "compositeImageUploadId",
    i,
  ) as string;
  const compositePrompt = this.getNodeParameter("compositePrompt", i) as string;
  const compositeOptions = this.getNodeParameter(
    "compositeOptions",
    i,
    {},
  ) as IDataObject;

  if (!compositeImageUploadId || compositeImageUploadId.length === 0) {
    throw new ApplicationError(
      "Source Image Upload ID is required for generating object composite.",
    );
  }

  if (!compositePrompt || compositePrompt.length === 0) {
    throw new ApplicationError(
      "Prompt is required for generating object composite.",
    );
  }

  // Validate prompt length
  if (compositePrompt.length > 1024) {
    throw new ApplicationError(
      `Prompt exceeds maximum length of 1024 characters (current: ${compositePrompt.length} characters). Please shorten your prompt.`,
    );
  }
  if (compositePrompt.length < 1) {
    throw new ApplicationError("Prompt must be at least 1 character long.");
  }

  // Build request body
  const requestBody: GenerateObjectCompositeV3AsyncRequest = {
    image: {
      source: {
        uploadId: compositeImageUploadId,
      },
    },
    prompt: compositePrompt,
  };

  // Add optional parameters
  if (compositeOptions.contentClass) {
    requestBody.contentClass = compositeOptions.contentClass as "photo" | "art";
  }

  if (compositeOptions.numVariations !== undefined) {
    requestBody.numVariations = compositeOptions.numVariations as number;
  }

  // Add mask if specified
  if (
    compositeOptions.maskUploadId &&
    (compositeOptions.maskUploadId as string).length > 0
  ) {
    requestBody.mask = {
      source: {
        uploadId: compositeOptions.maskUploadId as string,
      },
    };
  }

  // Parse seeds
  if (compositeOptions.seeds && (compositeOptions.seeds as string).length > 0) {
    const parsedSeeds = (compositeOptions.seeds as string)
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
    if (parsedSeeds.length > 0) {
      requestBody.seeds = parsedSeeds;
    }
  }

  // Parse size
  if (compositeOptions.size) {
    const [width, height] = (compositeOptions.size as string)
      .split("x")
      .map(Number);
    requestBody.size = { width, height };
  }

  // Build placement if any alignment or inset is specified
  const hasAlignment =
    compositeOptions.horizontalAlignment || compositeOptions.verticalAlignment;
  const hasInset =
    compositeOptions.insetTop ||
    compositeOptions.insetRight ||
    compositeOptions.insetBottom ||
    compositeOptions.insetLeft;

  if (hasAlignment || hasInset) {
    requestBody.placement = {};

    if (hasAlignment) {
      requestBody.placement.alignment = {};
      if (compositeOptions.horizontalAlignment) {
        requestBody.placement.alignment.horizontal =
          compositeOptions.horizontalAlignment as "center" | "left" | "right";
      }
      if (compositeOptions.verticalAlignment) {
        requestBody.placement.alignment.vertical =
          compositeOptions.verticalAlignment as "center" | "top" | "bottom";
      }
    }

    if (hasInset) {
      requestBody.placement.inset = {};
      if (compositeOptions.insetTop) {
        requestBody.placement.inset.top = compositeOptions.insetTop as number;
      }
      if (compositeOptions.insetRight) {
        requestBody.placement.inset.right =
          compositeOptions.insetRight as number;
      }
      if (compositeOptions.insetBottom) {
        requestBody.placement.inset.bottom =
          compositeOptions.insetBottom as number;
      }
      if (compositeOptions.insetLeft) {
        requestBody.placement.inset.left = compositeOptions.insetLeft as number;
      }
    }
  }

  // Build style if any style options are specified
  if (
    compositeOptions.styleReferenceUploadId ||
    compositeOptions.styleStrength
  ) {
    requestBody.style = {};

    if (
      compositeOptions.styleReferenceUploadId &&
      (compositeOptions.styleReferenceUploadId as string).length > 0
    ) {
      requestBody.style.imageReference = {
        source: {
          uploadId: compositeOptions.styleReferenceUploadId as string,
        },
      };
    }

    if (compositeOptions.styleStrength !== undefined) {
      requestBody.style.strength = compositeOptions.styleStrength as number;
    }
  }

  Logger.info("Generating object composite via FireflyClient...", {
    requestBody,
  });

  const response =
    await fireflyClient.generateObjectCompositeAsync(requestBody);

  Logger.info("Generate object composite response:", {
    responseData: response,
  });

  return response as unknown as IDataObject;
}
