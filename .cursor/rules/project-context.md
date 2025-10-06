# Project Context

This is an n8n community node package for Adobe Firefly API integration.

**Package Name**: n8n-nodes-adobe-firefly  
**Description**: n8n community node to work with the Adobe Firefly API  
**n8n API Version**: 1

## Project Structure

```
├── credentials/           # Credential types for authentication
├── nodes/                # Node implementations
│   └── [NodeName]/
│       ├── [NodeName].node.ts
│       ├── [NodeName].node.json
│       ├── resources/    # Resource operations (optional)
│       ├── listSearch/   # List search methods (optional)
│       └── shared/       # Shared utilities
├── icons/                # Node icons (SVG format)
├── dist/                 # Build output (auto-generated)
├── package.json
└── tsconfig.json
```
