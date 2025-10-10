import type {
  IExecuteFunctions,
  INodeType,
  INodeTypeDescription,
  IDataObject,
} from "n8n-workflow";
import { NodeConnectionTypes, ApplicationError } from "n8n-workflow";

import { IMSClient } from "../../clients/ims-client";
import { AudioVideoClient } from "../../clients/audio-video";
import {
  executeGetVoices,
  executeGetAvatars,
  executeGenerateSpeech,
  executeGenerateAvatar,
  executeReframeVideo,
  executeTranscribe,
  executeDub,
  executeGetJobStatus,
  executeWaitForJob,
} from "./exec";

export class FireflyAudioVideo implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Firefly Audio/Video",
    name: "fireflyAudioVideo",
    icon: "file:firefly-audio-video.svg",
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description:
      "Generate speech, avatars, reframe videos, transcribe, and dub with Adobe Firefly Audio/Video",
    defaults: {
      name: "Firefly Audio/Video",
    },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [
      {
        name: "fireflyServicesApi",
        required: true,
      },
    ],
    properties: [
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        options: [
          {
            name: "Dub Audio or Video",
            value: "dub",
            description: "Dub audio or video to another language",
            action: "Dub audio or video",
          },
          {
            name: "Generate Avatar Video",
            value: "generateAvatar",
            description: "Generate avatar video from text or audio",
            action: "Generate avatar video",
          },
          {
            name: "Generate Speech",
            value: "generateSpeech",
            description: "Generate speech from text (text-to-speech)",
            action: "Generate speech from text",
          },
          {
            name: "Get Avatars",
            value: "getAvatars",
            description: "Get list of available avatars",
            action: "Get available avatars",
          },
          {
            name: "Get Job Status",
            value: "getJobStatus",
            description: "Get the status of an Audio/Video job",
            action: "Get job status",
          },
          {
            name: "Get Voices",
            value: "getVoices",
            description: "Get list of available voices for TTS and avatars",
            action: "Get available voices",
          },
          {
            name: "Reframe Video",
            value: "reframeVideo",
            description: "Reframe video for different aspect ratios using AI",
            action: "Reframe video",
          },
          {
            name: "Transcribe Media",
            value: "transcribe",
            description: "Transcribe audio or video to text",
            action: "Transcribe media",
          },
          {
            name: "Wait for Job",
            value: "waitForJob",
            description:
              "Wait for an Audio/Video job to complete (with automatic polling)",
            action: "Wait for job completion",
          },
        ],
        default: "generateSpeech",
      },

      // ============================================
      // Generate Speech
      // ============================================
      {
        displayName: "Script Input",
        name: "scriptInput",
        type: "string",
        typeOptions: {
          rows: 5,
        },
        required: true,
        displayOptions: {
          show: {
            operation: ["generateSpeech"],
          },
        },
        default: "",
        placeholder: "Enter text or a pre-signed URL to text file",
        description:
          "The text to convert to speech, or a pre-signed URL pointing to a text file",
      },
      {
        displayName: "Locale Code",
        name: "localeCode",
        type: "options",
        required: true,
        displayOptions: {
          show: {
            operation: ["generateSpeech"],
          },
        },
        options: [
          { name: "Chinese (CN)", value: "zh-CN" },
          { name: "Danish (DK)", value: "da-DK" },
          { name: "Dutch (NL)", value: "nl-NL" },
          { name: "English (GB)", value: "en-GB" },
          { name: "English (IN)", value: "en-IN" },
          { name: "English (US)", value: "en-US" },
          { name: "French (CA)", value: "fr-CA" },
          { name: "French (FR)", value: "fr-FR" },
          { name: "German (DE)", value: "de-DE" },
          { name: "Hindi (IN)", value: "hi-IN" },
          { name: "Italian (IT)", value: "it-IT" },
          { name: "Japanese (JP)", value: "ja-JP" },
          { name: "Korean (KR)", value: "ko-KR" },
          { name: "Norwegian (NO)", value: "nb-NO" },
          { name: "Portuguese (BR)", value: "pt-BR" },
          { name: "Portuguese (PT)", value: "pt-PT" },
          { name: "Spanish (419)", value: "es-419" },
          { name: "Spanish (AR)", value: "es-AR" },
          { name: "Spanish (ES)", value: "es-ES" },
          { name: "Swedish (SE)", value: "sv-SE" },
        ],
        default: "en-US",
        description: "The language code for the speech output",
      },
      {
        displayName: "Voice ID",
        name: "voiceId",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            operation: ["generateSpeech"],
          },
        },
        default: "",
        placeholder: "v123",
        description:
          'The voice ID to use. Use "Get Voices" operation to retrieve available voices.',
      },

      // ============================================
      // Generate Avatar
      // ============================================
      {
        displayName: "Input Type",
        name: "inputType",
        type: "options",
        displayOptions: {
          show: {
            operation: ["generateAvatar"],
          },
        },
        options: [
          { name: "Text", value: "text" },
          { name: "Audio", value: "audio" },
        ],
        default: "text",
        description: "Whether to generate avatar from text or audio file",
      },
      {
        displayName: "Script Input",
        name: "scriptInput",
        type: "string",
        typeOptions: {
          rows: 5,
        },
        required: true,
        displayOptions: {
          show: {
            operation: ["generateAvatar"],
            inputType: ["text"],
          },
        },
        default: "",
        placeholder: "Enter text or a pre-signed URL to text file",
        description:
          "The text for the avatar to speak, or a pre-signed URL pointing to a text file",
      },
      {
        displayName: "Locale Code",
        name: "localeCode",
        type: "options",
        required: true,
        displayOptions: {
          show: {
            operation: ["generateAvatar"],
            inputType: ["text"],
          },
        },
        options: [
          { name: "Chinese (CN)", value: "zh-CN" },
          { name: "Danish (DK)", value: "da-DK" },
          { name: "Dutch (NL)", value: "nl-NL" },
          { name: "English (GB)", value: "en-GB" },
          { name: "English (IN)", value: "en-IN" },
          { name: "English (US)", value: "en-US" },
          { name: "French (CA)", value: "fr-CA" },
          { name: "French (FR)", value: "fr-FR" },
          { name: "German (DE)", value: "de-DE" },
          { name: "Hindi (IN)", value: "hi-IN" },
          { name: "Italian (IT)", value: "it-IT" },
          { name: "Japanese (JP)", value: "ja-JP" },
          { name: "Korean (KR)", value: "ko-KR" },
          { name: "Norwegian (NO)", value: "nb-NO" },
          { name: "Portuguese (BR)", value: "pt-BR" },
          { name: "Portuguese (PT)", value: "pt-PT" },
          { name: "Spanish (419)", value: "es-419" },
          { name: "Spanish (AR)", value: "es-AR" },
          { name: "Spanish (ES)", value: "es-ES" },
          { name: "Swedish (SE)", value: "sv-SE" },
        ],
        default: "en-US",
        description: "The language code for the speech",
      },
      {
        displayName: "Voice ID",
        name: "voiceId",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            operation: ["generateAvatar"],
            inputType: ["text"],
          },
        },
        default: "",
        placeholder: "v123",
        description:
          'The voice ID to use. Use "Get Voices" operation to retrieve available voices.',
      },
      {
        displayName: "Audio URL",
        name: "audioUrl",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            operation: ["generateAvatar"],
            inputType: ["audio"],
          },
        },
        default: "",
        placeholder: "https://presigned-url.com/audio.wav",
        description: "Pre-signed URL pointing to the audio file (WAV format)",
      },
      {
        displayName: "Audio Locale Code",
        name: "audioLocaleCode",
        type: "options",
        required: true,
        displayOptions: {
          show: {
            operation: ["generateAvatar"],
            inputType: ["audio"],
          },
        },
        options: [
          { name: "Chinese (CN)", value: "zh-CN" },
          { name: "Danish (DK)", value: "da-DK" },
          { name: "Dutch (NL)", value: "nl-NL" },
          { name: "English (GB)", value: "en-GB" },
          { name: "English (IN)", value: "en-IN" },
          { name: "English (US)", value: "en-US" },
          { name: "French (CA)", value: "fr-CA" },
          { name: "French (FR)", value: "fr-FR" },
          { name: "German (DE)", value: "de-DE" },
          { name: "Hindi (IN)", value: "hi-IN" },
          { name: "Italian (IT)", value: "it-IT" },
          { name: "Japanese (JP)", value: "ja-JP" },
          { name: "Korean (KR)", value: "ko-KR" },
          { name: "Norwegian (NO)", value: "nb-NO" },
          { name: "Portuguese (BR)", value: "pt-BR" },
          { name: "Portuguese (PT)", value: "pt-PT" },
          { name: "Spanish (419)", value: "es-419" },
          { name: "Spanish (AR)", value: "es-AR" },
          { name: "Spanish (ES)", value: "es-ES" },
          { name: "Swedish (SE)", value: "sv-SE" },
        ],
        default: "en-US",
        description: "The language code of the audio",
      },
      {
        displayName: "Avatar ID",
        name: "avatarId",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            operation: ["generateAvatar"],
          },
        },
        default: "",
        placeholder: "a123",
        description:
          'The avatar ID to use. Use "Get Avatars" operation to retrieve available avatars.',
      },
      {
        displayName: "Background Type",
        name: "backgroundType",
        type: "options",
        displayOptions: {
          show: {
            operation: ["generateAvatar"],
          },
        },
        options: [
          { name: "Color", value: "color" },
          { name: "Image", value: "image" },
          { name: "Video", value: "video" },
        ],
        default: "color",
        description: "The type of background for the avatar video",
      },
      {
        displayName: "Background Color",
        name: "backgroundColor",
        type: "color",
        displayOptions: {
          show: {
            operation: ["generateAvatar"],
            backgroundType: ["color"],
          },
        },
        default: "#FFFFFF",
        description: "Hex color code for the background",
      },
      {
        displayName: "Background URL",
        name: "backgroundUrl",
        type: "string",
        displayOptions: {
          show: {
            operation: ["generateAvatar"],
            backgroundType: ["image", "video"],
          },
        },
        default: "",
        placeholder: "https://presigned-url.com/background.jpg",
        description: "Pre-signed URL pointing to the background image or video",
      },

      // ============================================
      // Reframe Video
      // ============================================
      {
        displayName: "Video URL",
        name: "videoUrl",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            operation: ["reframeVideo"],
          },
        },
        default: "",
        placeholder: "https://presigned-url.com/video.mp4",
        description: "Pre-signed URL pointing to the video file",
      },
      {
        displayName: "Media Type",
        name: "mediaType",
        type: "options",
        displayOptions: {
          show: {
            operation: ["reframeVideo"],
          },
        },
        options: [
          { name: "MP4", value: "video/mp4" },
          { name: "QuickTime", value: "video/quicktime" },
        ],
        default: "video/mp4",
        description: "The media type of the video",
      },
      {
        displayName: "Aspect Ratios",
        name: "aspectRatios",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            operation: ["reframeVideo"],
          },
        },
        default: "1:1, 9:16",
        placeholder: "1:1, 9:16, 4:5",
        description:
          "Comma-separated list of aspect ratios for output (e.g., 1:1, 9:16, 4:5, 16:9)",
      },
      {
        displayName: "Scene Edit Detection",
        name: "sceneEditDetection",
        type: "boolean",
        displayOptions: {
          show: {
            operation: ["reframeVideo"],
          },
        },
        default: true,
        description:
          "Whether to apply scene edit detection before reframing. Helps preserve scene transitions.",
      },

      // ============================================
      // Transcribe
      // ============================================
      {
        displayName: "Input Type",
        name: "inputType",
        type: "options",
        displayOptions: {
          show: {
            operation: ["transcribe", "dub"],
          },
        },
        options: [
          { name: "Audio", value: "audio" },
          { name: "Video", value: "video" },
        ],
        default: "video",
        description: "Whether to transcribe audio or video",
      },
      {
        displayName: "Source URL",
        name: "sourceUrl",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            operation: ["transcribe", "dub"],
          },
        },
        default: "",
        placeholder: "https://presigned-url.com/media.mp4",
        description: "Pre-signed URL pointing to the audio or video file",
      },
      {
        displayName: "Audio Media Type",
        name: "audioMediaType",
        type: "options",
        displayOptions: {
          show: {
            operation: ["transcribe", "dub"],
            inputType: ["audio"],
          },
        },
        options: [
          { name: "AAC", value: "audio/aac" },
          { name: "M4A", value: "audio/x-m4a" },
          { name: "MP3", value: "audio/mp3" },
          { name: "MPEG", value: "audio/mpeg" },
          { name: "WAV", value: "audio/wav" },
        ],
        default: "audio/wav",
        description: "The media type of the audio file",
      },
      {
        displayName: "Video Media Type",
        name: "videoMediaType",
        type: "options",
        displayOptions: {
          show: {
            operation: ["transcribe", "dub"],
            inputType: ["video"],
          },
        },
        options: [
          { name: "AVI", value: "video/x-msvideo" },
          { name: "Matroska", value: "video/x-matroska" },
          { name: "MOV", value: "video/mov" },
          { name: "MP4", value: "video/mp4" },
          { name: "QuickTime", value: "video/quicktime" },
        ],
        default: "video/mp4",
        description: "The media type of the video file",
      },
      {
        displayName: "Target Locale Codes",
        name: "targetLocaleCodes",
        type: "string",
        displayOptions: {
          show: {
            operation: ["transcribe"],
          },
        },
        default: "",
        placeholder: "en-US, es-ES",
        description:
          "Comma-separated list of target language codes for translation. Leave empty to transcribe in source language.",
      },
      {
        displayName: "Target Locale Codes",
        name: "targetLocaleCodes",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            operation: ["dub"],
          },
        },
        default: "",
        placeholder: "es-ES, fr-FR, de-DE",
        description:
          "Comma-separated list of target language codes for dubbing (required)",
      },
      {
        displayName: "Generate Captions",
        name: "generateCaptions",
        type: "boolean",
        displayOptions: {
          show: {
            operation: ["transcribe"],
          },
        },
        default: false,
        description:
          "Whether to generate caption files (SRT format) in addition to transcripts",
      },

      // ============================================
      // Dub
      // ============================================
      {
        displayName: "Lip Sync",
        name: "lipSync",
        type: "boolean",
        displayOptions: {
          show: {
            operation: ["dub"],
            inputType: ["video"],
          },
        },
        default: false,
        description:
          "Whether to apply high-quality composited lip sync for video dubbing",
      },

      // ============================================
      // Get Job Status
      // ============================================
      {
        displayName: "Job ID",
        name: "jobId",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            operation: ["getJobStatus", "waitForJob"],
          },
        },
        default: "",
        placeholder: "job-abc123",
        description: "The job ID to check status for",
      },

      // ============================================
      // Wait for Job
      // ============================================
      {
        displayName: "Polling Interval (Seconds)",
        name: "pollingInterval",
        type: "number",
        displayOptions: {
          show: {
            operation: ["waitForJob"],
          },
        },
        default: 3,
        typeOptions: {
          minValue: 1,
          maxValue: 60,
        },
        description:
          "How often to check the job status (in seconds) when waiting for completion",
      },
      {
        displayName: "Timeout (Minutes)",
        name: "timeout",
        type: "number",
        displayOptions: {
          show: {
            operation: ["waitForJob"],
          },
        },
        default: 5,
        typeOptions: {
          minValue: 1,
          maxValue: 60,
        },
        description:
          "Maximum time to wait for job completion (in minutes). The node will fail if the timeout is reached.",
      },
    ],
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const returnData: IDataObject[] = [];
    const operation = this.getNodeParameter("operation", 0) as string;

    // Initialize clients
    const credentials = await this.getCredentials("fireflyServicesApi");
    const imsClient = new IMSClient({
      clientId: credentials.clientId as string,
      clientSecret: credentials.clientSecret as string,
      scope: (credentials.scopes as string) || "firefly_api,ff_apis",
    });
    const audioVideoClient = new AudioVideoClient({ imsClient });

    // Process each input item
    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: IDataObject;

        switch (operation) {
          case "getVoices":
            responseData = await executeGetVoices.call(
              this,
              i,
              audioVideoClient,
            );
            break;

          case "getAvatars":
            responseData = await executeGetAvatars.call(
              this,
              i,
              audioVideoClient,
            );
            break;

          case "generateSpeech":
            responseData = await executeGenerateSpeech.call(
              this,
              i,
              audioVideoClient,
            );
            break;

          case "generateAvatar":
            responseData = await executeGenerateAvatar.call(
              this,
              i,
              audioVideoClient,
            );
            break;

          case "reframeVideo":
            responseData = await executeReframeVideo.call(
              this,
              i,
              audioVideoClient,
            );
            break;

          case "transcribe":
            responseData = await executeTranscribe.call(
              this,
              i,
              audioVideoClient,
            );
            break;

          case "dub":
            responseData = await executeDub.call(this, i, audioVideoClient);
            break;

          case "getJobStatus":
            responseData = await executeGetJobStatus.call(
              this,
              i,
              audioVideoClient,
            );
            break;

          case "waitForJob":
            responseData = await executeWaitForJob.call(
              this,
              i,
              audioVideoClient,
            );
            break;

          default:
            throw new ApplicationError(`Unknown operation: ${operation}`);
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
