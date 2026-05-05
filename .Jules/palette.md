## 2025-05-15 - [Next.js 14 Suspense & UX Feedback]
**Learning:** Next.js 14 strictly enforces wrapping components using `useSearchParams` in a `<Suspense>` boundary during production builds. For multi-step forms, providing immediate visual feedback (like an `Alert`) after asynchronous verification steps significantly improves perceived performance and user confidence.
**Action:** Always wrap client components consuming search params in `Suspense`. Use themed `Alert` components (e.g., green for success) immediately following successful async actions to confirm state transitions.
