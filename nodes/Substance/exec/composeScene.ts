import {
  IExecuteFunctions,
  IDataObject,
  ApplicationError,
  LoggerProxy as Logger,
} from "n8n-workflow";
import {
  SubstanceClient,
  type ComposeSceneRequest,
  type MountedSource,
} from "../../../clients/substance";

export async function executeComposeScene(
  this: IExecuteFunctions,
  i: number,
  substanceClient: SubstanceClient,
): Promise<IDataObject> {
  const prompt = this.getNodeParameter("prompt", i) as string;
  const heroAsset = this.getNodeParameter("heroAsset", i) as string;
  const sources = this.getNodeParameter("sources", i) as string;

  // Parse sources JSON
  let parsedSources: MountedSource[];
  try {
    parsedSources = JSON.parse(sources);
  } catch {
    throw new ApplicationError(
      "Invalid sources JSON. Expected array of MountedSource objects.",
    );
  }

  // Build the request
  const requestBody: ComposeSceneRequest = {
    sources: parsedSources,
    prompt,
    heroAsset,
  };

  // Optional parameters
  const options = this.getNodeParameter("composeOptions", i, {}) as IDataObject;

  if (options.cameraName) {
    requestBody.cameraName = options.cameraName as string;
  }
  if (options.sceneFile) {
    requestBody.sceneFile = options.sceneFile as string;
  }
  if (options.contentClass) {
    requestBody.contentClass = options.contentClass as "photo" | "art";
  }
  if (options.modelVersion) {
    requestBody.modelVersion = options.modelVersion as
      | "image3_fast"
      | "image4_standard"
      | "image4_ultra";
  }
  if (options.numVariations) {
    requestBody.numVariations = options.numVariations as number;
  }
  if (options.seeds) {
    const seedsStr = options.seeds as string;
    requestBody.seeds = seedsStr.split(",").map((s) => parseInt(s.trim(), 10));
  }
  if (options.lightingSeeds) {
    const seedsStr = options.lightingSeeds as string;
    requestBody.lightingSeeds = seedsStr
      .split(",")
      .map((s) => parseInt(s.trim(), 10));
  }
  if (options.width || options.height) {
    requestBody.size = {
      width: (options.width as number) || 2048,
      height: (options.height as number) || 2048,
    };
  }
  if (options.styleImage) {
    requestBody.styleImage = options.styleImage as string;
  }
  if (options.enableGroundPlane !== undefined) {
    requestBody.enableGroundPlane = options.enableGroundPlane as boolean;
  }
  if (options.environmentExposure !== undefined) {
    requestBody.environmentExposure = options.environmentExposure as number;
  }

  Logger.info("Substance: Composing 3D scene", { requestBody });

  const response = await substanceClient.composeScene(requestBody);

  Logger.info("Substance: Scene composition started", { jobId: response.id });

  return response as unknown as IDataObject;
}
