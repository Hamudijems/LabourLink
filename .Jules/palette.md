## 2025-05-14 - Next.js 14 useSearchParams Suspense Requirement
**Learning:** In Next.js 14, using `useSearchParams()` in a client component that is being pre-rendered as a static page will cause the build to fail unless the component is wrapped in a `<Suspense>` boundary.
**Action:** Always wrap components using `useSearchParams` in `<Suspense>` to ensure build stability and provide a better loading experience.

## 2025-05-14 - Themed Feedback Patterns
**Learning:** When providing immediate visual feedback for async actions (like ID verification), using an `Alert` component with success styling (`bg-green-50`, etc.) and a `CheckCircle2` icon provides a much stronger affordance than simple text.
**Action:** Use the `Alert` pattern for critical success states in multi-step forms.
