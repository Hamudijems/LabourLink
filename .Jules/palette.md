## 2024-05-24 - [Next.js 14 Suspense Boundary for UX Hooks]
**Learning:** In Next.js 14, using hooks like `useSearchParams` outside of a `Suspense` boundary causes production build failures (missing-suspense-with-csr-bailout). This is a critical structural requirement when implementing client-side UX improvements.
**Action:** Always wrap components consuming search parameters in a `Suspense` boundary, preferably by refactoring logic into a sub-component within the same file to maintain the 50-line micro-UX constraint.
