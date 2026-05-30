## 2025-05-15 - Improving Accessibility and Build Stability
**Learning:** Next.js 14 requires `useSearchParams` to be wrapped in a `Suspense` boundary to avoid build-time errors and ensure proper client-side hydration. Additionally, icon-only buttons like password toggles MUST have descriptive `aria-label` attributes to be accessible to screen reader users.
**Action:** Always wrap components using `useSearchParams` in `Suspense` and verify all icon-only interactive elements have appropriate ARIA labels.
