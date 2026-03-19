## 2025-05-14 - Next.js Suspense for Search Parameters
**Learning:** In Next.js 14, using `useSearchParams()` in a client component that is part of a statically generated page will cause a build error unless it is wrapped in a `Suspense` boundary. This is a critical stability pattern for this app.
**Action:** Always wrap components using `useSearchParams` in a `Suspense` boundary to ensure production build stability and provide a loading state.

## 2025-05-14 - Accessible Password Toggles
**Learning:** Icon-only buttons for toggling password visibility are common but often lack `aria-label` and `title`, making them inaccessible to screen readers and confusing for hover users.
**Action:** Always include dynamic `aria-label` and `title` attributes on password toggle buttons to reflect the current state ("Show password" vs "Hide password").
