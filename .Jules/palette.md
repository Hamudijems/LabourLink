## 2025-05-22 - [Suspense for useSearchParams]
**Learning:** Next.js 14 requires `useSearchParams` to be wrapped in a `Suspense` boundary during static optimization to avoid build-time hydration bailouts.
**Action:** Extract search param logic into a small sub-component and wrap it in `<Suspense fallback={null}>` within the main page component.
