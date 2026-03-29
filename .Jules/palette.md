## 2026-03-29 - Global Toaster and Form Interactivity
**Learning:** In this Next.js app, using standard browser `alert()` for success notifications breaks the flow and feels dated. Implementing a global `Toaster` in the root layout (within `AuthProvider`) allows for non-blocking, pleasant feedback. Additionally, when using `sonner` toasts, programmatic navigation with `next/navigation`'s `useRouter` is preferred over `window.location.href` as it prevents a full page reload which would clear the toaster state.
**Action:** Always check `app/layout.tsx` for a global notification system before adding one. Prefer `sonner` for multi-step forms.

## 2026-03-29 - Accessibility for Dynamic Form Elements
**Learning:** Icon-only buttons for adding/removing items in dynamic lists (like skills) are common in this app but often lack descriptive `aria-label` attributes. Screen readers only hear "button" or "plus/X" without context.
**Action:** Ensure all dynamic list interaction buttons have clear ARIA labels (e.g., `aria-label="Add skill"` and `aria-label={remove skill ${skill}}`).
