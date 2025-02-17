# @globalfishingwatch/api-client

A TypeScript client library for interacting with the Global Fishing Watch API.

## Features

- Authentication management (login, logout, token refresh)
- HTTP request handling with automatic token refresh
- File downloads
- Advanced search query building
- Configurable request tracks thinning
- Fetch request [options](https://github.com/GlobalFishingWatch/frontend/blob/master/libs/api-client/src/api-client.ts#L37)

## Installation

```bash
yarn add @globalfishingwatch/api-client
```

## Usage

```typescript
// Basic GET request
const data = await GFWAPI.fetch('/endpoint')

// POST request with body
const response = await GFWAPI.fetch('/endpoint', {
  method: 'POST',
  body: { key: 'value' },
})

// Download file
await GFWAPI.download('download-url', 'filename.pdf')
```

## Environment Variables

The library supports the following environment variables:

- `API_GATEWAY`
- `API_GATEWAY_VERSION`

## License

MIT
