## 2026-06-01 - [Building with Suspense for useSearchParams]
**Learning:** Next.js 14 requires logic consuming 'useSearchParams()' to be wrapped in a 'Suspense' boundary to avoid production build failures.
**Action:** Always wrap search parameter dependent logic in a separate component within a '<Suspense>' boundary when using Next.js 14.
