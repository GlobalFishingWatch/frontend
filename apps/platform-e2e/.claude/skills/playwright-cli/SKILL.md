---
name: playwright-cli
description: Automate browser interactions, test web pages and work with Playwright tests.
allowed-tools: Bash(playwright-cli:*) Bash(npx:*) Bash(npm:*)
---

# Browser Automation with playwright-cli

## Quick start

```bash
# open new browser
playwright-cli open
# navigate to a page
playwright-cli goto https://playwright.dev
# interact with the page using refs from the snapshot
playwright-cli click e15
playwright-cli type "page.click"
playwright-cli press Enter
# take a screenshot (rarely used, as snapshot is more common)
playwright-cli screenshot
# close the browser
playwright-cli close
```

## Commands

### Core

```bash
playwright-cli open
# open and navigate right away
playwright-cli open https://example.com/
playwright-cli goto https://playwright.dev
playwright-cli type "search query"
playwright-cli click e3
playwright-cli dblclick e7
# --submit presses Enter after filling the element
playwright-cli fill e5 "user@example.com"  --submit
playwright-cli drag e2 e8
# drop files or data onto an element (from outside the page)
playwright-cli drop e4 --path=./image.png
playwright-cli drop e4 --data="text/plain=hello world"
playwright-cli hover e4
playwright-cli select e9 "option-value"
playwright-cli upload ./document.pdf
playwright-cli check e12
playwright-cli uncheck e12
playwright-cli snapshot
# search the snapshot for text or a regexp, returns matching nodes with surrounding context
playwright-cli find "Sign in"
playwright-cli find --regex "Sign (in|up)"
# wrap the regexp in slashes to add flags, e.g. /i for case-insensitive
playwright-cli find --regex "/sign (in|up)/i"
playwright-cli eval "document.title"
playwright-cli eval "el => el.textContent" e5
# get element id, class, or any attribute not visible in the snapshot
playwright-cli eval "el => el.id" e5
playwright-cli eval "el => el.getAttribute('data-testid')" e5
playwright-cli dialog-accept
playwright-cli dialog-accept "confirmation text"
playwright-cli dialog-dismiss
playwright-cli resize 1920 1080
playwright-cli close
```

### Navigation

```bash
playwright-cli go-back
playwright-cli go-forward
playwright-cli reload
```

### Keyboard

```bash
playwright-cli press Enter
playwright-cli press ArrowDown
playwright-cli keydown Shift
playwright-cli keyup Shift
```

### Mouse

```bash
playwright-cli mousemove 150 300
playwright-cli mousedown
playwright-cli mousedown right
playwright-cli mouseup
playwright-cli mouseup right
playwright-cli mousewheel 0 100
```

### Save as

```bash
playwright-cli screenshot
playwright-cli screenshot e5
playwright-cli screenshot --filename=page.png
playwright-cli screenshot --hires
playwright-cli pdf --filename=page.pdf
```

### Tabs

```bash
playwright-cli tab-list
playwright-cli tab-new
playwright-cli tab-new https://example.com/page
playwright-cli tab-close
playwright-cli tab-close 2
playwright-cli tab-select 0
```

### Storage

```bash
playwright-cli state-save
playwright-cli state-save auth.json
playwright-cli state-load auth.json

# Cookies
playwright-cli cookie-list
playwright-cli cookie-list --domain=example.com
playwright-cli cookie-get session_id
playwright-cli cookie-set session_id abc123
playwright-cli cookie-set session_id abc123 --domain=example.com --httpOnly --secure
playwright-cli cookie-delete session_id
playwright-cli cookie-clear

# LocalStorage
playwright-cli localstorage-list
playwright-cli localstorage-get theme
playwright-cli localstorage-set theme dark
playwright-cli localstorage-delete theme
playwright-cli localstorage-clear

# SessionStorage
playwright-cli sessionstorage-list
playwright-cli sessionstorage-get step
playwright-cli sessionstorage-set step 3
playwright-cli sessionstorage-delete step
playwright-cli sessionstorage-clear
```

