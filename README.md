# n8n-nodes-adobe-firefly

This is an n8n community node. It lets you use Adobe Firefly Services, Photoshop API, and Audio/Video API in your n8n workflows.

> Code is mostly Cursor generated with highly technical guidance, so be kind.

Adobe Firefly is a generative AI service that allows you to create stunning images, videos, speech, and avatars from text prompts. The Photoshop API provides professional-grade image editing capabilities including AI-powered background removal, masking, and generative fill.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Development](#development)  
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Manual installation on your existing n8n instance

To get started, install the package in your n8n root directory:

```bash
npm install n8n-nodes-adobe-firefly
```

For Docker-based deployments, add the package in your [data folder's](https://docs.n8n.io/hosting/environment-variables/deployment/#data-locations) `package.json` file with any other dependencies.

## Operations

### Firefly Services

#### Image Generation

- **Generate Images Async**: Create images from text prompts using Adobe Firefly's generative AI
- **Generate Similar Images (Async)**: Generate variations based on a reference image
- **Generate Object Composite (Async)**: Combine images with AI-generated content
- **Expand Image (Async)**: Expand images beyond their original boundaries
- **Fill Image (Async)**: Fill masked areas of an image with AI-generated content
- **Upload Image**: Upload images to Adobe's storage for use in other operations

#### Video Generation

- **Generate Video (Async)**: Create AI-generated videos from text prompts with customizable camera motion and shot angles

#### Job Management

- **Get Job Status**: Check the status of any asynchronous job (image/video generation). Optional "Wait for Completion" mode automatically polls until the job finishes.
- **Cancel Job**: Cancel a pending or running asynchronous job

### Photoshop API 🎨

#### Background & Masking

- **Remove Background**: AI-powered background removal from images with soft or binary mask output
- **Mask Objects**: Create masks for specific objects (person, dog, cat, product, vehicle, etc.)
- **Mask Body Parts**: Create masks for human body parts (face, hair, hands, legs, etc.)
- **Refine Mask**: Adjust masks with feather, smoothness, contrast, edge shifting, and color decontamination
- **Fill Masked Areas**: Fill masked regions with generative AI or content-aware fill

#### PSD Operations

- **Create Rendition**: Export PSD layers to various formats (PNG, JPEG, TIFF) with custom dimensions
- **Edit Text Layer**: Modify text content, font, size, color, and alignment in PSD files
- **Replace Smart Object**: Dynamically replace smart object content in PSD templates

#### Effects

- **Auto Crop**: Automatically crop images to content boundaries
- **Depth Blur**: Apply depth-of-field blur with customizable focal point and blur strength

#### Job Management

- **Get Job Status**: Check the status of Photoshop API jobs (supports PSD operations, masking v1, and masking v2)
- **Wait for Job**: Automatically poll until job completion with configurable timeout and polling interval

### Firefly Audio/Video

#### Text-to-Speech 🎤

- **Get Voices**: List all available voices for TTS and avatar generation
- **Generate Speech**: Convert text to speech with support for 19 languages

#### Avatar Generation 🎭

- **Get Avatars**: List all available avatars with details (style, age group, clothing)
- **Generate Avatar Video**: Create avatar videos from text or audio with customizable backgrounds (color, image, or video)

#### Video Operations 🎬

- **Reframe Video**: AI-powered video reframing for multiple aspect ratios (1:1, 9:16, 4:5, 16:9)

#### Transcription & Dubbing 📝🌐

- **Transcribe Media**: Transcribe audio or video to text with optional translation and SRT caption generation
- **Dub Audio or Video**: Dub media to different languages with optional lip-sync for videos

#### Job Management ⚙️

- **Get Job Status**: Check the status of audio/video jobs
- **Wait for Job**: Automatically poll until job completion with configurable timeout and polling interval

### Substance 3D

#### 3D Operations 🎨

- **Convert Model**: Convert 3D models between formats (GLB, glTF, FBX, OBJ, USDZ, USD)
- **Create Space**: Upload 3D files to Substance 3D storage
- **Describe Scene**: Extract metadata from 3D scenes (cameras, materials, statistics)
- **Generate 3D Object Composite**: Create 3D composites with AI-generated backgrounds

#### Job Management ⚙️

- **Get Job Status**: Check Substance 3D job status
- **Wait for Job**: Automatically poll until job completion

### Parse 3D File

- **Parse 3D File**: Extract metadata from glTF/GLB files (objects, cameras, meshes, materials, hierarchy)

## Credentials

To use these nodes, you need Adobe Firefly API credentials: `client id` and `client secret`.

1. Visit [Adobe Developer Console](https://developer.adobe.com/console)
2. Create a new project or select an existing one
3. Add the Firefly Services API
4. Generate OAuth credentials (Client ID and Client Secret)

In n8n, create new **Firefly Services API** credentials with:

- **Client ID**: Your OAuth client ID
- **Client Secret**: Your OAuth client secret
- **Scopes**: `openid,AdobeID,firefly_api,firefly_enterprise,ff_apis,read_organizations` (or customize as needed)

The nodes automatically handle IMS (Adobe Identity Management System) authentication and token refresh.

## AI Agent Workflows

This node is optimized for use with n8n's AI Agent workflows:

- **Prompt Validation**: Automatic validation ensures prompts stay within API limits (1-1024 characters)
- **Clear Error Messages**: Descriptive errors help agents understand and correct issues
- **Structured Outputs**: All operations return well-formed JSON suitable for agent parsing
- **Binary Data Handling**: Upload Image operation works seamlessly with chat message attachments

### Tips for Agent Workflows

1. **Image Upload**: When using with chat agents, ensure the previous node outputs binary data with a `Binary_Property` field
2. **Job Polling**: Enable "Wait for Completion" in Get Job Status to automatically wait for async jobs to finish (no loops needed!)
3. **Error Handling**: Enable "Continue on Fail" to allow agents to retry with corrected inputs
4. **Style Consistency**: Use seeds to generate consistent results across multiple agent calls
5. **Timeout Configuration**: Adjust the timeout for complex operations (video generation typically takes 2-5 minutes)

See the [sample-workflows](./sample-workflows) directory for pre-configured agent workflow examples.

## Compatibility

- Minimum n8n version: **1.0.0**
- Tested against: n8n v1.x

## Development

This project uses the [`n8n-node` CLI tool](https://docs.n8n.io/integrations/creating-nodes/build/n8n-node/) for development.

### Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/n8n-nodes-adobe-firefly.git
   cd n8n-nodes-adobe-firefly
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Available Commands

- **`npm run build`** - Compiles TypeScript and bundles project assets
- **`npm run dev`** - Runs a local n8n instance with your node loaded and auto-rebuilds on changes
- **`npm run lint`** - Checks code for linting issues
- **`npm run lint:fix`** - Automatically fixes linting issues where possible
- **`npm run release`** - Publishes the node to npm (requires `npm login`)

### Testing locally

To test the node in a local n8n instance:

```bash
npm run dev
```

This will:

1. Build your node
2. Start n8n at `http://localhost:5678`
3. Automatically reload when you make changes

Your node will appear in the nodes panel under "Firefly Services".

#### pre-built workflows

see: [sample-workflows](./sample-workflows)

### Project Structure

```
n8n-nodes-adobe-firefly/
├── .cursor/              # Cursor IDE rules and schemas
│   ├── rules/           # Development guidelines
│   └── schema/          # OpenAPI specifications
├── clients/             # API client libraries
│   ├── audio-video/     # Modular Audio/Video client (see clients/audio-video/README.md)
│   │   ├── operations/  # Individual operation implementations
│   │   ├── types/       # TypeScript type definitions
│   │   ├── audio-video-client.ts # Main orchestration class
│   │   ├── index.ts     # Public exports
│   │   └── README.md    # Client architecture documentation
│   ├── firefly/         # Modular Firefly client (see clients/firefly/README.md)
│   │   ├── operations/  # Individual operation implementations
│   │   ├── types/       # TypeScript type definitions
│   │   ├── firefly-client.ts  # Main orchestration class
│   │   ├── index.ts     # Public exports
│   │   └── README.md    # Client architecture documentation
│   ├── substance/       # Modular Substance 3D client (see clients/substance/README.md)
│   │   ├── operations/  # Individual operation implementations
│   │   ├── types/       # TypeScript type definitions
│   │   ├── substance-client.ts # Main orchestration class
│   │   ├── index.ts     # Public exports
│   │   └── README.md    # Client architecture documentation
│   └── ims-client.ts    # Adobe IMS authentication (shared)
├── credentials/         # Credential types
│   └── FireflyServicesApi.credentials.ts
├── nodes/              # Node implementations
│   ├── FireflyAudioVideo/    # Audio/Video node
│   │   ├── FireflyAudioVideo.node.ts  # Main node definition
│   │   ├── firefly-audio-video.svg    # Node icon
│   │   └── exec/                      # Operation handlers
│   │       ├── getVoices.ts
│   │       ├── getAvatars.ts
│   │       ├── generateSpeech.ts
│   │       ├── generateAvatar.ts
│   │       ├── reframeVideo.ts
│   │       ├── transcribe.ts
│   │       ├── dub.ts
│   │       ├── getJobStatus.ts
│   │       ├── waitForJob.ts
│   │       └── index.ts
│   ├── FireflyServices/      # Image/Video generation node
│   │   ├── FireflyServices.node.ts  # Main node definition
│   │   └── exec/                    # Operation handlers
│   │       ├── generateImagesAsync.ts
│   │       ├── expandImageAsync.ts
│   │       ├── fillImageAsync.ts
│   │       ├── generateSimilarImagesAsync.ts
│   │       ├── generateObjectCompositeAsync.ts
│   │       ├── generateVideoAsync.ts
│   │       ├── getJobStatus.ts
│   │       ├── cancelJob.ts
│   │       ├── uploadImage.ts
│   │       └── index.ts
│   ├── Parse3D/              # 3D file parser node
│   │   ├── Parse3D.node.ts
│   │   └── parse3d.svg
│   └── Substance/            # Substance 3D node
│       ├── Substance.node.ts
│       ├── substance.svg
│       └── exec/
│           ├── composeScene.ts
│           ├── convertModel.ts
│           ├── createSpace.ts
│           ├── describeScene.ts
│           ├── getJobStatus.ts
│           ├── waitForJob.ts
│           └── index.ts
├── sample-workflows/   # Pre-built workflow examples
├── package.json       # Package configuration
└── tsconfig.json     # TypeScript configuration
```

### Architecture

The package is built with a modular architecture:

- **Modular Client Layer**:
  - **Firefly API client**: Image and video generation (see [clients/firefly/README.md](./clients/firefly/README.md))
  - **Audio/Video API client**: TTS, avatars, transcription, dubbing (see [clients/audio-video/README.md](./clients/audio-video/README.md))
  - **Substance 3D API client**: 3D model processing (see [clients/substance/README.md](./clients/substance/README.md))
  - **IMS authentication client**: Shared OAuth token management for all Adobe APIs
- **Operation Handlers**: Each n8n operation is in its own file under `exec/` for better maintainability
- **Type Safety**: Full TypeScript types for all API requests and responses
- **Separation of Concerns**: Types, operations, and orchestration are clearly separated
- **Auto Authentication**: IMS client handles OAuth token management and refresh automatically

#### Client Architecture

All three API clients (Firefly, Audio/Video, Substance 3D) follow the same modular design pattern:

- **Types** (`.d.ts` files): Request/response type definitions organized by feature
- **Operations** (`.ts` files): Individual API operation implementations
- **Client Class**: Main orchestration that delegates to operations
- **Shared Authentication**: All clients use the same IMS authentication

For detailed information:

- **Firefly client**: See [clients/firefly/README.md](./clients/firefly/README.md)
- **Photoshop client**: See [clients/photoshop/README.md](./clients/photoshop/README.md)
- **Audio/Video client**: See [clients/audio-video/README.md](./clients/audio-video/README.md)
- **Substance 3D client**: See [clients/substance/README.md](./clients/substance/README.md)

#### Features by Node

| Node                    | Operations | Key Features                                          |
| ----------------------- | ---------- | ----------------------------------------------------- |
| **Firefly Services**    | 9          | Image/video generation, editing, job management       |
| **Photoshop API**       | 12         | Background removal, masking, PSD editing, effects     |
| **Firefly Audio/Video** | 9          | TTS, avatars, reframing, transcription, dubbing       |
| **Substance 3D**        | 6          | 3D model conversion, composition, metadata extraction |
| **Parse 3D**            | 1          | Local 3D file parsing (glTF/GLB)                      |

**Total: 5 nodes, 37 operations**

## Resources

### n8n Documentation

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [n8n-node CLI tool documentation](https://docs.n8n.io/integrations/creating-nodes/build/n8n-node/)

### Adobe API Documentation

- [Adobe Firefly Services API](https://developer.adobe.com/firefly-services/docs/)
- [Adobe Photoshop API](https://developer.adobe.com/photoshop/photoshop-api-docs/)
- [Adobe Firefly Audio/Video API](https://developer.adobe.com/audio-video-firefly-services/)
- [Adobe Substance 3D API](https://developer.adobe.com/substance3d-automation/)
- [Adobe IMS Authentication](https://developer.adobe.com/developer-console/docs/guides/authentication/)
- [Adobe Developer Console](https://developer.adobe.com/console)

## License

[MIT](LICENSE.md)
