# Palette's Journal

## Critical UX and Accessibility Learnings

## 2025-05-15 - [Build-time CSR Bailout with useSearchParams]
**Learning:** In Next.js 14, using `useSearchParams()` in a client component that is directly exported as a page will cause a build-time error ("useSearchParams() should be wrapped in a suspense boundary"). This happens because the page is pre-rendered on the server, where search parameters are not available in the same way.
**Action:** Always wrap the logic that consumes `useSearchParams()` in a separate component and wrap that component in a `<Suspense>` boundary within the main page export.
