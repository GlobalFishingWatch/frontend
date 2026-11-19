import { vi } from 'vitest'
import { commands } from 'vitest/browser'

import { GFWAPI } from '@globalfishingwatch/api-client'

/**
 * Network stub for the integration specs.
 *
 * WHY `globalThis.fetch` and not `GFWAPI.fetch`: GFWAPI calls the global `fetch` for every request,
 * so stubbing one level below it keeps GFWAPI's own logic real (auth headers, status handling, the
 * `'vessel'` protobuf decode, retries). It also keeps the `vi.spyOn(GFWAPI, 'fetch')` spies in the
 * specs working, and catches loaders.gl, pmtiles and i18next, which call `fetch` directly.
 *
 * Requests to the API gateway and jsDelivr are answered, in this order, by:
 * 1. a handler: `mockApi.use()` in the spec, then the defaults in ./handlers;
 * 2. a recorded response in test/fixtures/api/recorded (GET only);
 * 3. nothing: the request is recorded as a leak and rejected, and the test fails.
 *
 * Same-origin requests (Vite modules, locales, sprites) and static public tiles pass through.
 *
 * VITEST_RECORD=true replaces step 2: a GET no handler answers is forwarded to the real API and
 * saved. Other methods are never forwarded, so recording cannot write to the backend.
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type MockRequest = {
  url: URL
  method: HttpMethod
  params: Record<string, string>
  init?: RequestInit
}

export type Resolver = (request: MockRequest) => Response | Promise<Response>

export type Handler = {
  method: HttpMethod
  path: string
  /** Exact values the query must contain, or a predicate. Parameter order never matters. */
  query?: Record<string, string> | ((search: URLSearchParams) => boolean)
  resolve: Resolver
}

type CompiledHandler = Handler & { pathRegExp: RegExp; paramNames: string[] }

// Same-origin and static public files: never part of what a spec asserts on.
const PASSTHROUGH_HOSTS = new Set(['storage.googleapis.com', 'fonts.gstatic.com'])
const MOCKED_EXTERNAL_HOSTS = new Set(['cdn.jsdelivr.net'])

export const IS_RECORD_MODE = import.meta.env.VITEST_RECORD === 'true'
/** The token appTestUtils' render() stores for `authenticated: true` outside record mode */
export const INTEGRATION_TEST_TOKEN = 'integration-test-token'
// VITEST_NETWORK_DEBUG=true logs every external request, how it was routed and how it settled.
const IS_DEBUG = import.meta.env.VITEST_NETWORK_DEBUG === 'true'

/** Relative to apps/platform, where vitest's file commands resolve paths. */
const RECORDINGS_DIR = 'test/fixtures/api/recorded'

const realFetch = globalThis.fetch.bind(globalThis)

/** The unstubbed fetch. Only for record mode: handlers that capture something from the real API. */
export const fetchFromNetwork: typeof fetch = (input, init) => realFetch(input, init)

let defaultHandlers: CompiledHandler[] = []
let testHandlers: CompiledHandler[] = []
let unmockedRequests: string[] = []
// Unanswered requests the app may still cancel (see `unmocked`)
let pendingUnmocked: { description: string; cancelled: boolean }[] = []
const passedThroughHosts = new Set<string>()

function debugLog(route: string, method: string, url: URL, outcome: Promise<Response>) {
  if (!IS_DEBUG) return outcome
  return outcome.then(
    (response) => {
      console.log(`[network] ${route} ${method} ${url.href} → ${response.status}`)
      return response
    },
    (error: unknown) => {
      console.log(`[network] ${route} ${method} ${url.href} ✗ ${String(error)}`)
      throw error
    }
  )
}

function compile(handler: Handler): CompiledHandler {
  const paramNames: string[] = []
  const source = handler.path
    .split('/')
    .map((segment) => {
      if (segment === '*') return '.*'
      if (segment.startsWith(':')) {
        paramNames.push(segment.slice(1))
        return '([^/]+)'
      }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    })
    .join('/')
  return { ...handler, pathRegExp: new RegExp(`^${source}$`), paramNames }
}

function getGatewayHost() {
  try {
    return new URL(GFWAPI.baseUrl).host
  } catch {
    return undefined
  }
}

function isGatewayHost(host: string) {
  // The satellite basemap hard-codes the dev gateway, whatever VITE_API_GATEWAY says.
  return host === getGatewayHost() || /^gateway\.[\w.-]*globalfishingwatch\.org$/.test(host)
}

