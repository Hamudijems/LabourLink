## 2024-05-24 - [Suspense Boundary for useSearchParams]
**Learning:** Next.js client components using `useSearchParams` must be wrapped in a `Suspense` boundary to prevent build errors and CSR bailout during static generation.
**Action:** Always check for `useSearchParams` in new client components and ensure they are appropriately wrapped in `Suspense`.
