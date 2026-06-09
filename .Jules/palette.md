## 2025-03-24 - Accessible Dynamic List Entry
**Learning:** Icon-only buttons for adding or removing items from dynamic lists (e.g., skills, tags) are common but often lack proper screen reader context and input validation. Providing specific ARIA labels that include the item name for removal and disabling the add button when the input is empty significantly improves both accessibility and the "feel" of the form.
**Action:** Always include `aria-label` on icon buttons in dynamic lists and ensure "Add" buttons are disabled for empty/whitespace-only inputs to prevent invalid state.
