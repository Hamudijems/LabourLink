# Palette's Journal - SafeHire Ethiopia

## 2025-05-14 - Next.js 14 Suspense & A11y Wins
**Learning:** Using 'useSearchParams' in a client component in Next.js 14 requires a 'Suspense' boundary to prevent build-time errors during static generation. Additionally, providing ARIA labels for icon-only buttons and loading states for async actions significantly improves the experience for users with screen readers and provides much-needed feedback.
**Action:** Always wrap components using 'useSearchParams' in 'Suspense' and ensure all interactive icons have descriptive 'aria-label' attributes.
