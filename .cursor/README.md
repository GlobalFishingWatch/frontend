# Cursor setup (GFW frontend)

Project extensions for Cursor’s **Customize** page (rules, skills, commands, hooks, subagents, MCP).

## Already wired

| Kind | Location |
| --- | --- |
| Rules | `.cursor/rules/*.mdc` |
| Skills | `.cursor/skills/*` (Nx + encode/decode-url + playwright-cli + monitor-ci) |
| Commands | `.cursor/commands/` (`/unit-test`, `/review`, `/mermaid`, `/monitor-ci`) |
| Hooks | `.cursor/hooks.json` + `.cursor/hooks/` |
| Subagents | `.cursor/agents/` (`ci-monitor-subagent`, plus examples) |
| MCP example | `.cursor/mcp.json.example` |

## MCP (no secrets in git)

`.cursor/mcp.json` is **gitignored**. Copy the example and authenticate locally:

```bash
cp .cursor/mcp.json.example .cursor/mcp.json
```

- **Sentry**: OAuth URL `https://mcp.sentry.dev/mcp` — sign in via Cursor; do **not** put auth tokens in JSON.
- **GFW**: set `GFW_MCP_ENTRY` to your local entry script (absolute path), e.g. in `~/.zshrc`:
  `export GFW_MCP_ENTRY="/absolute/path/to/mcp-gfw/main.ts"`
- Restart Cursor (or reload MCP) after changing env vars.

Never commit tokens. Prefer OAuth / `${env:VAR}` over hardcoding.

## Nx plugin (Customize page)

Install/enable the **Nx** Cursor plugin from the marketplace if not already enabled. It pairs with:

- Skills: `nx-workspace`, `nx-generate`, `nx-run-tasks`, `nx-plugins`, `nx-import`, `link-workspace-packages`, `monitor-ci`
- Subagent: `ci-monitor-subagent`
- Command: `/monitor-ci`
- Always-apply Nx notes also live in root `AGENTS.md`

Run tasks with `pnpm nx …` only.

## Subagent examples

`platform-reviewer`, `map-debugger`, and `ui-components-reviewer` are starter templates — edit or delete as the team’s workflows settle.

## Built-in reviews

For pre-push automated review, use Cursor’s `/review-bugbot` and `/review-security`. Project `/review` is a manual, repo-aware checklist.
