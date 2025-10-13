# Adobe Photoshop API Client

Modular TypeScript client for the Adobe Photoshop API, providing comprehensive image manipulation, PSD operations, masking, and AI-powered effects.

## Features

- **Remove Background**: AI-powered background removal
- **Masking**: Create and refine masks for objects and body parts
- **PSD Operations**: Manipulate layers, smart objects, text, and artboards
- **Actions**: Execute Photoshop actions (.atn) or JSON actions
- **Effects**: Auto-crop and depth blur
- **Job Management**: Check status of async operations

## Architecture

This client follows a modular architecture with operations separated into individual files for maintainability:

```
clients/photoshop/
├── photoshop-client.ts       # Main client class
├── index.ts                  # Public exports
├── README.md                 # This file
├── operations/               # Individual operation implementations
│   ├── remove-background.ts
│   ├── create-mask.ts
│   ├── mask-objects.ts
│   ├── mask-body-parts.ts
│   ├── refine-mask.ts
│   ├── fill-masked-areas.ts
│   ├── document-manifest.ts
│   ├── document-create.ts
│   ├── document-operations.ts
│   ├── rendition-create.ts
│   ├── smart-object-replace.ts
│   ├── text-layer-edit.ts
│   ├── artboard-create.ts
│   ├── photoshop-actions.ts
│   ├── action-json.ts
│   ├── auto-crop.ts
│   ├── depth-blur.ts
│   └── get-job-status.ts
└── types/                    # TypeScript type definitions
    ├── common.d.ts
    ├── remove-background.d.ts
    ├── masking.d.ts
    ├── document.d.ts
    ├── actions.d.ts
    └── effects.d.ts
```

## Usage

### Initialize the Client

```typescript
import { IMSClient } from "../ims-client";
import { PhotoshopClient } from "./photoshop";

const imsClient = new IMSClient({
  clientId: "your-client-id",
  clientSecret: "your-client-secret",
  scope: "openid,AdobeID,firefly_api,ff_apis",
});

const photoshopClient = new PhotoshopClient({ imsClient });
```

### Remove Background

```typescript
const response = await photoshopClient.removeBackground({
  input: {
    href: "https://your-storage.com/input-image.jpg",
    storage: "external",
  },
  output: {
    href: "https://your-storage.com/output-image.png",
    storage: "external",
    type: "image/png",
    mask: {
      format: "soft", // or "binary"
    },
  },
  options: {
    optimize: "performance", // or "batch"
  },
});

// Check job status
const jobId = response._links.self.href.split("/").pop();
const status = await photoshopClient.getMaskingJobStatus(jobId);
```

### Create Object Masks

```typescript
const response = await photoshopClient.maskObjects({
  input: {
    href: "https://your-storage.com/input-image.jpg",
    storage: "external",
  },
  output: {
    href: "https://your-storage.com/mask.png",
    storage: "external",
    type: "image/png",
  },
  objectType: ["person", "dog", "cat"], // Mask multiple object types
});
```

### Create Body Part Masks

```typescript
const response = await photoshopClient.maskBodyParts({
  input: {
    href: "https://your-storage.com/person.jpg",
    storage: "external",
  },
  output: {
    href: "https://your-storage.com/body-mask.png",
    storage: "external",
    type: "image/png",
  },
  bodyParts: ["face", "hair", "torso"],
});
```

### Refine a Mask

```typescript
const response = await photoshopClient.refineMask({
  input: {
    source: {
      href: "https://your-storage.com/image.jpg",
      storage: "external",
    },
    mask: {
      href: "https://your-storage.com/initial-mask.png",
      storage: "external",
    },
  },
  output: {
    href: "https://your-storage.com/refined-mask.png",
    storage: "external",
    type: "image/png",
  },
  options: {
    feather: 5, // 0-250
    smoothness: 50, // 0-100
    contrast: 10, // -100 to 100
    shiftEdge: -5, // -100 to 100
    decontaminate: true,
    decontaminationAmount: 80, // 0-100
  },
});
```

