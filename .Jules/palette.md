## 2024-05-24 - Accessible feedback in complex forms
**Learning:** In multi-step forms with async third-party verification (like Fayda ID), users need immediate visual feedback (spinners) and screen-reader context (ARIA labels) for icon-only actions to navigate the flow confidently.
**Action:** Always provide `aria-label` for icon-only buttons and include loading spinners with descriptive text for async submission buttons.
