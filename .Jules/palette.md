## 2024-05-22 - [Enhanced Admin Login Accessibility & Feedback]
**Learning:** Icon-only buttons (like password toggles) must have dynamic ARIA labels to communicate state changes to screen readers. Adding a dedicated loading state with both an icon and text improves perceived performance and clarifies that an action is in progress.
**Action:** Always include `aria-label` for icon buttons and use `Loader2` for async button states.
