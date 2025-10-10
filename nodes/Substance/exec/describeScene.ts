import {
  IExecuteFunctions,
  IDataObject,
  LoggerProxy as Logger,
} from "n8n-workflow";
import {
  SubstanceClient,
  type SceneDescribeRequest,
  type MountedSource,
} from "../../../clients/substance";

export async function executeDescribeScene(
  this: IExecuteFunctions,
  i: number,
  substanceClient: SubstanceClient,
): Promise<IDataObject> {
  const sources = this.getNodeParameter("sources", i) as string;

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
  const requestBody: SceneDescribeRequest = {
    sources: parsedSources,
  };

  // Optional scene file parameter
  const sceneFile = this.getNodeParameter("sceneFile", i, undefined) as
    | string
    | undefined;
  if (sceneFile) {
    requestBody.sceneFile = sceneFile;
  }

  Logger.info("Substance: Describing scene", { requestBody });

  const response = await substanceClient.describeScene(requestBody);

  Logger.info("Substance: Scene description started", { jobId: response.id });

  return response as unknown as IDataObject;
}
