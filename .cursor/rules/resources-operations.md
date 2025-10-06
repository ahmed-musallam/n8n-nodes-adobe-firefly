# Resources & Operations

## Resource Organization Pattern

- Organize operations by resource in `resources/` subdirectory
- Each resource has its own folder with operation files
- Export descriptions as arrays of `INodeProperties`
- Use `displayOptions` to show/hide based on resource selection

## Common Request Pattern

```typescript
requestDefaults: {
  baseURL: 'https://api.example.com',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
}
```

## List Search Methods

- Place in `listSearch/` subdirectory
- Used for dynamic dropdowns and autocomplete
- Return array of `{ name, value }` objects

## TODO: Functional Requirements

```
TODO: List required operations (e.g., generate images, apply effects)
TODO: List required resources
TODO: Define input/output schemas
```
