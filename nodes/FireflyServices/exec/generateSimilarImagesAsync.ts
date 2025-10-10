import {
  type IExecuteFunctions,
  type IDataObject,
  LoggerProxy as Logger,
  ApplicationError,
} from "n8n-workflow";
import {
  FireflyClient,
  type GenerateSimilarImagesV3AsyncRequest,
  type ModelVersion,
} from "../../../clients/firefly";

export async function executeGenerateSimilarImagesAsync(
  this: IExecuteFunctions,
  i: number,
  fireflyClient: FireflyClient,
): Promise<IDataObject> {
  const similarImageUploadId = this.getNodeParameter(
    "similarImageUploadId",
    i,
  ) as string;
  const similarOptions = this.getNodeParameter(
    "similarOptions",
    i,
    {},
  ) as IDataObject;

  if (!similarImageUploadId || similarImageUploadId.length === 0) {
    throw new ApplicationError(
      "Reference Image Upload ID is required for generating similar images.",
    );
  }

  // Build request body
  const requestBody: GenerateSimilarImagesV3AsyncRequest = {
    image: {
      source: {
        uploadId: similarImageUploadId,
      },
    },
  };

  // Add optional parameters
  if (similarOptions.numVariations !== undefined) {
    requestBody.numVariations = similarOptions.numVariations as number;
  }

  // Parse seeds
  if (similarOptions.seeds && (similarOptions.seeds as string).length > 0) {
    const parsedSeeds = (similarOptions.seeds as string)
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
    if (parsedSeeds.length > 0) {
      requestBody.seeds = parsedSeeds;
    }
  }

  // Parse size
  if (similarOptions.size) {
    const [width, height] = (similarOptions.size as string)
      .split("x")
      .map(Number);
    requestBody.size = { width, height };
  }

  // Get model version if specified
  const modelVersion = similarOptions.modelVersion as ModelVersion | undefined;

  Logger.info("Generating similar images via FireflyClient...", {
    requestBody,
    modelVersion,
  });

  const response = await fireflyClient.generateSimilarImagesAsync(
    requestBody,
    modelVersion,
  );

  Logger.info("Generate similar images response:", { responseData: response });

  return response as unknown as IDataObject;
}
