## 2025-05-22 - [Next.js Build Failure with useSearchParams]
**Learning:** Next.js client components using the 'useSearchParams' hook must be wrapped in a 'Suspense' boundary to prevent build errors during static page generation. This is a common pattern in Next.js 14+ that improves UX by allowing parts of the page to load independently.
**Action:** Always check if 'useSearchParams' is used in a page component and ensure it is wrapped in 'Suspense'.

## 2025-05-22 - [Accessibility in Dynamic Lists]
**Learning:** Dynamic lists with add/remove functionality (like skills or sections) need explicit accessibility attributes. Inputs need 'id' and 'Label' needs 'htmlFor'. Removal buttons should have 'aria-label' that includes the specific item being removed for screen reader clarity.
**Action:** Apply 'id', 'htmlFor', and specific 'aria-label' to all dynamic list management UI.
