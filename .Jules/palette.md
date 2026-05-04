## 2025-05-22 - [Fayda ID Verification & Accessibility]
**Learning:** In Next.js 14, using `useSearchParams` outside of a `Suspense` boundary triggers a build-time bail-out of static rendering for the entire page. Moving it to a small, focused child component (SearchParamsLoader) maintains the page's ability to be statically generated while still handling dynamic URL parameters.
**Action:** Always wrap `useSearchParams` logic in a separate component within a `<Suspense>` boundary to optimize performance and prevent build errors.
