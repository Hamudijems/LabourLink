## 2025-05-15 - [Dynamic ARIA Labels and Loading Indicators]
**Learning:** Icon-only toggle buttons (like password visibility) require dynamic `aria-label` attributes to correctly reflect their current state to screen readers. Standardizing loading indicators with `Loader2` from `lucide-react` provides a consistent and polished user experience across the application.
**Action:** Always provide `aria-label` to icon-only buttons and use `Loader2` for async operations in the UI.
