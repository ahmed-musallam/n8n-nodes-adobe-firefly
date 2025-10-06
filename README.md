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

- **Generate Images Async**: Create images from text prompts using Adobe Firefly's generative AI
- **Get Job Status**: Check the status of an asynchronous image generation job
- **Cancel Job**: Cancel a pending or running image generation job

## Credentials

To use this node, you need Adobe Firefly API credentials: `client id` and `client secret`

4. In n8n, create new **Firefly Services API** credentials with:
   - **Client ID**: Your OAuth client ID
   - **Client Secret**: Your OAuth client secret
   - **Scopes**: Space or comma-separated list of scopes

The node automatically handles IMS (Adobe Identity Management System) authentication and token refresh.

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
├── credentials/          # Credential types
│   └── FireflyServicesApi.credentials.ts
├── nodes/               # Node implementations
│   └── FireflyServices/
│       ├── FireflyServices.node.ts
│       └── FireflyServices.node.json
├── package.json         # Package configuration
└── tsconfig.json       # TypeScript configuration
```

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [n8n-node CLI tool documentation](https://docs.n8n.io/integrations/creating-nodes/build/n8n-node/)
- [Adobe Firefly API documentation](https://developer.adobe.com/firefly-services/docs/)
- [Adobe IMS Authentication](https://developer.adobe.com/developer-console/docs/guides/authentication/)

## License

[MIT](LICENSE.md)
