## 2026-03-16 - Suspense for SearchParams
**Learning:** Next.js client components using the `useSearchParams` hook must be wrapped in a `Suspense` boundary to prevent build errors during static page generation (`next build`).
**Action:** Always wrap components or pages using `useSearchParams` in `Suspense` when refactoring or creating new routes.