### Network

```bash
playwright-cli route "**/*.jpg" --status=404
playwright-cli route "https://api.example.com/**" --body='{"mock": true}'
playwright-cli route-list
playwright-cli unroute "**/*.jpg"
playwright-cli unroute
```

### DevTools

```bash
playwright-cli console
playwright-cli console warning
playwright-cli requests
playwright-cli request 5
playwright-cli run-code "async page => await page.context().grantPermissions(['geolocation'])"
playwright-cli run-code --filename=script.js
playwright-cli tracing-start
playwright-cli tracing-stop
playwright-cli video-start video.webm
playwright-cli video-chapter "Chapter Title" --description="Details" --duration=2000
playwright-cli video-stop

# annotate each subsequent action (click, type, ...) with a callout naming the action and highlighting the target
playwright-cli video-show-actions --duration=600 --position=top-right
playwright-cli video-hide-actions

# launch the dashboard for UI review / design feedback — user annotates the page, you receive the annotated screenshot, snapshot, and notes
playwright-cli show --annotate

# generate a Playwright locator for an element from its ref or selector
playwright-cli generate-locator e5 --raw

# show a persistent highlight overlay for an element, optionally with a custom style
playwright-cli highlight e5
playwright-cli highlight e5 --style="outline: 3px dashed red"
# hide a single element highlight, or all page highlights when no target is given
playwright-cli highlight e5 --hide
playwright-cli highlight --hide
```

## Raw output

The global `--raw` option strips page status, generated code, and snapshot sections from the output, returning only the result value. Use it to pipe command output into other tools. Commands that don't produce output return nothing.

```bash
playwright-cli --raw eval "JSON.stringify(performance.timing)" | jq '.loadEventEnd - .navigationStart'
playwright-cli --raw eval "JSON.stringify([...document.querySelectorAll('a')].map(a => a.href))" > links.json
playwright-cli --raw snapshot > before.yml
playwright-cli click e5
playwright-cli --raw snapshot > after.yml
diff before.yml after.yml
TOKEN=$(playwright-cli --raw cookie-get session_id)
playwright-cli --raw localstorage-get theme
```

For structured output wrapping every reply as JSON, pass --json

```bash
playwright-cli list --json
```

## Open parameters

```bash
# Use specific browser when creating session
playwright-cli open --browser=chrome
playwright-cli open --browser=firefox
playwright-cli open --browser=webkit
playwright-cli open --browser=msedge

# Emulate a generic mobile device (Pixel 10 for Chromium, iPhone 17 for WebKit).
# Prefer this when a mobile layout is acceptable: mobile pages are usually
# lighter, so snapshots are smaller and cheaper.
playwright-cli open --mobile
playwright-cli open --device="iPhone 15"

# Use persistent profile (by default profile is in-memory)
playwright-cli open --persistent
# Use persistent profile with custom directory
playwright-cli open --profile=/path/to/profile

# Connect to browser via Playwright Extension
playwright-cli attach --extension=chrome

# Connect to a running Chrome or Edge by channel name
playwright-cli attach --cdp=chrome
playwright-cli attach --cdp=msedge

# Connect to a running browser via CDP endpoint
playwright-cli attach --cdp=http://localhost:9222

# Start with config file
playwright-cli open --config=my-config.json

# Close the browser
playwright-cli close
# Detach from an attached browser (leaves the external browser running)
playwright-cli -s=msedge detach
# Delete user data for the default session
playwright-cli delete-data
```

## URLs with `&` on Windows

On Windows, `cmd.exe` and PowerShell treat `&` as a command separator, so URLs with multiple query parameters get truncated before `playwright-cli` runs. Escape `&` with `^&` in `cmd.exe`, or use `--%` in PowerShell:

```batch
playwright-cli goto "https://example.com/?a=1^&b=2"
```

```powershell
playwright-cli --% goto "https://example.com/?a=1&b=2"
```

## Snapshots

After each command, playwright-cli provides a snapshot of the current browser state.

