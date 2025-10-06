# AI Assistant Guidelines

## Development Approach

- Always check if similar patterns exist in the codebase before implementing
- Prefer modifying existing files over creating new ones unless explicitly needed
- Follow the established project structure
- Build and test after making changes
- Fix linting errors immediately

## Code Changes

- Implement changes directly rather than only suggesting them
- Use the proper n8n patterns from existing code
- Ensure all imports use correct types vs values
- Always use `NodeConnectionTypes` for runtime values
- Test that the build succeeds after changes
