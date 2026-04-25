## 2025-05-14 - [Enhanced Signup Feedback and Accessibility]
**Learning:** In Next.js 14, using `useSearchParams` in a client component triggers a build-time error if not wrapped in a `Suspense` boundary. Additionally, replacing browser `alert()` with a toast notification (`sonner`) and adding a small delay before redirecting significantly improves the perceived flow and ensures the user reads important success messages.
**Action:** Always wrap components using `useSearchParams` in `Suspense` and prefer non-blocking notifications like `sonner` with a redirection delay.
