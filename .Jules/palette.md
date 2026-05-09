## 2024-05-20 - Global Feedback and Navigation Timing
**Learning:** Replaced browser alerts with toasts in Next.js. Discovered that immediate navigation after a toast can hide it from the user before it's read.
**Action:** Use a short `setTimeout` before redirecting after a success toast to ensure the message is visible to the user.

## 2024-05-20 - Next.js 14 Build Stability
**Learning:** Production builds fail if `useSearchParams` is used without a `Suspense` boundary.
**Action:** Always wrap components using `useSearchParams` in a `<Suspense>` boundary to maintain build integrity.
