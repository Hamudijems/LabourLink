## 2026-04-02 - Next.js Suspense Boundary for Client Components
**Learning:** In Next.js 14, client components using the `useSearchParams` hook must be wrapped in a `Suspense` boundary to avoid CSR bailout and build-time errors when generating static pages.
**Action:** Always wrap components consuming search parameters in `Suspense` when they are part of a statically optimized route.
