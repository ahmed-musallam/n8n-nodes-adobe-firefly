# Code Quality Standards

## Naming Conventions

- **Node names**: PascalCase (e.g., `AdobeFirefly`)
- **File names**: Match node name with extensions
- **Parameters**: camelCase
- **Display names**: Human-readable with proper capitalization

## Documentation

- Add JSDoc comments for complex functions
- Document all node parameters with descriptions
- Include examples in parameter hints where helpful

## Build & Development Workflow

- Build command: `npm run build`
- Dev server: `npm run dev`
- Linting: `npm run lint` or `npm run lint:fix`
- **Always build before testing**

## Testing Checklist

- [ ] Node appears in n8n UI
- [ ] All parameters display correctly
- [ ] Credentials authenticate successfully
- [ ] Operations execute without errors
- [ ] Error messages are user-friendly
- [ ] TypeScript builds without errors
- [ ] Linting passes
