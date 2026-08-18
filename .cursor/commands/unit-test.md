# Write unit tests (Vitest + Nx)

Create or update unit tests for the current code using this monorepo’s conventions.

## Stack

- Runner: **Vitest** via Nx (`pnpm nx test <project>`)
- Prefer existing patterns in the same project (`*.spec.ts`, `*.test.ts`, `vitest.config.ts`)
- Testing Library for React components when the project already uses it

## Steps

1. Identify the Nx project for the file under test (`pnpm nx show projects` / nx-workspace skill).
2. Find an existing sibling test file and mirror its imports, setup, and naming.
3. Cover public behavior: happy path, edge cases, error paths.
4. Mock network/API boundaries; do not hit real GFW APIs.
5. Run: `pnpm nx test <project> --testPathPattern=<name>` (or the project’s Vitest equivalent flags).

## Checklist

- [ ] Matches project Vitest/Nx setup (not Jest unless that project still uses it)
- [ ] Descriptive test names
- [ ] Arrange–Act–Assert
- [ ] Mocks for `@globalfishingwatch/api-client` / RTK Query where needed
- [ ] Tests are independent and deterministic
- [ ] Command to re-run tests included in the reply
