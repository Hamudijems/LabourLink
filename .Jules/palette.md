## 2025-03-24 - Navigation and Toast persistence
**Learning:** Hard navigation using `window.location.href` in Next.js triggers a full page reload, which clears the global state of the 'sonner' Toaster.
**Action:** Use `router.push()` from `next/navigation` to perform SPA-friendly navigation that preserves toast notifications.

## 2025-03-24 - Suspense requirements for useSearchParams
**Learning:** In Next.js 14, any Client Component using `useSearchParams()` must be wrapped in a `<Suspense>` boundary during production builds, or the build will fail.
**Action:** Always refactor components using `useSearchParams()` into a child component wrapped with `<Suspense>` in the route-level page.
