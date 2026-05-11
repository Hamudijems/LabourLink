# Palette's Journal

## 2025-05-14 - Next.js 14 Suspense Requirement for useSearchParams
**Learning:** In Next.js 14, using `useSearchParams()` in a Client Component during static rendering (prerendering) will cause the entire page to deoptimize to client-side rendering. If not wrapped in a `<Suspense>` boundary, the build will fail with a "missing suspense boundary" error.
**Action:** Always wrap logic that consumes `useSearchParams()` in a separate component inside a `<Suspense>` boundary to avoid production build failures and ensure proper deoptimization behavior.
