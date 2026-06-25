## 2024-05-24 - [Next.js 14 Build Stability]
**Learning:** In Next.js 14, using `useSearchParams()` without a surrounding `Suspense` boundary triggers a build error during static rendering (missing-suspense-with-csr-bailout).
**Action:** Always wrap components consuming `useSearchParams()` in a `Suspense` boundary, preferably with a themed loading fallback to maintain UX consistency during hydration.

## 2024-05-24 - [Interactive List Accessibility]
**Learning:** Users often expect "Enter" to add items to dynamic lists (skills, tags); providing a disabled state for the "Add" button when the input is empty prevents invalid entries and guides the user.
**Action:** Implement `onKeyDown` (replacing deprecated `onKeyPress`) handlers for "Enter" alongside explicit button `disabled` logic and descriptive `aria-label` including item context.
