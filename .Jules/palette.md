## 2025-05-15 - [Signup UX & Stability]
**Learning:** In Next.js 14, using `useSearchParams` without a `Suspense` boundary causes production build failures during static optimization. Immediate success feedback for async verification steps (like Fayda ID) significantly improves user orientation in multi-step forms.
**Action:** Always wrap `useSearchParams` in `Suspense` and provide themed success alerts (e.g., green alerts with `CheckCircle2`) immediately after async verification success.
