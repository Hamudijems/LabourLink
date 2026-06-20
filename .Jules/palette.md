## 2025-05-15 - [useSearchParams and Suspense in Next.js 14]
**Learning:** In Next.js 14, using 'useSearchParams()' in a client component during static rendering triggers a bailout. To avoid this and ensure build stability, the component using the hook (or its specific logic) should be wrapped in a '<Suspense>' boundary.
**Action:** Extract search param logic into a child component or wrap the affected UI section in '<Suspense>' to maintain build compatibility and improve perceived performance with loading states.