### Fill Masked Areas with Generative Fill

```typescript
const response = await photoshopClient.fillMaskedAreas({
  input: {
    source: {
      href: "https://your-storage.com/image.jpg",
      storage: "external",
    },
    mask: {
      href: "https://your-storage.com/mask.png",
      storage: "external",
    },
  },
  output: {
    href: "https://your-storage.com/filled.jpg",
    storage: "external",
    type: "image/jpeg",
  },
  options: {
    fillMethod: "generativeFill", // or "contentAware"
    prompt: "a beautiful sunset", // For generativeFill only
  },
});
```

### Get Document Manifest

```typescript
const response = await photoshopClient.getDocumentManifest({
  inputs: [
    {
      href: "https://your-storage.com/document.psd",
      storage: "external",
    },
  ],
  options: {
    thumbnails: {
      width: 400,
      height: 400,
    },
  },
});

// Response includes layer structure, metadata, and thumbnails
```

### Create a New PSD Document

```typescript
const response = await photoshopClient.createDocument({
  options: {
    document: {
      width: 1920,
      height: 1080,
      resolution: 300, // DPI
      fill: "transparent", // or "white", "backgroundColor"
      mode: "rgb", // or "cmyk", "lab", "greyscale"
    },
  },
  outputs: [
    {
      href: "https://your-storage.com/new-document.psd",
      storage: "external",
      type: "image/vnd.adobe.photoshop",
    },
  ],
});
```

### Create Renditions (Export Layers)

```typescript
const response = await photoshopClient.createRendition({
  inputs: [
    {
      href: "https://your-storage.com/document.psd",
      storage: "external",
    },
  ],
  outputs: [
    {
      href: "https://your-storage.com/export.png",
      storage: "external",
      type: "image/png",
      width: 800,
      height: 600,
      quality: 9, // 1-12 for PNG
      trimToCanvas: true,
      layers: [{ name: "Layer 1" }, { id: 42 }],
    },
    {
      href: "https://your-storage.com/export.jpg",
      storage: "external",
      type: "image/jpeg",
      quality: 7, // 1-7 for JPEG
      compression: "high", // "low", "medium", "high", "veryhigh"
    },
  ],
});
```

### Replace Smart Objects

```typescript
const response = await photoshopClient.replaceSmartObject({
  inputs: [
    {
      href: "https://your-storage.com/template.psd",
      storage: "external",
    },
  ],
  options: {
    layers: [
      {
        name: "Logo Smart Object",
        input: {
          href: "https://your-storage.com/new-logo.png",
          storage: "external",
        },
      },
      {
        id: 42,
        input: {
          href: "https://your-storage.com/new-image.jpg",
          storage: "external",
        },
      },
    ],
  },
  outputs: [
    {
      href: "https://your-storage.com/updated-template.psd",
      storage: "external",
      type: "image/vnd.adobe.photoshop",
    },
  ],
});
```

### Edit Text Layers

```typescript
const response = await photoshopClient.editTextLayer({
  inputs: [
    {
      href: "https://your-storage.com/template.psd",
      storage: "external",
    },
  ],
  options: {
    fonts: [
      {
        href: "https://your-storage.com/custom-font.otf",
        storage: "external",
      },
    ],
    layers: [
      {
        name: "Title",
        text: {
          content: "New Title Text",
          characterStyles: [
            {
              fontSize: 72,
              fontName: "Arial-BoldMT",
              fontColor: {
                rgb: {
                  red: 255,
                  green: 0,
                  blue: 0,
                },
              },
            },
          ],
          paragraphStyles: [
            {
              alignment: "center", // "left", "right", "justify"
            },
          ],
        },
      },
    ],
  },
  outputs: [
    {
      href: "https://your-storage.com/updated-text.psd",
      storage: "external",
      type: "image/vnd.adobe.photoshop",
    },
  ],
});
```

### Apply Auto Crop

