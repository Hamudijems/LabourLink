## 2024-03-24 - [Suspense for useSearchParams]
**Learning:** Next.js 14 requires `useSearchParams()` to be wrapped in a `<Suspense>` boundary during production builds to avoid "missing suspense with csr bailout" errors, even if it works in development.
**Action:** Always wrap client components or logic using `useSearchParams` in a `<Suspense>` boundary to ensure build stability.