function matchQuery(query: Handler['query'], search: URLSearchParams) {
  if (!query) return true
  if (typeof query === 'function') return query(search)
  return Object.entries(query).every(([key, value]) => search.get(key) === value)
}

function findHandler(request: Omit<MockRequest, 'params'>) {
  // Test handlers win over defaults, and later registrations win over earlier ones.
  const candidates = [...testHandlers].reverse().concat([...defaultHandlers].reverse())
  for (const handler of candidates) {
    if (handler.method !== request.method) continue
    const match = handler.pathRegExp.exec(request.url.pathname)
    if (!match || !matchQuery(handler.query, request.url.searchParams)) continue
    const params = Object.fromEntries(
      handler.paramNames.map((name, i) => [name, decodeURIComponent(match[i + 1])])
    )
    return { handler, params }
  }
  return undefined
}

function describeRequest(method: string, url: URL) {
  return `${method} ${url.host}${url.pathname}${url.search}`
}

function rejectOnAbort(promise: Promise<Response>, signal?: AbortSignal | null) {
  if (!signal) return promise
  if (signal.aborted) return Promise.reject(signal.reason)
  return new Promise<Response>((resolve, reject) => {
    signal.addEventListener('abort', () => reject(signal.reason), { once: true })
    promise.then(resolve, reject)
  })
}

/**
 * Map tiles (`…/{z}/{x}/{y}`) that were not recorded are answered with an empty tile instead of
 * failing the test. Views that animate the camera (fit to a track or an area) request whichever
 * tiles the animation passes through, which depends on its timing and so differs between the live
 * recording and a replay. No spec asserts on those intermediate tiles.
 *
 * Everything else stays strict — including `/4wings/interaction/…/{col}/{row}`, whose path also ends
 * in numbers but whose response (the vessels in a clicked cell) is what specs assert on.
 */
function isMapTileRequest(url: URL) {
  return (
    !url.pathname.includes('/4wings/interaction/') &&
    /\/(context-layers|user-context-layers|tile\/[\w-]+)\/\d+\/\d+\/\d+$/.test(url.pathname)
  )
}

/**
 * A request nothing answers. With an AbortSignal it stays pending, as it would on a slow network:
 * the app cancels many requests it no longer needs (a search replaced by the next keystroke, the
 * 4wings cells a hover passes over on its way to a click). The live recording never saves those —
 * they never complete — so failing them on sight reported leaks the app would have dropped anyway.
 * Only a request still pending when the test ends is a leak (assertNoUnmockedRequests).
 * Without a signal nothing can cancel it, so it fails right away.
 */
function unmocked(method: string, url: URL, signal?: AbortSignal | null) {
  const description = describeRequest(method, url)
  if (signal) {
    const entry = { description, cancelled: false }
    pendingUnmocked.push(entry)
    return debugLog(
      'UNMOCKED',
      method,
      url,
      new Promise<Response>((_, reject) => {
        const cancel = () => {
          entry.cancelled = true
          reject(signal.reason)
        }
        if (signal.aborted) cancel()
        else signal.addEventListener('abort', cancel, { once: true })
      })
    )
  }
  unmockedRequests.push(description)
  return debugLog(
    'UNMOCKED',
    method,
    url,
    Promise.reject(new TypeError(`Unmocked request: ${description}`))
  )
}

