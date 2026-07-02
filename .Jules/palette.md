## 2026-07-02 - Next.js 14 Build Errors and Dynamic List UX

**Learning:** In Next.js 14, using the `useSearchParams` hook requires a `Suspense` boundary for the component or its parent during static generation, otherwise the build will fail. Additionally, when implementing dynamic list inputs (like skills) with 'Enter' key support, `e.preventDefault()` must always be called to avoid unintended parent form submissions.

**Action:** Always wrap components using client-side navigation hooks in `Suspense`. For dynamic inputs, use a block body in `onKeyDown` to ensure `e.preventDefault()` is executed before any conditional logic.
