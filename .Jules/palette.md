## 2025-05-15 - Next.js Suspense and Button Loading States
**Learning:** Next.js 14 client components using `useSearchParams` must be wrapped in a `Suspense` boundary for static build compatibility. Adding `Loader2` spinners to buttons provides immediate visual feedback for async actions, which is essential for a smooth UX.
**Action:** Always wrap `useSearchParams` in `Suspense` and include loading states for any network-bound button actions.
