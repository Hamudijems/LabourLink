## 2025-05-15 - Redirection and Toast Persistence
**Learning:** Using `window.location.href` for redirection in Next.js triggers a full page reload, which clears the global state of libraries like `sonner`, causing success toasts to disappear immediately before the user can read them.
**Action:** Always use `router.push()` from `next/navigation` in client components to maintain SPA-like navigation and ensure that toast notifications persist across page transitions.

## 2025-05-15 - Headless Browser State Synchronization
**Learning:** In headless Playwright environments, React state updates for form validation (e.g., enabling a 'Submit' button after filling inputs) may not trigger consistently with simple `.fill()` calls.
**Action:** Use `dispatch_event("input")` or `press_sequentially()` on input fields to ensure that React state listeners are correctly notified, and consider using `force=True` for button clicks if they remain visually disabled despite correct input.
