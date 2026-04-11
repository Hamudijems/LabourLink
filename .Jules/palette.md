## 2025-05-14 - [Accessibility and Interaction Feedback in Auth Forms]
**Learning:** Icon-only buttons without aria-labels and lack of visual feedback during async operations (like ID verification or login) create a frustrating experience for screen reader users and sighted users alike. Additionally, Next.js 'useSearchParams' requires a Suspense boundary when used in client components to prevent build-time errors.
**Action:** Always provide 'aria-label' for icon buttons, use 'Loader2' with 'animate-spin' for async actions, and wrap components using 'useSearchParams' in a 'Suspense' boundary.
