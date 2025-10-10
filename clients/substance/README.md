# Substance 3D Client

Modular TypeScript client for Adobe Substance 3D API.

## Architecture

This client follows a modular architecture with clear separation of concerns:

### 1. **Separation of Concerns**

- **Types**: All request/response types are in separate `.d.ts` files
- **Operations**: Each API operation is in its own file
- **Client**: The main `SubstanceClient` class only orchestrates, doesn't implement

### 2. **Type Safety**

- All types are properly typed with TypeScript
- Type definitions are colocated with their operations
- Import only what you need

### 3. **Maintainability**

- Easy to find and update specific operations
- Small, focused files (25-40 lines each)
- Clear dependencies

## Directory Structure

```
substance/
├── README.md                       # This file
├── index.ts                        # Public exports
├── substance-client.ts             # Main orchestration class
├── operations/                     # Individual operation implementations
│   ├── compose-scene.ts           # 3D Object Composite
│   ├── assemble-scene.ts          # Scene assembly
│   ├── convert-model.ts           # Model conversion
│   ├── describe-scene.ts          # Scene description
│   ├── render-scene.ts            # Scene rendering (full)
│   ├── render-model.ts            # Model rendering (basic)
│   ├── get-job-status.ts          # Job status polling
│   └── create-space.ts            # Space creation (file upload)
└── types/                          # TypeScript type definitions
    ├── common.d.ts                # Shared types
    ├── compose-scene.d.ts         # Compose scene types
    ├── assemble-scene.d.ts        # Assemble scene types
    ├── convert-model.d.ts         # Convert model types
    ├── describe-scene.d.ts        # Describe scene types
    ├── render-scene.d.ts          # Render scene types
    └── render-model.d.ts          # Render model types
```

## API Operations

### Image Generation & Compositing

- **composeScene**: Generate 3D object composite with AI-generated background
- **assembleScene**: Create/assemble 3D scenes from multiple files
- **convertModel**: Convert 3D models between formats (glb, gltf, fbx, usdz, usda, usdc, obj)

### Scene Analysis & Rendering

- **describeScene**: Get statistics and metadata about a 3D scene
- **renderScene**: Render 3D scene with advanced options
- **renderModel**: Render 3D model (simplified API)

### Utilities

- **getJobStatus**: Poll async job status
- **createSpace**: Upload 3D files to Adobe's storage

## Usage

### Basic Import

```typescript
import { SubstanceClient } from "./clients/substance";
```

### Import Specific Types

```typescript
import type {
  SubstanceClient,
  ComposeSceneRequest,
  RenderModelRequest,
} from "./clients/substance";
```

### Using the Client

```typescript
const substanceClient = new SubstanceClient({
  imsClient: myImsClient,
  baseUrl: "https://s3d.adobe.io", // optional
});

// Compose a 3D scene
const response = await substanceClient.composeScene({
  sources: [{ space: { id: "my-space-id" } }],
  prompt: "A product on a marble table",
  heroAsset: "model.glb",
});

// Get job status
const status = await substanceClient.getJobStatus(response.id);

// Upload 3D file
const space = await substanceClient.createSpace(
  fileBuffer,
  "model.glb",
  "My Model",
);
```

## Adding a New Operation

1. **Create type definition**: `types/my-operation.d.ts`

   ```typescript
   export type MyOperationRequest = {
     // ... request fields
   };

   export type MyOperationResponse = {
     // ... response fields
   };
   ```

2. **Create operation**: `operations/my-operation.ts`

   ```typescript
   import type { IMSClient } from "../../ims-client";
   import type {
     MyOperationRequest,
     MyOperationResponse,
   } from "../types/my-operation";

   export async function myOperation(
     imsClient: IMSClient,
     baseUrl: string,
     requestBody: MyOperationRequest,
   ): Promise<MyOperationResponse> {
     // ... implementation
   }
   ```

3. **Add to client**: `substance-client.ts`

   ```typescript
   import * as myOperationOp from "./operations/my-operation";

   async myOperation(requestBody: MyOperationRequest): Promise<MyOperationResponse> {
     return myOperationOp.myOperation(this.imsClient, this.baseUrl, requestBody);
   }
   ```

4. **Export types**: `index.ts`

   ```typescript
   export type {
     MyOperationRequest,
     MyOperationResponse,
   } from "./types/my-operation";
   ```

## Testing

You can test individual operations without instantiating the full client:

```typescript
import * as composeSceneOp from "./operations/compose-scene";
import { mockIMSClient } from "./test-utils";

const result = await composeSceneOp.composeScene(
  mockIMSClient,
  "https://test.adobe.io",
  { prompt: "test", heroAsset: "model.glb", sources: [] },
);
```

## Authentication

All operations use Adobe IMS authentication via the `IMSClient`:

- Access tokens are automatically fetched and cached
- Token refresh is handled transparently
- Both `x-api-key` and `Authorization: Bearer` headers are set automatically

## References

- OpenAPI Spec: `.cursor/schema/adobe-substance-openapi.yaml`
- Adobe Substance 3D API: https://developer.adobe.com/substance-3d-automation/
