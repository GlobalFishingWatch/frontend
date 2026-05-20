# @globalfishingwatch/url-workspace

Serialize and deserialize GFW map workspace state to/from URL query strings.

## Features

- **Parse** — converts a URL query string into a typed workspace object
- **Stringify** — converts a workspace object back to a query string

## Usage

```ts
import { parseWorkspace, stringifyWorkspace } from '@globalfishingwatch/url-workspace'

// Parse URL search string → workspace object
const workspace = parseWorkspace(window.location.search)

// Modify and serialize back
const qs = stringifyWorkspace({ ...workspace, zoom: 4 })
```

### Custom transformations

`parseWorkspace` accepts an optional second argument to override or extend value parsing per param key:

```ts
const workspace = parseWorkspace(search, {
  myCustomParam: (value) => JSON.parse(value),
})
```
