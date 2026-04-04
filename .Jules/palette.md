## 2025-05-22 - Accessibility in Dynamic Lists
**Learning:** Icon-only buttons used for adding or removing items in dynamic lists (like skills or business sections) were missing descriptive ARIA labels, making them unusable for screen reader users who would only hear 'button'.
**Action:** Always provide specific 'aria-label' attributes for icon-only buttons that describe the action and the item they affect (e.g., 'Remove skill Carpentry').
