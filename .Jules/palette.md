## 2025-05-14 - Next.js Build Constraints for Client Hooks
**Learning:** Next.js client components using the `useSearchParams` hook must be wrapped in a `Suspense` boundary. Failure to do so causes a prerendering error during `pnpm build`, even if the dev server works fine. This is critical for maintaining production-ready UX.
**Action:** Always verify changes with `pnpm build` when working with Next.js client-side hooks and ensure `Suspense` boundaries are in place for components accessing search parameters.

## 2025-05-14 - Accessibility for Icon-only Buttons
**Learning:** Interactive elements like password visibility toggles that use only icons are inaccessible to screen readers without an explicit `aria-label`. Dynamic labels that reflect the current state (e.g., "Show password" vs "Hide password") provide the best UX.
**Action:** Audit forms for icon-only buttons and ensure they have descriptive, state-aware `aria-label` attributes and standard `autoComplete` hints for browser autofill.
