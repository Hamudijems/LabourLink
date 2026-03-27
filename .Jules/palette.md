# Palette's UX & Accessibility Journal

## 2025-01-30 - Improving Feedback and Navigation in Next.js
**Learning:** Toasts (e.g., from `sonner`) are cleared during hard navigation using `window.location.href`. To ensure users see success messages, `router.push` from `next/navigation` should be used to maintain the application state. Additionally, any client component using `useSearchParams` must be wrapped in a `Suspense` boundary to prevent build-time errors during static generation.
**Action:** Always prefer `router.push` for internal navigation when showing feedback, and proactively wrap search-param-dependent components in `Suspense`.