```typescript
const response = await photoshopClient.autoCrop({
  inputs: [
    {
      href: "https://your-storage.com/product.jpg",
      storage: "external",
    },
  ],
  outputs: [
    {
      href: "https://your-storage.com/cropped-product.jpg",
      storage: "external",
      type: "image/jpeg",
    },
  ],
});
```

### Apply Depth Blur

```typescript
const response = await photoshopClient.applyDepthBlur({
  inputs: [
    {
      href: "https://your-storage.com/portrait.jpg",
      storage: "external",
    },
  ],
  options: {
    focalSelector: {
      x: 0.5, // 0-1, relative position (center)
      y: 0.3, // 0-1, relative position (upper third)
    },
    blurStrength: 75, // 1-100
  },
  outputs: [
    {
      href: "https://your-storage.com/blurred-portrait.jpg",
      storage: "external",
      type: "image/jpeg",
    },
  ],
});
```

### Play Photoshop Actions

```typescript
const response = await photoshopClient.playPhotoshopActions({
  inputs: [
    {
      href: "https://your-storage.com/image.jpg",
      storage: "external",
    },
  ],
  options: {
    actions: [
      {
        href: "https://your-storage.com/my-action.atn",
        storage: "external",
      },
    ],
  },
  outputs: [
    {
      href: "https://your-storage.com/processed.jpg",
      storage: "external",
      type: "image/jpeg",
    },
  ],
});
```

### Convert Action to JSON

```typescript
const response = await photoshopClient.convertToActionJson({
  inputs: [
    {
      href: "https://your-storage.com/my-action.atn",
      storage: "external",
    },
  ],
});

// Check job status to get the JSON action
const jobId = response._links.self.href.split("/").pop();
const status = await photoshopClient.getJobStatus(jobId);
```

### Check Job Status

```typescript
// For PSD operations
const status = await photoshopClient.getJobStatus(jobId);

// For masking/background removal (v2)
const status = await photoshopClient.getMaskingJobStatus(jobId);

// For masking (v1)
const status = await photoshopClient.getMaskingJobStatusV1(jobId);

if (status.status === "succeeded") {
  console.log("Job completed successfully!");
  console.log("Outputs:", status.outputs);
} else if (status.status === "failed") {
  console.error("Job failed:", status.errors);
}
```

## Storage Options

The Photoshop API supports multiple storage backends:

- `"adobe"`: Adobe's cloud storage
- `"azure"`: Microsoft Azure Blob Storage
- `"dropbox"`: Dropbox
- `"external"`: Any publicly accessible URL
- `"lightroom"`: Adobe Lightroom

## Supported Object Types (Masking)

- `person`, `dog`, `cat`, `bird`
- `product`, `accessory`, `vehicle`, `furniture`
- `plant`, `food`, `building`
- `sky`, `ground`

## Supported Body Parts (Masking)

- `head`, `torso`, `neck`, `face`, `hair`
- `left_arm`, `right_arm`, `left_hand`, `right_hand`
- `left_leg`, `right_leg`, `left_foot`, `right_foot`

## Type Safety

All operations are fully typed with TypeScript interfaces. Import types as needed:

```typescript
import type {
  RemoveBackgroundRequest,
  MaskObjectsRequest,
  DocumentCreateRequest,
  JobStatusResponse,
} from "./photoshop";
```

## Error Handling

All API calls throw errors with descriptive messages on failure:

```typescript
try {
  const response = await photoshopClient.removeBackground(request);
} catch (error) {
  console.error("Photoshop API error:", error.message);
  // Example: "Photoshop API - Remove Background failed: 400 Bad Request - Invalid input URL"
}
```

## Resources

- [Adobe Photoshop API Documentation](https://developer.adobe.com/photoshop/photoshop-api-docs/)
- [API Reference](https://developer.adobe.com/photoshop/photoshop-api-docs/api/)
- [Storage Guide](https://developer.adobe.com/photoshop/photoshop-api-docs/features/#storage)

