## 2025-05-22 - Next.js Build Constraints for useSearchParams
**Learning:** In Next.js (especially versions like 14.2.16), client components using the `useSearchParams` hook MUST be wrapped in a `Suspense` boundary. Failure to do so causes "missing-suspense-with-csr-bailout" errors during the static page generation phase of `next build`, even if the development server (`next dev`) works fine.
**Action:** Always wrap components using `useSearchParams` in a `<Suspense>` boundary. Use `pnpm build` during development to catch these framework-specific constraints early.

## 2025-05-22 - Admin Login UX/A11y Patterns
**Learning:** Standard authentication forms should always include `autoComplete` attributes (e.g., `email`, `current-password`) to support password managers and improve user efficiency. Icon-only toggle buttons (like password visibility) require dynamic `aria-label` attributes to inform screen reader users of the current state and intended action.
**Action:** Include `autoComplete` on all login/signup inputs and provide meaningful `aria-label` for all icon buttons.
