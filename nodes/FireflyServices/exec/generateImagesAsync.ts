import {
  type IExecuteFunctions,
  type IDataObject,
  LoggerProxy as Logger,
  ApplicationError,
} from "n8n-workflow";
import {
  FireflyClient,
  type GenerateImagesV3AsyncRequest,
  type ModelVersion,
} from "../../../clients/ffs-client";

export async function executeGenerateImagesAsync(
  this: IExecuteFunctions,
  i: number,
  fireflyClient: FireflyClient,
): Promise<IDataObject> {
  const prompt = this.getNodeParameter("prompt", i) as string;
  const modelVersion = this.getNodeParameter("modelVersion", i) as ModelVersion;

  // Validate prompt length
  const MAX_PROMPT_LENGTH = 1024;
  if (prompt.length > MAX_PROMPT_LENGTH) {
    throw new ApplicationError(
      `Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters (current: ${prompt.length} characters). Please shorten your prompt.`,
    );
  }

  if (prompt.length < 1) {
    throw new ApplicationError("Prompt must be at least 1 character long.");
  }
  const {
    imageSize,
    contentClass,
    customModelId,
    numVariations,
    negativePrompt,
    seeds,
    structureReference,
    styleReference,
    upsamplerType,
    visualIntensity,
  } = this.getNodeParameter("additionalOptions", i, {}) as IDataObject;

  // Validate negative prompt length
  if (negativePrompt && typeof negativePrompt === "string") {
    if (negativePrompt.length > MAX_PROMPT_LENGTH) {
      throw new ApplicationError(
        `Negative prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters (current: ${negativePrompt.length} characters). Please shorten your negative prompt.`,
      );
    }
  }

  const parseSize = (size: string) => {
    const [width, height] = size.split("x").map(Number);
    return { width, height };
  };

  // Parse seeds from comma-separated string to array of integers
  const parsedSeeds = seeds
    ? (seeds as string)
        .split(",")
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n))
    : undefined;

  // Build structure reference object
  let structure;
  if (
    structureReference &&
    Object.keys(structureReference as object).length > 0
  ) {
    const structRef = structureReference as IDataObject;
    const sourceType = structRef.sourceType as string;
    const source: IDataObject = {};

    if (sourceType === "url" && structRef.url) {
      source.url = structRef.url;
    } else if (sourceType === "uploadId" && structRef.uploadId) {
      source.uploadId = structRef.uploadId;
    }

    if (Object.keys(source).length > 0) {
      structure = {
        imageReference: { source },
        ...(structRef.strength !== undefined && {
          strength: structRef.strength,
        }),
      };
    }
  }

  // Build style reference object
  let style;
  if (styleReference && Object.keys(styleReference as object).length > 0) {
    const styleRef = styleReference as IDataObject;
    const sourceType = styleRef.sourceType as string;
    const source: IDataObject = {};

    if (sourceType === "url" && styleRef.url) {
      source.url = styleRef.url;
    } else if (sourceType === "uploadId" && styleRef.uploadId) {
      source.uploadId = styleRef.uploadId;
    }

    if (Object.keys(source).length > 0) {
      style = {
        imageReference: { source },
        ...(styleRef.strength !== undefined && {
          strength: styleRef.strength,
        }),
        ...(styleRef.presets && {
          presets: (styleRef.presets as string)
            .split(",")
            .map((p) => p.trim())
            .filter((p) => p.length > 0),
        }),
      };
    }
  }

  // Build request body
  const requestBody: GenerateImagesV3AsyncRequest = {
    prompt,
    size: imageSize ? parseSize(imageSize as string) : undefined,
    contentClass: contentClass as string,
    customModelId: customModelId as string,
    numVariations: numVariations as number,
    negativePrompt: negativePrompt as string,
    seeds: parsedSeeds,
    structure,
    style,
    upsamplerType: upsamplerType as string,
    visualIntensity: visualIntensity as number,
  };

  Logger.info("Generating images via FireflyClient...", {
    requestBody,
  });

  const response = await fireflyClient.generateImagesAsync(
    requestBody,
    modelVersion,
  );

  Logger.info("Generate images response:", { responseData: response });

  return response as unknown as IDataObject;
}