```bash
> playwright-cli goto https://example.com
### Page
- Page URL: https://example.com/
- Page Title: Example Domain
### Snapshot
[Snapshot](.playwright-cli/page-2026-02-14T19-22-42-679Z.yml)
```

You can also take a snapshot on demand using `playwright-cli snapshot` command. All the options below can be combined as needed.

```bash
# default - save to a file with timestamp-based name
playwright-cli snapshot

# save to file, use when snapshot is a part of the workflow result
playwright-cli snapshot --filename=after-click.yaml

# snapshot an element instead of the whole page
playwright-cli snapshot "#main"

# limit snapshot depth for efficiency, take a partial snapshot afterwards
playwright-cli snapshot --depth=4
playwright-cli snapshot e34

# include each element's bounding box as [box=x,y,width,height]
playwright-cli snapshot --boxes

# search a large snapshot instead of capturing it all — returns matching nodes
# with 3 lines of context around each match (like grep -C)
playwright-cli find "Add to cart"
playwright-cli find --regex "\\$[0-9]+\\.[0-9]{2}"
```

## Targeting elements

By default, use refs from the snapshot to interact with page elements.

```bash
# get snapshot with refs
playwright-cli snapshot

# interact using a ref
playwright-cli click e15
```

You can also use Playwright locators or css selectors.

```bash
# role locator (preferred)
playwright-cli click "getByRole('button', { name: 'Submit' })"

# test id (only when no readable locator exists — see priority below)
playwright-cli click "getByTestId('submit-button')"

# css selector (last resort)
playwright-cli click "#main > button.submit"
```

### Locator priority

