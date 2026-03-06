## 2025-05-15 - Improving Accessibility and Feedback in Auth Forms
**Learning:** Icon-only buttons (like password visibility toggles) must have dynamic `aria-label` values that reflect their current state to be accessible. Additionally, providing immediate visual feedback via loading spinners in submit buttons significantly improves the perceived speed and reliability of the application.
**Action:** Always include `aria-label` for icon buttons and use `Loader2` for all asynchronous button actions.
