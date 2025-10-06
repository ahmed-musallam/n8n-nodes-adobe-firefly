# Common Issues & Solutions

## Build Errors

### TS2693 Error

**Problem**: 'NodeConnectionType' only refers to a type, but is being used as a value  
**Solution**: Use `NodeConnectionTypes` (plural) instead of `NodeConnectionType`

### TS6133 Error

**Problem**: Declared variable is never read  
**Solution**: Remove unused imports or use the imported symbol

### Module Not Found

**Problem**: Cannot resolve module  
**Solution**: Check relative paths in imports

## Dev Server Issues

### Server Won't Start

1. Ensure `npm run build` succeeds first
2. Check n8n user folder permissions
3. Clear n8n cache if nodes don't update

### Changes Not Reflecting

1. Stop the dev server
2. Run `npm run build`
3. Restart `npm run dev`
4. Clear browser cache if needed
