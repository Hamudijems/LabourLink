## 2025-05-15 - Multi-step Form Feedback and Next.js 14 Build Stability

**Learning:** In multi-step forms involving async third-party verification (like Fayda ID), providing immediate, themed success feedback (e.g., green Alert with CheckCircle) is critical for orienting the user before they proceed. Additionally, Next.js 14 strictly requires `useSearchParams()` to be wrapped in a `<Suspense>` boundary; failing to do so breaks production builds during static optimization.

**Action:** Always wrap `useSearchParams` logic in a `Suspense` boundary (ideally in a side-effect sub-component to keep changes minimal) and implement immediate visual success states for async verification steps.
