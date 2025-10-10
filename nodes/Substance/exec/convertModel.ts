import {
  IExecuteFunctions,
  IDataObject,
  LoggerProxy as Logger,
} from "n8n-workflow";
import {
  SubstanceClient,
  type ModelConvertRequest,
  type MountedSource,
} from "../../../clients/substance";

export async function executeConvertModel(
  this: IExecuteFunctions,
  i: number,
  substanceClient: SubstanceClient,
): Promise<IDataObject> {
  const sources = this.getNodeParameter("sources", i) as string;
  const format = this.getNodeParameter("format", i) as
    | "glb"
    | "gltf"
    | "fbx"
    | "usdz"
    | "usda"
    | "usdc"
    | "obj";

  // Parse sources JSON
  let parsedSources: MountedSource[];
  try {
    parsedSources = JSON.parse(sources);
  } catch {
    throw new Error(
      "Invalid sources JSON. Expected array of MountedSource objects.",
    );
  }

  // Build the request
  const requestBody: ModelConvertRequest = {
    sources: parsedSources,
    format,
  };

  // Optional model entrypoint parameter
  const modelEntrypoint = this.getNodeParameter(
    "modelEntrypoint",
    i,
    undefined,
  ) as string | undefined;
  if (modelEntrypoint) {
    requestBody.modelEntrypoint = modelEntrypoint;
  }

  Logger.info("Substance: Converting model", {
    format,
    sources: parsedSources.length,
  });

  const response = await substanceClient.convertModel(requestBody);

  Logger.info("Substance: Model conversion started", { jobId: response.id });

  return response as unknown as IDataObject;
}