async function stubbedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const href = input instanceof Request ? input.url : input.toString()
  const url = new URL(href, window.location.href)
  const method = (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase()
  const signal = init?.signal ?? (input instanceof Request ? input.signal : null)

  if (url.origin === window.location.origin) {
    return realFetch(input, init)
  }
  if (PASSTHROUGH_HOSTS.has(url.host)) {
    passedThroughHosts.add(url.host)
    return debugLog('passthrough', method, url, realFetch(input, init))
  }
  if (!isGatewayHost(url.host) && !MOCKED_EXTERNAL_HOSTS.has(url.host)) {
    return unmocked(method, url, signal)
  }

  const found = findHandler({ url, method: method as HttpMethod, init })
  if (found) {
    const response = Promise.resolve().then(() =>
      found.handler.resolve({ url, method: method as HttpMethod, params: found.params, init })
    )
    return debugLog('mocked', method, url, rejectOnAbort(response, signal))
  }

  // Record mode logs in for real, and a long run outlives the token: GFWAPI renews it through
  // /auth/tokens/reload. Let token requests through so the session survives, and never save them
  // — the responses are credentials. (Before this, the renewal was blocked, the logged-in specs
  // silently ran as guests, and a 401 was recorded as /auth/me.)
  if (IS_RECORD_MODE && isAuthTokenRequest(url)) {
    return realFetch(input, init)
  }
  // Replay never records them, so answer a renewal with the fake token render() stores: the
  // session renews to itself and logged-in specs stay logged in.
  if (isAuthTokenRequest(url)) {
    const tokens = { token: INTEGRATION_TEST_TOKEN, refreshToken: INTEGRATION_TEST_TOKEN }
    return debugLog(
      'mocked',
      method,
      url,
      Promise.resolve(
        new Response(JSON.stringify(tokens), { headers: { 'content-type': 'application/json' } })
      )
    )
  }

  const requestHeaders = new Headers(
    init?.headers ?? (input instanceof Request ? input.headers : undefined)
  )
  if (method === 'GET' && IS_RECORD_MODE) {
    return debugLog(
      'recorded',
      method,
      url,
      recordResponse(url, requestHeaders, realFetch(input, init))
    )
  }
  if (method === 'GET') {
    const replayed = await replayResponse(url, requestHeaders)
    if (!replayed && isMapTileRequest(url)) {
      // Tolerated, not strict: see isMapTileRequest.
      console.warn(`[network] unrecorded map tile, answered empty: ${url.pathname}`)
      return debugLog(
        'empty-tile',
        method,
        url,
        Promise.resolve(new Response(null, { status: 204 }))
      )
    }
    if (replayed)
      return debugLog('replayed', method, url, rejectOnAbort(Promise.resolve(replayed), signal))
  }
  return unmocked(method, url, signal)
}

/** Call once, from the setup file, before any app module runs. */
export function installNetworkStub() {
  vi.spyOn(globalThis, 'fetch').mockImplementation(stubbedFetch)
}

/** Handlers every spec gets. Registered once from the setup file. */
export function setDefaultHandlers(...handlers: Handler[]) {
  defaultHandlers = handlers.map(compile)
}

export const mockApi = {
  /** Adds handlers for the current test. They are dropped by `resetTestHandlers` after it. */
  use(...handlers: Handler[]) {
    testHandlers.push(...handlers.map(compile))
  },
}

export function resetTestHandlers() {
  testHandlers = []
}

/** Throws with the list of requests nothing answered, then clears it. */
export function assertNoUnmockedRequests() {
  const leaks = [
    ...unmockedRequests,
    ...pendingUnmocked.filter((entry) => !entry.cancelled).map((entry) => entry.description),
  ]
  unmockedRequests = []
  pendingUnmocked = []
  if (leaks.length) {
    throw new Error(
      `Unmocked network requests (record them with VITEST_RECORD=true, or add a handler):\n  ${[
        ...new Set(leaks),
      ].join('\n  ')}`
    )
  }
}

export function getPassedThroughHosts() {
  return [...passedThroughHosts]
}

// --- Handler builders -------------------------------------------------------------------------

type HandlerOptions = Pick<Handler, 'query'>

const handler =
  (method: HttpMethod) =>
  (path: string, resolve: Resolver, options: HandlerOptions = {}): Handler => ({
    method,
    path,
    resolve,
    ...options,
  })

export const get = handler('GET')
export const post = handler('POST')
export const put = handler('PUT')
export const patch = handler('PATCH')
export const del = handler('DELETE')

// --- Response builders. Each returns a Resolver so every request gets a fresh body. ----------

export const json =
  (data: unknown, init: ResponseInit = {}): Resolver =>
  () =>
    new Response(JSON.stringify(data), {
      status: 200,
      ...init,
      headers: { 'content-type': 'application/json', ...init.headers },
    })

export const binary =
  (buffer: ArrayBuffer, headers: Record<string, string> = {}): Resolver =>
  () =>
    new Response(buffer.slice(0), {
      status: 200,
      headers: { 'content-type': 'application/octet-stream', ...headers },
    })

export const status =
  (code: number, body: unknown = {}): Resolver =>
  () =>
    new Response(JSON.stringify(body), {
      status: code,
      headers: { 'content-type': 'application/json' },
    })

/** Never settles: holds the request in its loading state. Aborting still rejects it. */
export const pending = (): Resolver => () => new Promise<Response>(() => {})

/** Fails the way a dropped connection does. */
export const networkError = (): Resolver => () => Promise.reject(new TypeError('Failed to fetch'))

// --- Binary helpers -----------------------------------------------------------------------------

