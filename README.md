# n8n-nodes-adobe-firefly

This is an n8n community node. It lets you use Adobe Firefly Services in your n8n workflows.

Adobe Firefly is a generative AI service that allows you to create stunning images from text prompts using Adobe's state-of-the-art AI models.

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

**Firefly Services**

### Image Generation

- **Generate Images Async**: Create images from text prompts using Adobe Firefly's generative AI
- **Generate Similar Images (Async)**: Generate variations based on a reference image
- **Generate Object Composite (Async)**: Combine images with AI-generated content
- **Expand Image (Async)**: Expand images beyond their original boundaries
- **Fill Image (Async)**: Fill masked areas of an image with AI-generated content
- **Generate Video (Async)**: Create AI-generated videos from text prompts
- **Get Job Status**: Check the status of any asynchronous job (image/video generation). Optional "Wait for Completion" mode automatically polls until the job finishes.
- **Cancel Job**: Cancel a pending or running asynchronous job
- **Upload Image**: Upload images to Adobe's storage for use in other operations

## Credentials

To use this node, you need Adobe Firefly API credentials: `client id` and `client secret`

4. In n8n, create new **Firefly Services API** credentials with:
   - **Client ID**: Your OAuth client ID
   - **Client Secret**: Your OAuth client secret
   - **Scopes**: Space or comma-separated list of scopes

The node automatically handles IMS (Adobe Identity Management System) authentication and token refresh.

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
├── .cursor/             # Cursor IDE rules and schemas
│   ├── rules/          # Development guidelines
│   └── schema/         # OpenAPI specifications
├── clients/            # API client libraries
│   ├── firefly/        # Modular Firefly client (see clients/firefly/README.md)
│   │   ├── operations/ # Individual operation implementations
│   │   ├── types/      # TypeScript type definitions
│   │   ├── firefly-client.ts  # Main orchestration class
│   │   ├── index.ts    # Public exports
│   │   └── README.md   # Client architecture documentation
│   ├── substance-client.ts    # Substance 3D API client
│   ├── ims-client.ts          # Adobe IMS authentication
│   └── ffs-gen-image-job.d.ts # Job status type definitions
├── credentials/        # Credential types
│   └── AdobeFireflyApi.credentials.ts
├── nodes/             # Node implementations
│   └── FireflyServices/
│       ├── FireflyServices.node.ts  # Main node definition
│       └── exec/                    # Operation handlers
│           ├── generateImagesAsync.ts
│           ├── expandImageAsync.ts
│           ├── fillImageAsync.ts
│           ├── generateSimilarImagesAsync.ts
│           ├── generateObjectCompositeAsync.ts
│           ├── generateVideoAsync.ts
│           ├── getJobStatus.ts
│           ├── cancelJob.ts
│           ├── uploadImage.ts
│           └── index.ts
├── sample-workflows/  # Pre-built workflow examples
├── package.json      # Package configuration
└── tsconfig.json    # TypeScript configuration
```

### Architecture

The node is built with a modular architecture:

- **Modular Client Layer**:
  - Firefly API client is organized into separate operation modules (see [clients/firefly/README.md](./clients/firefly/README.md))
  - Substance 3D API client for 3D rendering and compositing
  - IMS authentication client for Adobe Identity Management
- **Operation Handlers**: Each n8n operation is in its own file under `exec/` for better maintainability
- **Type Safety**: Full TypeScript types for all API requests and responses
- **Separation of Concerns**: Types, operations, and orchestration are clearly separated
- **Auto Authentication**: IMS client handles OAuth token management and refresh automatically

#### Firefly Client Architecture

The Firefly client follows a modular design pattern:

- **Types** (`.d.ts` files): Request/response type definitions
- **Operations** (`.ts` files): Individual API operation implementations
- **Client Class**: Main orchestration that delegates to operations

For detailed information on the Firefly client architecture, adding new operations, and testing, see [clients/firefly/README.md](./clients/firefly/README.md).

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [n8n-node CLI tool documentation](https://docs.n8n.io/integrations/creating-nodes/build/n8n-node/)
- [Adobe Firefly API documentation](https://developer.adobe.com/firefly-services/docs/)
- [Adobe IMS Authentication](https://developer.adobe.com/developer-console/docs/guides/authentication/)

## License

[MIT](LICENSE.md)
