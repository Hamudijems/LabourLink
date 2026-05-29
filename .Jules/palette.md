## 2024-05-29 - Enhancing Fayda ID Verification UX
**Learning:** In Next.js 14, components using `useSearchParams()` must be wrapped in a `<Suspense>` boundary to avoid build-time errors and ensure client-side stability. Immediate visual feedback for asynchronous verification (like Fayda ID) via loading spinners and success alerts significantly improves the perceived reliability of the identity check.
**Action:** Always wrap `useSearchParams` consumers in `Suspense` and follow the `bg-green-50 border-green-200 text-green-800` pattern for success alerts in this application.
