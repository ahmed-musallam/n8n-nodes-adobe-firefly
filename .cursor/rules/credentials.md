# Credentials

## Credential File Structure

- Place all credential files in `credentials/` directory
- Must implement `ICredentialType` interface
- Export as class with `.credentials.ts` extension
- Register in `package.json` under `n8n.credentials`

## Conditional Credential Display

Use `displayOptions` to show/hide credentials based on authentication type:

```typescript
credentials: [
  {
    name: "credentialName",
    required: true,
    displayOptions: {
      show: {
        authentication: ["accessToken"],
      },
    },
  },
];
```

## TODO: Authentication Requirements

```
TODO: Specify OAuth2 vs API Key requirements
TODO: Add credential fields needed
TODO: Document token refresh logic if needed
```
