## 2025-05-14 - [Next.js 14 Suspense Requirement for useSearchParams]
**Learning:** In Next.js 14, using `useSearchParams` in a Client Component during static rendering triggers a build error unless it is wrapped in a `<Suspense>` boundary. This is because `useSearchParams` bails out of static rendering.
**Action:** Always wrap components using `useSearchParams` in a `<Suspense>` boundary to ensure production build stability and provide a better loading experience.

## 2025-05-14 - [Accessible Dynamic Lists]
**Learning:** Icon-only buttons for adding/removing items in dynamic lists (like skills) are common but often lack proper ARIA labels. Adding descriptive labels like `aria-label={`Remove ${item}`}` significantly improves the experience for screen reader users.
**Action:** Ensure all icon-only buttons in dynamic lists have context-specific ARIA labels and appropriate hover/active states for visual feedback.
