# Palette's Journal - Critical UX & Accessibility Learnings

This journal is used to record critical UX and accessibility learnings discovered during development.

---
## 2024-05-20 - Next.js 14 CSR Bailout with useSearchParams
**Learning:** In Next.js 14, using `useSearchParams()` in a client component without a `Suspense` boundary causes a build error during static generation because it bails out to client-side rendering.
**Action:** Always wrap components using `useSearchParams()` in a `Suspense` boundary to ensure the page can be prerendered correctly and only the search-dependent part is deferred to the client.