Refs (`e15`) are only for driving the CLI session. Anything written into a spec or Page Object
(`src/pages/*`) must be a Playwright locator, chosen in the order
[Playwright recommends](https://playwright.dev/docs/locators#quick-guide). Take the first one
that uniquely identifies the element:

| #   | Locator                     | Use for                                                                                                                           |
| --- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `getByRole(role, { name })` | Anything with an ARIA role: buttons, links, headings, textboxes, checkboxes, dialogs, tabs, menu items, rows. **Default choice.** |
| 2   | `getByText(text)`           | Non-interactive content: `div`, `span`, `p` with visible text.                                                                    |
| 3   | `getByLabel(text)`          | Form controls with an associated `<label>` or `aria-label`.                                                                       |
| 4   | `getByPlaceholder(text)`    | Inputs with a placeholder and no label.                                                                                           |
| 5   | `getByAltText(text)`        | Images and `area` elements.                                                                                                       |
| 6   | `getByTitle(text)`          | Elements identified by a `title` attribute.                                                                                       |
| 7   | `getByTestId(id)`           | **Fallback only** — no readable option above is unique or stable.                                                                 |
| 8   | `locator(css/xpath)`        | Last resort. Avoid; it couples the test to DOM structure and styling.                                                             |

**Do not reach for `getByTestId` when a role-based locator works.** Before writing one, check the
snapshot: if the node shows a role and an accessible name (`button "Close"`,
`heading "Vessel report"`), use `getByRole`. `generate-locator` may return `getByTestId` even
when a readable option exists — treat its output as a suggestion, not the answer.

**Readability beats hierarchy.** The table ranks _readable_ options. A locator higher in it that
no longer says what the element is does not count as better. Keep a descriptive test id (or
existing locator) instead of a role locator that is generic, structural or positional:

```typescript
// Keep — the test id names the thing
page.getByTestId('vv-vessel-name')
vesselsTable.getByTestId('link-vessel-profile').first()

// Don't "upgrade" to — higher in the table, but says nothing about what is located
page.getByRole('heading', { level: 1 })
vesselsTable.getByRole('link').first()
page.getByTestId('map-popup-wrapper').getByRole('table')
```

A role locator wins only when its role + name reads like the UI: `getByRole('button', { name:
'See vessels' })`. When reviewing existing locators, propose a change only if the new one is at
least as readable, and ask before applying it.

Making a role locator unique, before falling back to a test id:

```typescript
// Scope to a landmark / container with its own role instead of a test id on the target
page.getByRole('dialog', { name: 'Download' }).getByRole('button', { name: 'Confirm' })

// Exact match when one name is a prefix of another ("Report" vs "Report area")
page.getByRole('button', { name: 'Report', exact: true })

// Narrow a list item by its content
page
  .getByRole('listitem')
  .filter({ hasText: 'Fishing effort' })
  .getByRole('button', { name: 'Remove' })

// Heading level, checked/expanded/selected state
page.getByRole('heading', { name: 'Activity', level: 2 })
page.getByRole('tab', { name: 'Vessels', selected: true })
```

`getByTestId` is legitimate when the element has no accessible role or name and adding one isn't
the right fix — e.g. the deck.gl map canvas, a timebar handle, a purely visual container. If an
interactive element (a button, a toggle) has no accessible name, that is an accessibility bug in
the app: prefer adding an `aria-label` in `apps/platform` over adding a `data-testid`.

Avoid `.first()` / `.nth()` to silence a strict-mode violation — scope or filter instead, so the
locator still says _which_ element it means.

## Browser Sessions

```bash
# create new browser session named "mysession" with persistent profile
playwright-cli -s=mysession open example.com --persistent
# same with manually specified profile directory (use when requested explicitly)
playwright-cli -s=mysession open example.com --profile=/path/to/profile
playwright-cli -s=mysession click e6
playwright-cli -s=mysession close  # stop a named browser
playwright-cli -s=mysession delete-data  # delete user data for persistent session

playwright-cli list
# Close all browsers
playwright-cli close-all
# Forcefully kill all browser processes
playwright-cli kill-all
```

## Installation

If global `playwright-cli` command is not available, try a local version via `npx playwright cli`:

```bash
npx --no-install playwright --version
```

When local version is available, use `npx playwright cli` in all commands. Otherwise, install `playwright-cli` as a global command:

```bash
npm install -g @playwright/cli@latest
```

## Example: Form submission

```bash
playwright-cli open https://example.com/form
playwright-cli snapshot

playwright-cli fill e1 "user@example.com"
playwright-cli fill e2 "password123"
playwright-cli click e3
playwright-cli snapshot
playwright-cli close
```

## Example: Multi-tab workflow

```bash
playwright-cli open https://example.com
playwright-cli tab-new https://example.com/other
playwright-cli tab-list
playwright-cli tab-select 0
playwright-cli snapshot
playwright-cli close
```

## Example: Debugging with DevTools

```bash
playwright-cli open https://example.com
playwright-cli click e4
playwright-cli fill e7 "test"
playwright-cli console
playwright-cli requests
playwright-cli close
```

```bash
playwright-cli open https://example.com
playwright-cli tracing-start
playwright-cli click e4
playwright-cli fill e7 "test"
playwright-cli tracing-stop
playwright-cli close
```

## Example: Interactive session

Ask the user for UI review or design feedback. The user draws boxes on the live page and types comments; you receive the annotated screenshot, the snapshot of the marked region, and the user's notes. Use this whenever the user asks for "UI review", "design feedback", or to "ask the user what they think / want / mean":

```bash
playwright-cli open https://example.com
playwright-cli show --annotate
```

## Specific tasks

- **Running and Debugging Playwright tests** [references/playwright-tests.md](references/playwright-tests.md)
- **Request mocking** [references/request-mocking.md](references/request-mocking.md)
- **Running Playwright code** [references/running-code.md](references/running-code.md)
- **Browser session management** [references/session-management.md](references/session-management.md)
- **Storage state (cookies, localStorage)** [references/storage-state.md](references/storage-state.md)
- **Test generation (plan / generate / heal)** [references/test-generation.md](references/test-generation.md)
- **Tracing** [references/tracing.md](references/tracing.md)
- **Video recording** [references/video-recording.md](references/video-recording.md)
- **Inspecting element attributes** [references/element-attributes.md](references/element-attributes.md)
