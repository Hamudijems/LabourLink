## 2025-05-15 - Themed feedback and accessible lists
**Learning:** In multi-step forms, providing immediate visual feedback for intermediate successes (like ID verification) using themed alerts (e.g., green for success) helps anchor the user's progress. Additionally, icon-only buttons in dynamic lists (like "remove" buttons) MUST include item-specific ARIA labels to maintain context for screen reader users.
**Action:** Use the `Alert` component with `CheckCircle2` for async success states and ensure all `X` buttons in lists have descriptive `aria-label={\`Remove \${item}\`}`.
