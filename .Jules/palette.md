## 2024-05-24 - Persisting Toasts during Navigation in Next.js
**Learning:** In Next.js, using `window.location.href` for navigation triggers a full page reload, which resets the React state and clears any active toast notifications (like those from `sonner`).
**Action:** Always use `router.push()` from `next/navigation` for client-side navigation to preserve the application state and ensure that success/error toasts remain visible to the user after the transition.

## 2024-05-24 - Suspense Boundaries for useSearchParams
**Learning:** Next.js client components using `useSearchParams()` hook must be wrapped in a `<Suspense>` boundary. If not, the build may fail during static generation because the hook requires a search params context that isn't available during the build process.
**Action:** Proactively wrap any component using `useSearchParams()` in a `<Suspense>` boundary to ensure build stability and better UX with a loading fallback.
