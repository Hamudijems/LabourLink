## 2024-05-22 - Next.js 14 Build Requirements for Search Params
**Learning:** In Next.js 14, using `useSearchParams()` in a client component that is being pre-rendered will cause the build to fail unless it is wrapped in a `<Suspense>` boundary.
**Action:** Always wrap components consuming search parameters in `<Suspense>` to ensure production build stability and satisfy Next.js CSR bailout requirements.

## 2024-05-22 - Persistence of Toast Notifications during Navigation
**Learning:** Using `window.location.href` for navigation after a successful action clears the global application state, including active toast notifications.
**Action:** Use Next.js `router.push()` for client-side navigation to ensure toast notifications (like success messages) persist and are visible to the user after the transition.
