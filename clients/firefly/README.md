# Firefly API Client - Modular Structure

This directory contains the modular implementation of the Adobe Firefly API client.

## 📁 Structure

```
firefly/
├── index.ts                    # Main export point
├── firefly-client.ts          # FireflyClient class (orchestration)
├── operations/                # Operation implementations
│   ├── cancel-job.ts
│   ├── expand-image.ts
│   ├── fill-image.ts
│   ├── generate-images.ts
│   ├── generate-object-composite.ts
│   ├── generate-similar.ts
│   ├── generate-video.ts
│   ├── get-job-status.ts
│   └── upload-image.ts
└── types/                     # Type definitions (.d.ts)
    ├── common.d.ts
    ├── expand-image.d.ts
    ├── fill-image.d.ts
    ├── generate-images.d.ts
    ├── generate-object-composite.d.ts
    ├── generate-similar.d.ts
    ├── generate-video.d.ts
    └── upload-image.d.ts
```

## 🎯 Design Principles

### 1. **Separation of Concerns**

- **Types**: All request/response types are in separate `.d.ts` files
- **Operations**: Each API operation is in its own file
- **Client**: The main `FireflyClient` class only orchestrates, doesn't implement

### 2. **Type Safety**

- All types are properly typed with TypeScript
- Type definitions are colocated with their operations
- Import only what you need

### 3. **Maintainability**

- Easy to find and update specific operations
- Small, focused files (25-90 lines each)
- Clear naming conventions

## 📝 Usage

### Basic Import

```typescript
import { FireflyClient } from "./clients/firefly";
```

### Import Specific Types

```typescript
import type {
  FireflyClient,
  GenerateImagesV3AsyncRequest,
  ModelVersion,
} from "./clients/firefly";
```

### Using the Client

```typescript
const fireflyClient = new FireflyClient({
  imsClient: myImsClient,
  baseUrl: "https://firefly-api.adobe.io", // optional
});

// Generate images
const response = await fireflyClient.generateImagesAsync(
  {
    prompt: "A sunset over mountains",
  },
  "image4_ultra",
);

// Get job status
const status = await fireflyClient.getJobStatus(response.jobID);
```

## 🔧 Adding New Operations

To add a new operation:

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
     // Implementation
   }
   ```

3. **Add to client**: `firefly-client.ts`

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

## 🧪 Testing

Each operation can be tested independently:

```typescript
import * as generateImagesOp from "./operations/generate-images";
import { mockIMSClient } from "./test-utils";

const result = await generateImagesOp.generateImagesAsync(
  mockIMSClient,
  "https://test.adobe.io",
  { prompt: "test" },
);
```

## 📚 Related Files

- `../ffs-gen-image-job.d.ts` - Job status types (shared across operations)
- `../ims-client.ts` - IMS authentication client
- `../substance-client.ts` - Substance 3D API client (similar structure)

## 🔗 API References

- [Image Generation v3](../../.cursor/schema/image_generation_async_v3.json)
- [Expand Image v3](../../.cursor/schema/generative_expand_async_v3.json)
- [Fill Image v3](../../.cursor/schema/generative_fill_async_v3.json)
- [Generate Similar v3](../../.cursor/schema/generate_similar_async_v3.json)
- [Object Composite v3](../../.cursor/schema/generate_object_composite_async_v3.json)
- [Video Generation](../../.cursor/schema/generate_video_api.json)
- [Adobe Firefly API Docs](../../.cursor/rules/adobe-firefly-api.md)
