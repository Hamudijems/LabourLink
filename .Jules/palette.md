## 2025-05-24 - [Themed Feedback for Async Verification]
**Learning:** In multi-step flows involving async third-party verification (like Fayda ID), providing immediate, themed success feedback (using Alert components) is crucial for orienting the user before revealing the next section of the form. It bridges the gap between the "Verify" action and the appearing profile fields.
**Action:** Always implement a themed success Alert (e.g., green styling with a CheckCircle icon) immediately after successful async verification to provide clear positive reinforcement.

## 2025-05-24 - [Next.js 14 Suspense Boundaries for useSearchParams]
**Learning:** Production builds in Next.js 14 fail if `useSearchParams()` is used outside of a Suspense boundary during static optimization. This can be fixed surgically by wrapping the component logic in a Suspense boundary without a full page refactor.
**Action:** Wrap components consuming `useSearchParams` in `<Suspense fallback={...}>` to ensure build stability and better UX during client-side navigation.
