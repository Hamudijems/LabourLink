## 2025-05-15 - Next.js 14 Build Constraints & Multi-step Feedback
**Learning:** Next.js 14 production builds fail if `useSearchParams()` is used outside of a `<Suspense>` boundary in client components. Additionally, providing immediate visual feedback with themed alerts (e.g., green success alerts with icons) after critical async steps like identity verification significantly improves the perceived reliability of multi-step forms.
**Action:** Always wrap components using `useSearchParams()` in `<Suspense>` and implement clear, icon-backed success states for major form milestones.
