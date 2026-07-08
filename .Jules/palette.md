## 2025-05-15 - Next.js useSearchParams Suspense Requirement
**Learning:** Components using 'useSearchParams' in Next.js 14 must be wrapped in a 'Suspense' boundary to avoid build-time errors and ensure proper hydration during static optimization. Failing to do so causes the 'pnpm build' to fail with a 'missing-suspense-with-csr-bailout' error.
**Action:** Always wrap client components consuming search parameters in a 'Suspense' boundary at the page level or higher.
