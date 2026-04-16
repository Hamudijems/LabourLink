## 2025-05-15 - Missing ARIA labels on icon-only buttons
**Learning:** Found a recurring pattern in the app where Radix UI/shadcn `Button` components and standard `<button>` elements are used with icons (like `Plus`, `X`, `Eye`) but lack `aria-label` or descriptive text. This makes them inaccessible to screen readers.
**Action:** Always check for `aria-label` when using icon-only buttons. Ensure dynamic labels for toggles (e.g., password visibility).
