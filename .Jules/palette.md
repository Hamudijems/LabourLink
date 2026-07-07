## 2025-05-15 - Next.js 14 Build Stability with Suspense
**Learning:** In Next.js 14, using client-side hooks like `useSearchParams` without a `Suspense` boundary triggers a build-time bailout and prerender error, even if the dev server runs fine. This is a critical invisible UX factor for deployment stability.
**Action:** Always wrap components consuming search params in a `Suspense` boundary with a matching fallback UI to ensure smooth hydration and production build success.

## 2025-05-15 - Accessible Dynamic Lists
**Learning:** Dynamic lists (skills, sections) often lack semantic context for screen readers when using icon-only buttons for addition and removal.
**Action:** Use `aria-label` for all icon-only buttons and prefer `onKeyDown` over `onKeyPress` for better keyboard compatibility. Ensure 'Add' buttons are disabled for empty inputs to maintain data integrity.
