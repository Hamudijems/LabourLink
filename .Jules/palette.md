## 2025-05-22 - Accessible Dynamic List Management
**Learning:** Icon-only buttons for adding or removing items from dynamic lists (e.g., skills, business sections) are common in this app but often lack descriptive context for screen readers. Using generic labels like "Remove" is insufficient when multiple items exist.
**Action:** Always include the item name in the `aria-label` for removal buttons (e.g., `aria-label={\`Remove ${item} skill\`}`) to provide clear context for assistive technologies.
