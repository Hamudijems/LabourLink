## 2025-05-15 - Accessibility pattern for icon-only buttons
**Learning:** Found multiple icon-only buttons (Plus, X, Eye) without descriptive aria-labels, which makes them inaccessible to screen reader users. In Next.js 14, using useSearchParams without a Suspense boundary can cause build failures.
**Action:** Always provide aria-label for icon-only buttons. Wrap components using useSearchParams in a Suspense boundary to ensure build stability and better UX.
