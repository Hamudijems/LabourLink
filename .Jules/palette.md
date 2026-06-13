## 2025-05-22 - Next.js 14 useSearchParams and Suspense
**Learning:** In Next.js 14, using 'useSearchParams' in a client component that is part of a statically prerendered page will cause a build error unless it is wrapped in a '<Suspense>' boundary. This is due to the client-side search params necessitating a bailout from static rendering.
**Action:** Always wrap 'useSearchParams' logic into a small side-effect component (e.g., 'SignupSearchParams') that takes necessary state setters as props and wrap it in a '<Suspense fallback={null}>' boundary at the page level.

## 2025-05-22 - Dynamic List Accessibility and Validation
**Learning:** Icon-only buttons for adding or removing items from dynamic lists (e.g., skills, categories) are common UX patterns but often lack accessibility and proper validation. Screen readers cannot interpret 'Plus' or 'X' icons without ARIA labels, and allowing empty entries clutters the UI state.
**Action:** Always provide descriptive 'aria-label' attributes that include the item name (e.g., 'Remove React') and disable 'Add' buttons if the input is empty or contains only whitespace using '.trim()'.
