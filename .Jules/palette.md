## 2024-05-14 - Accessibility and Build Stability
**Learning:** Icon-only buttons (like Add/Remove skill) must have descriptive aria-labels for screen readers. Additionally, Next.js 14 requires wrapping components that use `useSearchParams` in a `Suspense` boundary to avoid build-time errors.
**Action:** Always check for missing aria-labels on icon-only buttons and ensure `useSearchParams` is wrapped in `Suspense` in client components.
