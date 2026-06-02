## 2025-05-15 - [Next.js 14] useSearchParams Suspense Boundary requirement
**Learning:** In Next.js 14, components that use the `useSearchParams` hook must be wrapped in a `<Suspense>` boundary if they are part of a page that is statically optimized. Failing to do so causes the production build (`next build`) to fail with a "missing-suspense-with-csr-bailout" error during prerendering.
**Action:** Always wrap client-side logic consuming search parameters in a separate component or a Suspense boundary to ensure build stability.