function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  let binaryString = ''
  for (let i = 0; i < bytes.length; i++) binaryString += String.fromCharCode(bytes[i])
  return btoa(binaryString)
}

/** Reads a binary fixture. `path` is relative to apps/platform. */
export async function readBinaryFixture(path: string) {
  return base64ToArrayBuffer(await commands.readFile(path, 'base64'))
}

// --- Recordings ---------------------------------------------------------------------------------

type RecordingMeta = {
  method: 'GET'
  /** Normalized: path plus sorted query, no host. What the file name is a hash of. */
  key: string
  status: number
  headers: Record<string, string>
  body: 'json' | 'bin'
}

/** A key that answers with another recording, without copying its body (track aliases) */
type RecordingAlias = { key: string; aliasOf: string }

// Headers the app reads off responses. Everything else is noise in a fixture.
const RECORDED_HEADERS = /^(content-type|x-[\w-]+|timestamp-base)$/i

// Fields of /auth/me that identify the test account's owner. Ids, groups and permissions stay:
// they decide what the app shows.
const USER_PERSONAL_FIELDS = [
  'email',
  'firstName',
  'lastName',
  'photo',
  'organization',
  'whoEndUsers',
  'problemToResolve',
  'pullingDataOtherAPIS',
  'invitationNotes',
]

// render() keeps a token in localStorage only for `authenticated: true` (appTestUtils.tsx).
function isLoggedInRequest() {
  try {
    return Boolean(localStorage.getItem('GFW_API_USER_TOKEN'))
  } catch {
    return false
  }
}

// Request headers that change the response for the same URL. A password-protected workspace
// answers "password required", "invalid password" or the workspace depending on this one.
const VARYING_REQUEST_HEADERS = ['x-workspace-password']

// Track simplification (libs/api-client/src/utils/thinning.ts). The app picks the level from the
// map zoom at request time, and while the camera animates to fit a vessel that zoom depends on
// timing, so a replay can ask for a level the live run never did. Each level is recorded under its
// own key (a click on a track needs the level it was recorded with), plus an alias without the
// level that replay falls back to when the exact one is missing — see trackAliasKey.
const TRACK_THINNING_PARAM = /^(distance|bearing-val|change-speed|min-accuracy)-[a-z]+$/

/**
 * Host-independent and parameter-order-independent, so a gateway change keeps fixtures valid.
 *
 * The same URL can still answer differently, so the key also carries:
 * - `[user]` for a logged-in request (a private workspace is 403 for a guest, 200 for its owner);
 * - a hash of each header in VARYING_REQUEST_HEADERS — hashed so a password never reaches a file.
 */
function getRecordingKey(url: URL, requestHeaders: Headers, { withoutThinning = false } = {}) {
  const params = [...url.searchParams.entries()]
    .filter(([name]) => !(withoutThinning && TRACK_THINNING_PARAM.test(name)))
    .sort(([a, av], [b, bv]) => (a === b ? av.localeCompare(bv) : a.localeCompare(b)))
  const query = new URLSearchParams(params).toString()
  const scope = isLoggedInRequest() ? '[user] ' : ''
  const variants = VARYING_REQUEST_HEADERS.filter((name) => requestHeaders.has(name))
    .map((name) => ` [${name} #${hashString(requestHeaders.get(name) ?? '')}]`)
    .join('')
  return `GET ${scope}${url.pathname}${query ? `?${query}` : ''}${variants}`
}

const isTrackRequest = (url: URL) => url.pathname.endsWith('/tracks')

/** The same track at any simplification level. Points at one recorded level (`aliasOf`). */
const trackAliasKey = (url: URL, requestHeaders: Headers) =>
  getRecordingKey(url, requestHeaders, { withoutThinning: true })

function hashString(value: string) {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (Math.imul(31, hash) + value.charCodeAt(i)) | 0
  }
  return (hash >>> 0).toString(16)
}

async function getRecordingPath(key: string) {
  const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(key))
  const hash = [...new Uint8Array(digest)]
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  // A readable prefix makes the folder browsable; the hash keeps names unique and short.
  const [, scope, pathAndQuery] = /^GET (\[user\] )?(.*)$/.exec(key) ?? []
  // Header variants are only in the hash; they would turn the readable part into noise.
  const slug = new URL(pathAndQuery?.split(' [')[0] ?? '/', 'http://x').pathname
    .split('/')
    .filter(Boolean)
    .slice(1, 4)
    .join('-')
    .replace(/[^\w.-]+/g, '-')
    .slice(0, 60)
  return `${RECORDINGS_DIR}/${scope ? 'user-' : ''}${slug}-${hash}`
}

