## 2025-05-14 - Suspense Boundaries for build stability
**Learning:** In Next.js 14, using `useSearchParams()` in a client component without a `Suspense` boundary causes production build failures during prerendering.
**Action:** Always wrap components using `useSearchParams()` in a `Suspense` boundary at the page level.

## 2025-05-14 - ARIA labels for icon-only buttons
**Learning:** Icon-only buttons (like Plus/X/Eye) are common in this app but often lack descriptive `aria-label` attributes, making them inaccessible.
**Action:** Proactively check and add `aria-label` to all icon-only buttons to ensure screen reader compatibility.
