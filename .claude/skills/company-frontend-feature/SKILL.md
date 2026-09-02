---
name: company-frontend-feature
description: Frontend implementation conventions for Vite React and shadcn/ui work in this repository. Use for pages, components, TanStack Query integrations, forms, and user-facing flows.
---

# Frontend feature change

Follow root and `apps/web/AGENTS.md` rules.

## Checklist

- Inspect the existing feature structure first.
- Use existing shadcn/ui primitives before creating new primitives.
- Keep API calls out of visual primitives.
- Use TanStack Query for server state.
- Use Zustand only for client-only shared state with a concrete need.
- Handle loading, error, empty, and success states intentionally.
- Keep API data typed and synchronized with backend contracts.
- Preserve semantic HTML, accessible names, keyboard use, and focus behavior.
- Prevent duplicate submissions where appropriate.

## Testing

Add focused tests for meaningful UI logic. For user-facing changes, browser-test the primary happy path plus important error/empty behavior when tooling is available.

## Verification

```bash
pnpm --dir apps/web lint
pnpm --dir apps/web test
pnpm --dir apps/web build
```

Report changed user flows, browser evidence, accessibility concerns, API impact, and known limitations in the human handoff.
