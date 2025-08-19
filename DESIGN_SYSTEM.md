# Design System Color Lock Implementation

## Summary

This project now enforces a strict design system where all colors must be defined as semantic tokens. Raw color values are prohibited and validated by CI.

## Required Package.json Scripts

Add these scripts to your `package.json` (cannot be automated due to file restrictions):

```json
{
  "scripts": {
    "check:colors": "node ./scripts/checkColors.js",
    "verify": "npm run lint && npm run check:colors && npm run test",
    "test": "playwright test"
  }
}
```

## Files Created/Updated

### New Files:
- `styles/tokens.css` - Semantic design tokens with light/dark themes
- `styles/tokens.ts` - TypeScript token exports  
- `scripts/checkColors.js` - Color validation script
- `tests/theme.spec.ts` - Playwright theme tests
- `playwright.config.ts` - Playwright configuration
- `DESIGN_SYSTEM.md` - This documentation

### Updated Files:
- `tailwind.config.ts` - Now maps only to semantic tokens
- `src/index.css` - Imports new token system
- `eslint.config.js` - Blocks inline style props
- `README.md` - Added design system documentation

## Usage

### Allowed Classes:
```css
/* ✅ Semantic tokens */
bg-bg, bg-surface, bg-primary
text-fg, text-fg-muted, text-primary-fg
border-border, border-primary
```

### Forbidden:
```css
/* ❌ Raw colors */
#ffffff, rgb(255,255,255), hsl(0,0%,100%)
bg-[#fff], text-[rgb(0,0,0)]
style={{ color: '#000' }}
```

## Validation

Run `npm run check:colors` to validate compliance. The script will:
- Scan all TypeScript, TSX, and CSS files
- Check for hex colors, rgb/rgba/hsl functions
- Check for Tailwind arbitrary color values
- Fail CI if violations are found

## Theme System

Colors are defined in `styles/tokens.css` with:
- Light theme (`:root`)
- Dark theme (`:root[data-theme="dark"]`)
- All medical interface colors
- Proper semantic naming

Switch themes by setting `data-theme="dark"` on the document root.

## Next Steps

1. Add the package.json scripts above
2. Run `npm run check:colors` to validate existing code
3. Update any components using raw colors to use semantic tokens
4. Set up CI to run `npm run verify` on all commits