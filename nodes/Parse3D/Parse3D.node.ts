import type {
  IExecuteFunctions,
  INodeType,
  INodeTypeDescription,
  IDataObject,
} from "n8n-workflow";
import { NodeConnectionTypes, ApplicationError } from "n8n-workflow";
import { NodeIO } from "@gltf-transform/core";

export class Parse3D implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Parse 3D File",
    name: "parse3D",
    icon: "file:parse3d.svg",
    group: ["transform"],
    version: 1,
    subtitle: "Extract metadata from 3D files",
    description:
      "Parse 3D files (glTF/GLB) and extract object and camera names",
    defaults: {
      name: "Parse 3D File",
    },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    properties: [
      {
        displayName: "Binary Property",
        name: "binaryProperty",
        type: "string",
        default: "data",
        description:
          "Name of the binary property containing the 3D file. Can also be provided in JSON as Binary_Property.",
      },
      {
        displayName: "Options",
        name: "options",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        options: [
          {
            displayName: "Include Node Hierarchy",
            name: "includeHierarchy",
            type: "boolean",
            default: false,
            description:
              "Whether to include the full node hierarchy structure in the output",
          },
          {
            displayName: "Include Statistics",
            name: "includeStatistics",
            type: "boolean",
            default: true,
            description:
              "Whether to include statistics (vertex count, triangle count, etc.)",
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<{ json: IDataObject }[][]> {
    const items = this.getInputData();
    const returnData: IDataObject[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const item = items[i];

        // Get binary property name from JSON field or use default
        const binaryProperty =
          (item.json?.Binary_Property as string) ||
          (this.getNodeParameter("binaryProperty", i, "data") as string) ||
          "data";

        // Get binary data
        const binaryData = this.helpers.assertBinaryData(i, binaryProperty);
        const binaryDataBuffer = await this.helpers.getBinaryDataBuffer(
          i,
          binaryProperty,
        );

        // Get options
        const options = this.getNodeParameter("options", i, {}) as IDataObject;
        const includeHierarchy = options.includeHierarchy as boolean;
        const includeStatistics = (
          options.includeStatistics !== undefined
            ? options.includeStatistics
            : true
        ) as boolean;

        // Parse the 3D file using gltf-transform
        const io = new NodeIO();
        let document;

        try {
          document = await io.readBinary(new Uint8Array(binaryDataBuffer));
        } catch (error) {
          throw new ApplicationError(
            `Failed to parse 3D file: ${(error as Error).message}`,
            { level: "warning" },
          );
        }

        // Extract root nodes (scenes)
        const root = document.getRoot();
        const scenes = root.listScenes();

        // Extract all nodes (objects)
        const allNodes = root.listNodes();
        const nodeNames: string[] = [];
        const nodeHierarchy: IDataObject[] = [];

        allNodes.forEach((node) => {
          const nodeName = node.getName() || "(unnamed)";
          nodeNames.push(nodeName);

          if (includeHierarchy) {
            const children = node
              .listChildren()
              .map((child) => child.getName() || "(unnamed)");
            nodeHierarchy.push({
              name: nodeName,
              children: children.length > 0 ? children : null,
              mesh: node.getMesh()
                ? node.getMesh()!.getName() || "(unnamed)"
                : null,
              camera: node.getCamera()
                ? node.getCamera()!.getName() || "(unnamed)"
                : null,
            });
          }
        });

        // Extract all cameras
        const allCameras = root.listCameras();
        const cameraNames: string[] = [];
        const cameraDetails: IDataObject[] = [];

        allCameras.forEach((camera) => {
          const cameraName = camera.getName() || "(unnamed)";
          cameraNames.push(cameraName);

          cameraDetails.push({
            name: cameraName,
            type: camera.getType(), // 'perspective' or 'orthographic'
          });
        });

        // Extract meshes
        const allMeshes = root.listMeshes();
        const meshNames = allMeshes.map(
          (mesh) => mesh.getName() || "(unnamed)",
        );

        // Extract materials
        const allMaterials = root.listMaterials();
        const materialNames = allMaterials.map(
          (material) => material.getName() || "(unnamed)",
        );

        // Build response
        const responseData: IDataObject = {
          fileName: binaryData.fileName || "(unknown)",
          fileSize: binaryDataBuffer.length,
          nodes: {
            count: allNodes.length,
            names: nodeNames,
          },
          cameras: {
            count: allCameras.length,
            names: cameraNames,
            details: cameraDetails,
          },
          meshes: {
            count: allMeshes.length,
            names: meshNames,
          },
          materials: {
            count: allMaterials.length,
            names: materialNames,
          },
          scenes: {
            count: scenes.length,
            names: scenes.map((scene) => scene.getName() || "(unnamed)"),
          },
        };

        // Add hierarchy if requested
        if (includeHierarchy) {
          responseData.hierarchy = nodeHierarchy;
        }

        // Add statistics if requested
        if (includeStatistics) {
          let totalVertices = 0;
          let totalTriangles = 0;

          allMeshes.forEach((mesh) => {
            mesh.listPrimitives().forEach((primitive) => {
              const position = primitive.getAttribute("POSITION");
              if (position) {
                totalVertices += position.getCount();
              }

              const indices = primitive.getIndices();
              if (indices) {
                totalTriangles += Math.floor(indices.getCount() / 3);
              }
            });
          });

          responseData.statistics = {
            totalVertices,
            totalTriangles,
            totalMeshes: allMeshes.length,
            totalMaterials: allMaterials.length,
            totalTextures: root.listTextures().length,
          };
        }

        returnData.push(responseData);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: (error as Error).message,
            },
          });
          continue;
        }
        throw error;
      }
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}
