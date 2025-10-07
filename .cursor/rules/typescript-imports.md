# TypeScript Imports

## Critical Import Rules

**IMPORTANT**: Use `NodeConnectionTypes` (plural) for runtime values, NOT `NodeConnectionType`

```typescript
// ✅ Correct
import {
  NodeConnectionTypes,
  type INodeType,
  type INodeTypeDescription,
} from "n8n-workflow";
inputs: [NodeConnectionTypes.Main];

// ❌ Wrong - causes TS2693 error
import { NodeConnectionType } from "n8n-workflow";
inputs: [NodeConnectionType.Main];
```

## Type Safety

- Use proper TypeScript types from `n8n-workflow`
- Prefer `type` imports for interfaces
- Use const imports for runtime values
- Use strict TypeScript settings
- No `any` types without justification
- Properly type all function parameters and returns
- Use interfaces for complex objects
