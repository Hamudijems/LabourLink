## 2025-05-22 - [Suspense for useSearchParams]
**Learning:** In Next.js 14, components using `useSearchParams` must be wrapped in a `Suspense` boundary to prevent production build failures and ensure stable static generation.
**Action:** Always wrap pages or components that consume search parameters in a `Suspense` block.

## 2025-05-22 - [Accessible Icon-Only Buttons]
**Learning:** Icon-only buttons (like Plus/X icons in dynamic lists) are completely opaque to screen readers without explicit `aria-label` attributes.
**Action:** Include descriptive `aria-label` attributes for all interactive elements that do not have visible text labels.
