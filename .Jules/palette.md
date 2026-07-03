## 2025-05-22 - Next.js 14 Build Stability for Client-side Hooks
**Learning:** In Next.js 14, using `useSearchParams` outside of a `Suspense` boundary can cause the entire build to fail during static generation. Wrapping form logic in `Suspense` not only fixes the build but also provides a better entry point for loading states.
**Action:** Always wrap components using `useSearchParams` in a `Suspense` boundary and provide a fallback UI (like a spinner) to improve the perceived initial load UX.
