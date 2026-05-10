## 2024-05-20 - [Next.js 14 Build Stability and Suspense]
**Learning:** Next.js 14 production builds fail for routes using `useSearchParams` if they are not wrapped in a `Suspense` boundary. This is a common pattern for de-optimizing the page to client-side rendering for search parameters.
**Action:** Always wrap components using `useSearchParams` in a `Suspense` boundary. For large pages, extract the logic into a `SearchParamsHandler` or a child content component to keep the page structure clean.

## 2024-05-20 - [A11y: Dynamic Aria Labels for Interactive Toggles]
**Learning:** Icon-only toggle buttons (like password visibility) require dynamic `aria-label` values that reflect the *action* or *new state* (e.g., "Show password" vs. "Hide password") to be truly accessible to screen readers.
**Action:** Use conditional logic in `aria-label` for all icon-only toggle buttons to provide clear context on the button's function at any given moment.
