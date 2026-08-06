# Context

The banner currently has hardcoded light-mode hex colors. The user also has a dark version. The goal is to make a single Banner component that renders correctly in both light and dark mode, with a live toggle so both designs can be previewed and tweaked simultaneously without maintaining two separate components.

`next-themes` is already installed. `theme.css` already defines both `:root` (light) and `.dark` CSS variable sets. Tailwind is configured with `@custom-variant dark (&:is(.dark *))` in `theme.css` so `dark:` utility classes work out of the box.

---

# Approach: Single Banner with Dark/Light Mode Toggle

## 1. Wrap app in `ThemeProvider` (`next-themes`)

In `src/app/App.tsx`, import and wrap the root with `ThemeProvider` from `next-themes`:

```tsx
import { ThemeProvider } from "next-themes";
// attribute="class" so next-themes adds/removes the .dark class on <html>
<ThemeProvider attribute="class" defaultTheme="light">
  ...
</ThemeProvider>
```

## 2. Add a theme toggle button

Add a small `Sun` / `Moon` toggle (lucide-react, already installed) floating in the top-right corner of the page. Use `useTheme()` from `next-themes` to read and set the current theme.

## 3. Convert Banner colors to dark:/light dual-mode

Replace all hardcoded hex values in the Banner with `dark:` Tailwind variants or inline style objects that switch based on a `isDark` boolean (from `useTheme()`). 

Since SVG `stroke`/`fill` attributes and `style` props can't use Tailwind `dark:` classes directly, use a small hook that returns the correct palette object and pass values into inline styles.

### Light palette (current)
- Page bg: `#f0f4f8`
- Banner bg gradient: `#e8f5ee → #f0faf4 → #e8f4f2`
- Accent/circuit: `#00994d`
- Heading: `#0d2b1a`
- Body text: `#2d6b52`
- Logo bg: `#d4f0e0 → #e8f5ee`
- Code overlay: `#007a3d`

### Dark palette (original)
- Page bg: `#050a0e`
- Banner bg gradient: `#060d12 → #0a1a22 → #061218`
- Accent/circuit: `#00e676`
- Heading: `#ffffff`
- Body text: `#a0c4b8`
- Logo bg: `#0d2b1a → #061210`
- Code overlay: `#00e676`

## 4. File changes

**Only `src/app/App.tsx`** needs to change:
- Add `ThemeProvider` wrapper at the root
- Add toggle button component using `useTheme` + lucide `Sun`/`Moon`
- Extract a `useBannerTheme()` hook that returns the palette based on current theme
- Thread palette values into the Banner via props or context

---

# Verification
- Toggle button switches between light and dark visually
- Both states match the original designs (dark = original #050a0e banner, light = current mint banner)
- No flash of wrong theme on load (next-themes handles this)
- Both `Sun` and `Moon` icons render correctly from lucide-react
