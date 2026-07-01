## 2025-05-22 - Next.js 14 Build Stability and useSearchParams

**Learning:** In Next.js 14, using the `useSearchParams` hook in a client component that is not wrapped in a `<Suspense>` boundary can cause the production build to fail during static optimization. This is a common pattern when pages depend on query parameters for their initial state.

**Action:** Always wrap client components using `useSearchParams` in a `<Suspense>` boundary. For main page components, it's often best to extract the logic into an inner component and export a wrapper that provides the `Suspense` boundary and a fallback UI.
