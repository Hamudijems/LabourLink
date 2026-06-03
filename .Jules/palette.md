## 2025-05-15 - [Signup Flow Polishing & Build Stability]
**Learning:** Next.js 14 requires `useSearchParams` to be wrapped in a `Suspense` boundary for production builds. Failing to do so causes a build error during static generation. Additionally, immediate visual feedback (success alerts) after async identity verification significantly improves user confidence in multi-step forms.

**Action:** Always wrap `useSearchParams` logic in a dedicated side-effect component within a `Suspense` boundary. Use themed alerts (green for success) to confirm identity verification before proceeding to personal details.
