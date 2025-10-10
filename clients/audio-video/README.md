# Adobe Firefly Audio/Video API Client

A modular TypeScript client for interacting with the Adobe Firefly Audio/Video API.

## Features

### 🎤 Text-to-Speech

- Get available voices
- Generate speech from text or URL
- Support for 19 languages
- Customizable voice selection

### 🎭 Avatar Generation

- Get available avatars
- Generate avatar videos from text or audio
- Customizable backgrounds (color, image, video)
- Configurable resolution
- Lip-sync capabilities

### 🎬 Video Operations

- AI-powered video reframing
- Multiple aspect ratio support (1:1, 9:16, 4:5, etc.)
- Overlay support (images, GIFs)
- Scene edit detection

### 📝 Transcription

- Transcribe audio or video files
- Support for multiple languages
- Auto-translation capabilities
- Caption generation (SRT format)

### 🌐 Dubbing

- Dub audio or video to different languages
- Lip-sync for video dubbing
- Transcript editing support
- High-quality voice synthesis

### ⚙️ Job Management

- Asynchronous job processing
- Real-time status tracking
- Job result retrieval

## Architecture

The client follows a modular architecture for maintainability and testability:

```
audio-video/
├── audio-video-client.ts    # Main client class
├── index.ts                  # Public exports
├── README.md                 # Documentation
├── types/                    # Type definitions
│   ├── common.d.ts           # Shared types
│   ├── text-to-speech.d.ts   # TTS types
│   ├── avatar.d.ts           # Avatar types
│   ├── reframe.d.ts          # Video reframe types
│   ├── transcribe.d.ts       # Transcription types
│   └── dub.d.ts              # Dubbing types
└── operations/               # API operations
    ├── get-voices.ts
    ├── get-avatars.ts
    ├── generate-speech.ts
    ├── generate-avatar.ts
    ├── reframe-video.ts
    ├── transcribe.ts
    ├── dub.ts
    └── get-job-status.ts
```

## Usage

### Initialization

```typescript
import { IMSClient } from "../ims-client";
import { AudioVideoClient } from "./audio-video";

const imsClient = new IMSClient({
  clientId: "your-client-id",
  clientSecret: "your-client-secret",
  scope: "firefly_api,ff_apis",
});

const audioVideoClient = new AudioVideoClient({ imsClient });
```

### Text-to-Speech

```typescript
// Get available voices
const voices = await audioVideoClient.getVoices();

// Generate speech from text
const job = await audioVideoClient.generateSpeech({
  script: {
    text: "Hello, this is a test.",
    mediaType: "text/plain",
    localeCode: "en-US",
  },
  voiceId: "v123",
  output: {
    mediaType: "audio/wav",
  },
});

// Check job status
const status = await audioVideoClient.getJobStatus(job.jobId);
```

### Avatar Generation

```typescript
// Get available avatars
const avatars = await audioVideoClient.getAvatars();

// Generate avatar with text
const job = await audioVideoClient.generateAvatar({
  script: {
    text: "Welcome to our presentation!",
    mediaType: "text/plain",
    localeCode: "en-US",
  },
  voiceId: "v321",
  avatarId: "a123",
  output: {
    mediaType: "video/mp4",
    background: {
      type: "color",
      color: "#0066CC",
    },
  },
});
```

### Video Reframing

```typescript
// Reframe video for multiple aspect ratios
const job = await audioVideoClient.reframeVideo({
  video: {
    source: {
      url: "https://presigned-url.com/video.mp4",
    },
    mediaType: "video/mp4",
  },
  sceneEditDetection: true,
  outputConfig: {
    aspectRatios: ["1:1", "9:16", "4:5"],
  },
});
```

### Transcription

```typescript
// Transcribe video to multiple languages
const job = await audioVideoClient.transcribe({
  video: {
    source: {
      url: "https://presigned-url.com/video.mp4",
    },
    mediaType: "video/mp4",
  },
  targetLocaleCodes: ["en-US", "es-ES"],
  captions: {
    targetFormats: ["SRT"],
  },
});
```

### Dubbing

```typescript
// Dub video with lip-sync
const job = await audioVideoClient.dub({
  video: {
    source: {
      url: "https://presigned-url.com/video.mp4",
    },
    mediaType: "video/mp4",
  },
  targetLocaleCodes: ["fr-FR", "de-DE"],
  lipSync: true,
});
```

## Supported Languages

- English (US, GB, IN)
- Spanish (ES, 419, AR)
- German (DE)
- French (FR, CA)
- Danish (DK)
- Hindi (IN)
- Italian (IT)
- Japanese (JP)
- Korean (KR)
- Norwegian (NO)
- Portuguese (BR, PT)
- Dutch (NL)
- Chinese (CN)
- Swedish (SE)

## Authentication

The client uses Adobe IMS (Identity Management System) for authentication via OAuth 2.0 Client Credentials flow. The `IMSClient` handles:

- Automatic access token fetching
- Token caching with expiration handling
- Header construction (`Authorization: Bearer <token>` + `x-api-key`)

## API Reference

### AudioVideoClient

#### Text-to-Speech

- `getVoices()`: Get list of available voices
- `generateSpeech(request)`: Generate speech from text

#### Avatar

- `getAvatars()`: Get list of available avatars
- `generateAvatar(request)`: Generate avatar video

#### Video

- `reframeVideo(request)`: Reframe video for different aspect ratios

#### Transcription & Dubbing

- `transcribe(request)`: Transcribe audio/video to text
- `dub(request)`: Dub audio/video to another language

#### Job Management

- `getJobStatus(jobId)`: Get status of an asynchronous job

## Error Handling

All methods throw errors with descriptive messages when API calls fail:

```typescript
try {
  const job = await audioVideoClient.generateSpeech(request);
} catch (error) {
  console.error("Speech generation failed:", error.message);
}
```

## Type Safety

The client is fully typed with TypeScript, providing:

- Request validation
- Response type inference
- IDE autocomplete support
- Compile-time error checking

## Related

- [Adobe Firefly Audio/Video API Documentation](https://developer.adobe.com/audio-video-firefly-services/)
- [Firefly Client](../firefly/README.md)
- [Substance 3D Client](../substance/README.md)
