## 2025-03-24 - [Accessibility & Feedback in Auth Forms]
**Learning:** Icon-only buttons (like password visibility toggles) MUST have descriptive ARIA labels that update with their state. Additionally, providing visual feedback via spinners (like Loader2) during async operations significantly improves the perceived responsiveness of authentication forms.
**Action:** Always include 'aria-label' on icon buttons and use 'Loader2' with 'animate-spin' for 'isLoading' states in all new or modified form components.
