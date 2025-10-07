# Node Structure

## Required Node Implementation

Each node must implement `INodeType` interface with the following structure:

### Required Properties

- `displayName`: User-facing name
- `name`: Internal identifier (camelCase)
- `icon`: Path to SVG icon (provide light and dark variants)
- `group`: Node category
- `version`: Node version number
- `inputs`: Array of input connection types (use `NodeConnectionTypes`)
- `outputs`: Array of output connection types (use `NodeConnectionTypes`)
- `credentials`: Array of credential configurations
- `properties`: Array of node parameters

### Icons

- Provide both light and dark mode SVG icons
- Place in `icons/` directory
- Reference using relative path: `file:../../icons/[name].svg`

### Example Pattern

```typescript
export class MyNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: "My Node",
    name: "myNode",
    icon: {
      light: "file:../../icons/mynode.svg",
      dark: "file:../../icons/mynode.dark.svg",
    },
    group: ["transform"],
    version: 1,
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    // ...
  };
}
```
