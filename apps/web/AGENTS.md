# Frontend AGENTS.md

These rules extend the repository root `AGENTS.md` for `apps/web`.

## React boundaries

- Organize business UI by feature.
- Prefer composition over large all-purpose components.
- Keep API calls in a feature/data layer rather than visual primitives.
- Use existing shadcn/ui primitives before creating replacements.

## State

Use:

```text
TanStack Query -> server/API state
Zustand        -> client-only shared state
React state    -> local component state
```

Do not mirror TanStack Query server data into Zustand without a specific documented reason.

## UX requirements

Every asynchronous user flow must intentionally handle:

- loading
- error
- empty
- success

User actions should provide clear feedback and prevent accidental duplicate submissions where appropriate.

## API integration

- Consume the NestJS API; never access PostgreSQL directly.
- Treat API responses as external data.
- Keep API contracts typed.
- When backend contracts change, update affected frontend integrations in the same feature unless explicitly scoped otherwise.

## Accessibility

- Prefer semantic HTML.
- Interactive controls need accessible names.
- Keyboard behavior must remain usable.
- Do not remove focus indicators without an accessible replacement.

## Testing

For logic-heavy components/hooks, add focused tests where valuable.
For user-facing feature changes, browser-test the primary happy path and relevant failure/empty states when tooling is available.

Before handoff, run:

```bash
pnpm --dir apps/web lint
pnpm --dir apps/web test
pnpm --dir apps/web build
```

## Completion evidence

Frontend handoff should mention changed flows, loading/error handling, browser verification, accessibility concerns, and API contract impact.
