## 2025-05-22 - [Next.js Suspense for SearchParams]
**Learning:** Next.js client components using the `useSearchParams` hook must be wrapped in a `Suspense` boundary to prevent build errors during static page generation. This is often missed during development but surfaces during `pnpm build`.
**Action:** Always wrap components or pages using `useSearchParams` in a `Suspense` boundary and verify with a production build.

## 2025-05-22 - [Ambiguous Label Locators]
**Learning:** In complex form components where a button (like a password visibility toggle) is nested within or near an input's label context, standard label locators (like `get_by_label`) may resolve to multiple elements, causing test failures.
**Action:** Use more specific ID-based selectors or unique ARIA roles to target form inputs in tests when ambiguity arises.
