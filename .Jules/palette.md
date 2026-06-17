## 2025-05-14 - Suspense for Search Parameters
**Learning:** In Next.js 14, using 'useSearchParams()' in a client component that is pre-rendered at build time causes a build failure unless it is wrapped in a 'Suspense' boundary.
**Action:** Always wrap components using 'useSearchParams' in a 'Suspense' boundary to ensure build stability and avoid CSR bailout errors.

## 2025-05-14 - Accessible Dynamic Lists
**Learning:** Dynamic lists with icon-only buttons for adding/removing items require explicit ARIA labels and hover feedback to be accessible and intuitive. Replacing 'onKeyPress' with 'onKeyDown' ensures compatibility with modern event handling.
**Action:** Provide descriptive 'aria-label' attributes for all icon buttons and use 'onKeyDown' for keyboard-triggered actions in form inputs.