function isAuthTokenRequest(url: URL) {
  return /\/auth\/tokens(\/|$)/.test(url.pathname)
}

function isPrivateRequest(url: URL) {
  return decodeURIComponent(url.href).includes('private-')
}

const replayCache = new Map<string, Promise<{ meta: RecordingMeta; body: string } | null>>()

async function loadRecording(key: string) {
  const path = await getRecordingPath(key)
  try {
    let meta = JSON.parse(await commands.readFile(`${path}.meta.json`)) as
      RecordingMeta | RecordingAlias
    let bodyPath = path
    if ('aliasOf' in meta) {
      bodyPath = meta.aliasOf
      meta = JSON.parse(await commands.readFile(`${bodyPath}.meta.json`)) as RecordingMeta
    }
    const body = await commands.readFile(
      `${bodyPath}.${meta.body}`,
      meta.body === 'bin' ? 'base64' : 'utf-8'
    )
    return { meta, body }
  } catch {
    return null
  }
}

function loadCachedRecording(key: string) {
  if (!replayCache.has(key)) replayCache.set(key, loadRecording(key))
  return replayCache.get(key)!
}

async function replayResponse(url: URL, requestHeaders: Headers) {
  let recording = await loadCachedRecording(getRecordingKey(url, requestHeaders))
  if (!recording && isTrackRequest(url)) {
    // A simplification level the live run never requested: any recorded level of the same track
    recording = await loadCachedRecording(trackAliasKey(url, requestHeaders))
  }
  if (!recording) return undefined
  const { meta, body } = recording
  return new Response(meta.body === 'bin' ? base64ToArrayBuffer(body) : body, {
    status: meta.status,
    headers: meta.headers,
  })
}

/**
 * VITEST_RECORD=true: saves the real response under test/fixtures/api/recorded and returns it.
 * Responses for private datasets are passed through but never saved, and /auth/me is anonymised.
 */
async function recordResponse(url: URL, requestHeaders: Headers, pending: Promise<Response>) {
  const response = await pending
  if (isPrivateRequest(url)) {
    console.warn(`[record] not saved (private data): ${url.pathname}`)
    return response
  }
  // A 401 on a logged-in request means the recording session lost its login, not an answer the app
  // should replay. A guest's 401 is kept: a guest opening a private workspace gets exactly that,
  // and specs assert on it.
  if (response.status === 401 && isLoggedInRequest()) {
    console.warn(
      `[record] not saved (401, the recording session is not logged in): ${url.pathname}`
    )
    return response
  }
  const key = getRecordingKey(url, requestHeaders)
  const path = await getRecordingPath(key)
  const isJson = (response.headers.get('content-type') ?? '').includes('json')
  const headers = Object.fromEntries(
    [...response.headers.entries()].filter(([name]) => RECORDED_HEADERS.test(name))
  )
  const meta: RecordingMeta = {
    method: 'GET',
    key,
    status: response.status,
    headers,
    body: isJson ? 'json' : 'bin',
  }

  const clone = response.clone()
  if (isJson) {
    let text = await clone.text()
    if (url.pathname.endsWith('/auth/me')) {
      const user = JSON.parse(text)
      for (const field of USER_PERSONAL_FIELDS) {
        if (field in user) user[field] = field === 'email' ? 'test-user@example.org' : 'Test'
      }
      // Grants on private datasets name partner dataset families; no integration spec needs them
      // (the ones that did moved to platform-e2e), so they never reach a committed file.
      user.permissions = (user.permissions ?? []).filter(
        (permission: { value?: string }) => !String(permission.value ?? '').includes('private-')
      )
      text = JSON.stringify(user)
    }
    await commands.writeFile(`${path}.json`, text)
  } else {
    await commands.writeFile(
      `${path}.bin`,
      arrayBufferToBase64(await clone.arrayBuffer()),
      'base64'
    )
  }
  await commands.writeFile(`${path}.meta.json`, JSON.stringify(meta, null, 2))
  if (isTrackRequest(url)) {
    const aliasKey = trackAliasKey(url, requestHeaders)
    const alias: RecordingAlias = { key: aliasKey, aliasOf: path }
    await commands.writeFile(
      `${await getRecordingPath(aliasKey)}.meta.json`,
      JSON.stringify(alias, null, 2)
    )
  }
  return response
}
