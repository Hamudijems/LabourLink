## 2025-05-22 - Contextual ARIA Labels for Dynamic Lists
**Learning:** Removal buttons in dynamic lists need item-specific labels (e.g., 'Remove React') rather than generic ones (e.g., 'Remove item') to provide necessary context for screen reader users when multiple identical icons are present.
**Action:** Always use template literals to inject item names into aria-labels for list management buttons in dynamic lists.
