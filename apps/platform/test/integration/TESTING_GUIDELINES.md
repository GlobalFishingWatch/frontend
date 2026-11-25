# Integration Testing Guidelines

## Overview

Integration tests verify that different parts of the Fishing Map application work together correctly. These tests run in a browser environment using Vitest Browser Mode and test complete user workflows from UI interaction to state management.

**Location:** `/apps/platform/test/integration/`

**Technology Stack:**

- **Test Framework:** Vitest with Browser Mode
- **Rendering:** React Testing Library (vitest-browser-react) via TanStack Router (`RouterProvider`)
- **Routing:** TanStack Router (navigation source of truth; synced to Redux via `setupRouterSync`)
- **State Management:** Redux + Jotai
- **User Interactions:** @vitest/browser userEvent API
- **Network:** no live API. A `fetch` stub answers every request from handlers or from responses
  recorded once from the dev API (`test/fixtures/api/recorded/`); an unanswered request fails the
  test. How it works, and how to re-record: [`../README.md`](../README.md#the-network-stub).
- **Artifacts:** Screenshots and Playwright traces

## Test Structure

### File Organization

Each test file focuses on a specific feature or component:

```
test/integration/
├── App.spec.tsx              # Core app functionality
├── Datasets.spec.tsx          # Layer management (reference, environment, events, detections)
├── Map.spec.tsx               # Map rendering and interactions
├── MarineManager.spec.tsx     # MM workspaces
├── Polygon.spec.tsx           # Drawing polygon
├── Reports.spec.tsx           # Reports (Private, Global, Others, Data comparison)
├── Sidebar.spec.tsx           # Sidebar tools and controls
├── Timebar.spec.tsx           # Timebar interactions and integration
├── User.spec.tsx              # User authentication flows
├── UserDatasets.spec.tsx      # User-uploaded datasets
├── Vessels.spec.tsx           # Vessel popups and interactions
├── VesselSearch.spec.tsx      # Vessel search functionality
└── VesselViewer.spec.tsx      # Vessel detail viewer
```

### Test File Template

```typescript
import { createStore as createJotaiStore } from 'jotai'
import { render } from 'test/appTestUtils'
import { WAIT } from 'test/setup/config'
import { defaultState } from 'test/utils/store'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import { makeStore } from 'store'

describe('Feature Name', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should describe expected behavior', async () => {
    const store = makeStore(defaultState, [])
    const jotaiStore = createJotaiStore()
    const { getByTestId } = await render({ store, jotaiStore })

    // Your test logic here
  })
})
```

## Test Utilities Reference

### `test/setup/config.ts`

Shared constants for all specs:

```typescript
import { TEST_END_DATE } from 'test/setup/config'

// System clock is frozen at TEST_END_DATE in vitest.setup.ts
```

There are no fixed waits. Wait for the state the next step needs instead — see
[Wait for Async Operations](#2-wait-for-async-operations).

### `test/utils/store/`

| File                          | Exports                                                                                 | Use                                      |
| ----------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------- |
| `factory.ts`                  | `defaultState`, `defaultViewport`, `getDefaultState()`, `getDefaultStateWithDatasets()` | Build Redux initial state for tests      |
| `state.ts`                    | `REDUX_STORE_DEFAULT_STATE`                                                             | Internal — imported only by `factory.ts` |
| `fixtures.ts`                 | `USER_POLYGON_DATASET`, `USER_POLYGON_DATASET_ID`, etc.                                 | Test fixture data                        |
| `testing-store-middleware.ts` | `TestingStoreMiddleware`, `createTestingMiddleware()`                                   | Track dispatched Redux actions           |
| `index.ts`                    | re-exports `factory` + `fixtures` + `testing-store-middleware`                          | Barrel for convenience                   |

### `test/utils/navigation/`

Naming convention:

| Prefix             | Meaning                              | Example                            |
| ------------------ | ------------------------------------ | ---------------------------------- |
| `navigateToX`      | Route change (URL/router state)      | `navigateToVesselViewer`           |
| `openX`            | UI interaction opening a panel/modal | _(reserved for future UI helpers)_ |
| `addX` / `removeX` | Workspace mutations                  | `addVesselToWorkspace`             |

## Common Test Casuistics

### 1. **State Synchronization**

Testing that UI changes properly update application state (TanStack Router → Redux location).

**Pattern:**

```typescript
it('should reflect store changes on layer toggle', async () => {
  const store = makeStore(defaultState)
  const { getByTestId } = await render({ store })

  await getByTestId('activity-layer-panel-switch-ais').click()

  // WHY: Router sync writes navigation into Redux location — read store state, not actions.
  // location/setLocation is covered by dedicated router navigation tests.
  await expect
    .poll(() => store.getState().location.query.dataviewInstances)
    .toMatchObject(expectedResult)
})
```

**Use Cases:**

- Layer visibility toggles → URL and Redux state
- Map viewport changes → URL parameters
- Timebar interactions → Redux state
- User interactions → Store + URL sync

### 2. **Map Interactions**

Testing map clicks, hovers, and coordinate-based interactions.

**Pattern:**

```typescript
it('should open vessel popup on vessel click', async () => {
  // WHY: Jotai store is needed to access map instance atoms (mapInstanceAtom)
  // The map uses Jotai for managing deck.gl state, while Redux handles application state
  const jotaiStore = createJotaiStore()
  const { getByTestId } = await render({ store, jotaiStore })

  // WHY: the click only picks a vessel once its layer and tiles are loaded. waitForLayersLoaded
  // (test/utils/map.ts) waits for every deck layer to report loaded — the same state the map
  // spinner shows — and for that to hold briefly, so it does not pass before a load starts.
  await waitForLayersLoaded(jotaiStore)

  // WHY: Convert geographic coordinates [longitude, latitude] to screen pixels [x, y]
  // The map uses geographic coordinates, but user interactions (clicks) require screen coordinates
  // projectToMap() uses the deck viewport for the current zoom/pan state.
  // clickMapAtCoordinates() does both and hovers before clicking.
  const { x, y } = await projectToMap(jotaiStore, -17.3, 26.4)

  // WHY: Hover first so deck picks the feature under the pointer. hoverThenClickMap waits for the
  // hover popup (not a fixed delay), then clicks. clickMapAtCoordinates does the projection too.
  await hoverThenClickMap(getByTestId, { x, y })

  // ℹ️ NOTE: No wait needed here - expect.element() will retry until popup is visible
  await expect.element(mapPopup.getByText('Gabu Reefer')).toBeVisible()
})
```

**Use Cases:**

- Clicking vessels on map → Opens popup
- Clicking context layers → Shows layer info
- Dragging map → Updates viewport state
- Hovering features → Shows hover info

### 3. **Layer Management**

Testing adding, removing, and configuring data layers.

**Pattern:**

```typescript
it('should add reference data layer', async () => {
  const store = makeStore(defaultState)
  // render() also returns the Jotai store it used
  const { getByTestId, jotaiStore } = await render({ store })

  await getByTestId('activity-add-layer-button').click()
  await getByTestId('add-layer-eez-button').click()

  // WHY: Layer addition triggers async operations: API calls, tile loading, and deck.gl layer
  // creation. Only needed if the test then interacts with the map (e.g. clicks a feature).
  await waitForLayersLoaded(jotaiStore)

  await expect
    .poll(() => store.getState().location.query)
    .toMatchObject({
      dataviewInstances: [{ id: expect.stringContaining('eez'), category: 'context' }],
    })
})
```

**Layer Categories Tested:**

- **Reference Layers:** EEZ, MPA, RFMO boundaries
- **Environment Layers:** Bathymetry, SST, chlorophyll
- **Events Layers:** Port visits, encounters, loitering
- **Detection Layers:** AIS, VMS, SAR, Optical
- **User Layers:** Tracks, polygons, points, BigQuery

### 4. **Authentication Setup**

Normal runs never log in. `render({ authenticated: true })` stores a fake token, and the stub
answers `/auth/me` from an anonymised recording (and a token renewal with the same fake token).
Logged-in requests are recorded and replayed under their own `[user]` keys, so a guest and a
logged-in test see different responses for the same URL.

Only **record mode** (`VITEST_RECORD=true`) logs in for real, once, in global setup
(`test/setup/login/`): Playwright fills the GFW login form with `TEST_USER_EMAIL` /
`TEST_USER_PASSWORD` from `.env`, and a local proxy on `localhost:3000` catches the OAuth callback
so the browser never leaves `localhost` (navigating the vitest iframe away breaks the runner).

Anything that depends on the test user's real grants (private workspaces, private datasets) cannot be
replayed: private data is never recorded. Test it in `apps/platform-e2e`.

Testing authenticated vs. unauthenticated user experiences.

**Pattern:**

```typescript
it('should show login prompt when user is not logged in', async () => {
  // WHY: Not passing 'authenticated: true' means the test runs as a guest user
  // This allows us to test the login prompt that should appear for unauthenticated users
  const { getByRole } = await render({ store })

  await getByTestId('activity-add-layer-button').click()
  await userEvent.click(getByRole('button', { name: 'User' }))

  expect(getByRole('dialog').getByText('Register or login to upload datasets')).toBeVisible()
})

it('should show user dataset sections when user is logged in', async () => {
  // WHY: authenticated: true renders as the (recorded, anonymised) test user, without a login
  const { getByRole, getByText } = await render({ store, authenticated: true })

  await getByTestId('activity-add-layer-button').click()
  await userEvent.click(getByRole('button', { name: 'User' }))

  // WHY: These sections only appear for authenticated users with upload permissions
  await expect.element(getByText('Tracks')).toBeVisible()
  await expect.element(getByText('Polygons')).toBeVisible()
})
```

**Use Cases:**

- Displaying login prompts for protected features
- Loading user-specific data when authenticated
- Testing session expiration warnings
- Verifying auth-gated UI elements

### 5. **Timebar Integration**

Testing timeline interactions and their effect on map layers.

**Pattern:**

```typescript
it('the map should be interactive after timebar interaction', async () => {
  const testingMiddleware = createTestingMiddleware()
  const store = makeStore(defaultState, [testingMiddleware.createMiddleware()])
  const jotaiStore = createJotaiStore()
  const { getByTestId } = await render({ store, jotaiStore })
  const timebarWrapper = getByTestId('timebar-wrapper')

  // WHY: Drag once the layers have loaded, not after a guessed delay
  await waitForLayersLoaded(jotaiStore)

  // WHY: the synthetic heatmap tiles hold data on one day (DATA_DAY); a fixed pixel lands on a
  // day with none. getDataDayTimebarX (test/utils/timebar.ts) returns that day's x position
  const dataDayX = await getDataDayTimebarX(getByTestId, jotaiStore)

  // WHY steps: 5 → Multi-step drags are required to properly trigger drag events
  // Single-step drags are not captured by the event system; intermediate steps ensure proper event firing
  await userEvent.dragAndDrop(timebarWrapper, timebarWrapper, {
    sourcePosition: { x: dataDayX - 40, y: 35 },
    targetPosition: { x: dataDayX + 40, y: 35 },
    steps: 5,
  })

  // WHY: timebar/setHighlightedTime is a feature action — assert dispatch, not router sync
  const timebarAction = testingMiddleware.getLastActionByType('timebar/setHighlightedTime')
  expect(timebarAction).toBeDefined()
  expect(timebarAction?.payload?.start).toBeDefined()
})
```

**Use Cases:**

- Dragging timeline → Updates highlighted time
- Hovering timeline → Shows event counts
- Timeline interactions → Map remains interactive
- Event/detection data → Displayed on timeline

### 6. **Vessel Viewer Details**

Testing the vessel profile viewer with multiple tabs and data sections.

**Pattern:**

```typescript
import { navigateToVesselViewer } from 'test/utils/navigation/navigateToVesselViewer'

it('should render tabs and vessel basic info', async () => {
  const { getByTestId, getByText, router } = await render({ store })

  await router.navigate(navigateToVesselViewer())

  await expect.element(getByTestId('vv-vessel-name')).toMatchTextContent('Gabu Reefer')
  await expect.element(getByText('Registry', { exact: true })).toBeVisible()
  await expect.element(getByText('AIS', { exact: true })).toBeVisible()
  await expect.element(getByTestId('vv-summary-tab')).toBeVisible()
})
```

**Use Cases:**

- Rendering vessel basic info (name, flag, MMSI, IMO)
- Tab navigation (Summary, Areas, Related, Insights)
- Different summary views (by type, by timeline)
- Area breakdowns (EEZ, FAO, RFMO, MPA)
- Related vessels and ownership
- Insights and analytics

### 7. **Search and Navigation**

Testing vessel search functionality and navigation flows.

**Pattern:**

```typescript
import { navigateToVesselSearch } from 'test/utils/navigation/navigateToVesselSearch'

it('can search for a vessel and see it on the map', async () => {
  const { getByTestId, router } = await render({ store, jotaiStore })

  await router.navigate(navigateToVesselSearch())

  await userEvent.type(getByTestId('search-vessels-basic-input'), 'Gabu Reefer')
  await userEvent.click(getByTestId('link-vessel-profile'))

  // WHY: the track has to be loaded before it can be clicked on the map
  await waitForVesselTrackReady(jotaiStore)

  // Verify vessel appears on map
})
```

**Use Cases:**

- Typing in search input → Shows matching results
- Clicking search result → Navigates to vessel
- Clearing search → Removes results
- Preserving search state across navigation

### 8. **API Request Verification**

Testing that API calls are made with correct parameters and formats.

**Pattern 1: Direct Spy on GFWAPI.fetch**

```typescript
it('should request tiles with correct parameters', async () => {
  // WHY: Spy on GFWAPI.fetch to intercept and verify all API calls
  // This allows us to check URLs, parameters, headers, and request counts
  const fetchSpy = vi.spyOn(GFWAPI, 'fetch')
  const { getByTestId } = await render({ store, jotaiStore })

  // ⚠️ IMPORTANT: Wait for initial data to load before assertions
  await waitForLayersLoaded(jotaiStore)

  // Perform action that triggers API calls, then wait for the new zoom's tiles
  await userEvent.click(getByTestId('map-control-zoom-in'))
  await waitForLayersLoaded(jotaiStore)

  // WHY: Extract information from all fetch calls
  // mock.calls contains all arguments passed to the spied function
  const allUrls = fetchSpy.mock.calls.map((call) => call[0] as string)
  const tileUrls = allUrls.filter((url) => url.includes('/4wings/tile/heatmap/'))

  // WHY: Parse URLs to verify correct parameters (e.g., zoom levels)
  const zoomLevels = tileUrls.map((url) => {
    const match = url.match(/\/tile\/heatmap\/(\d+)\//)
    return match ? parseInt(match[1]) : 0
  })

  // WHY: Verify that requests were made and contain expected data
  expect(tileUrls.length).toBeGreaterThan(0)
  expect(Math.max(...zoomLevels)).toBeGreaterThan(0)

  // WHY: Check if specific query parameters are present
  const hasIntervalParam = fetchSpy.mock.calls.some((call) =>
    (call[0] as string).includes('&interval=YEAR')
  )
  expect(hasIntervalParam).toBe(true)

  // WHY: Clean up spy to prevent affecting other tests
  fetchSpy.mockRestore()
})
```

**Pattern 2: Using GFWAPITestUtils**

```typescript
import { addVesselToWorkspace } from 'test/utils/navigation/addVesselToWorkspace'
import { GFWAPITestUtils } from 'test/utils/network/gfw-api-test'

it('should wait for API request to complete', async () => {
  const GFWAPITest = new GFWAPITestUtils()
  const { getByTestId, router } = await render({ store })

  await router.navigate(addVesselToWorkspace())

  // WHY: Wait for the /events API call to complete
  // This ensures the data is loaded before we interact with UI that depends on it
  // Default timeout is 15000ms, can be customized with { timeout: 10000 }
  await GFWAPITest.waitForRequest('/events')

  // Now safe to interact with elements that depend on loaded event data
  await userEvent.hover(getByTestId('timebar-wrapper'), { position: { x: 405, y: 35 } })
  await expect.element(getByTestId('timebar-highlighter')).toBeVisible()
})
```

**What You Can Verify:**

- **URL Structure:** Check if correct endpoints are called
- **Query Parameters:** Verify filters, intervals, date ranges, zoom levels
- **Request Headers:** Check authentication tokens, content types
- **Request Count:** Ensure no unnecessary duplicate requests
- **Request Timing:** Verify requests are made at the right time
- **Request Body:** Check POST/PUT payload formatting

**Use Cases:**

- Verifying map tiles are requested with correct zoom levels
- Checking that time range filters are applied to API calls
- Ensuring authentication headers are included
- Validating dataset-specific parameters
- Confirming requests aren't duplicated unnecessarily
- Waiting for critical data to load before assertions

### 9. **State Preservation**

Testing that application state persists correctly during various operations.

**Pattern:**

```typescript
it('should preserve map previous state on layer toggle', async () => {
  const { getByTestId } = await render({ store })

  await getByTestId('map-control-zoom-in').click()
  // WHY: the viewport reaches the URL after a debounce; poll for it instead of sleeping past it
  await expect.poll(() => store.getState().location.query.zoom).toBe(2.49)
  await getByTestId('activity-layer-panel-switch-ais').click()

  const expectedResult = {
    latitude: 19,
    longitude: 26,
    zoom: 2.49,
  }

  expect(store.getState().location.query).toMatchObject(expectedResult)
})
```

**Use Cases:**

- Map viewport preserved when toggling layers
- Search input preserved during navigation
- Layer configuration maintained across interactions
- Time range preserved when adding/removing layers

### 10. **UI Controls and Modals**

Testing sidebar controls, modals, and dialogs.

**Pattern:**

```typescript
it('should open feedback modal', async () => {
  const { getByTestId, getByRole } = await render({ store })

  await userEvent.hover(getByTestId('feedback-button'))
  await getByTestId('open-feedback-modal').click()

  await expect.element(getByRole('heading', { name: 'Feedback' })).toBeVisible()
})
```

**Use Cases:**

- Opening/closing modals and dialogs
- Language selector changes
- Sidebar toggle functionality
- Help hints display and dismissal
- Feedback form interactions

### 11. **Async Data Loading**

Testing components that require data to load before interaction.

**Pattern:**

```typescript
it('should display data after loading', async () => {
  const { getByTestId } = await render({ store })

  await getByTestId('activity-add-layer-button').click()
  await getByTestId('add-layer-button').click()

  // ⚠️ DECISION POINT: Do we need this wait?
  // - YES if we're clicking map features that depend on loaded data
  // - NO if we're just checking that UI elements appear (expect.element() retries automatically)

  // Example 1: Wait IS needed - interacting with loaded data
  await waitForLayersLoaded(jotaiStore)
  await clickMapAtCoordinates({ jotaiStore, getByTestId, longitude: -15, latitude: 28 })

  // Example 2: Wait NOT needed - just checking UI rendered
  await expect.element(getByTestId('data-display')).toBeVisible()
})
```

**What to wait for, by operation** (never a fixed delay):

| Operation                                | Wait                                                          |
| ---------------------------------------- | ------------------------------------------------------------- |
| Map ready to receive drags or clicks     | `waitForMapViewport(jotaiStore)`                              |
| Layer data / tiles loaded                | `waitForLayersLoaded(jotaiStore)` (basemap excluded)          |
| Click a lon/lat on the map               | `clickMapAtCoordinates(...)` (waits for the camera to settle) |
| Debounced URL updates                    | `expect.poll(() => store.getState().location.query...)`       |
| Buttons revealed by hovering a layer row | `clickLayerAction(getByTestId, { row, action })`              |
| Something appearing in the UI            | `expect.element(...)` (retries on its own)                    |

## Best Practices

> ### ⚠️ Critical: Don't Add Unnecessary Waits!
>
> **Start without waits** - Many tests work perfectly without explicit `setTimeout` calls because:
>
> - `expect.element()` has built-in retry logic
> - Most UI rendering is fast enough
> - Premature waits make tests slower and harder to maintain
>
> **Add waits only when:**
>
> 1. Tests fail due to timing (not because of wrong selectors!)
> 2. You're interacting with data that must be loaded first (map tiles, API data)
> 3. You're asserting debounced operations (URL updates, search)
> 4. Elements depend on animations/transitions to be interactive
>
> **When in doubt:** Run the test first. If it passes, you don't need the wait!

### 1. **Use Data Test IDs**

Always use `data-testid` attributes for reliable element selection.

```typescript
// ✅ Good
await getByTestId('activity-layer-panel-switch-ais').click()

// ❌ Avoid (brittle, text changes break tests)
await getByText('AIS Layer').click()
```

### 2. **Wait for Async Operations**

⚠️ **Never sleep (`setTimeout`).** A fixed wait is too short on a slow machine and wasted time on a
fast one. Wait for the state the next step depends on:

| Waiting for                       | Use                                                                 |
| --------------------------------- | ------------------------------------------------------------------- |
| an element to appear              | `await expect.element(locator).toBeVisible()` (retries on its own)  |
| map layers / tiles to load        | `await waitForLayersLoaded(jotaiStore)` from `test/utils/map.ts`    |
| a specific layer to appear        | `await waitForLayersLoaded(jotaiStore, { layerIds: ['presence'] })` |
| a click/hover on a map position   | `clickMapAtCoordinates` / `hoverThenClickMap` from `test/utils/map` |
| a hover-revealed layer row button | `clickLayerAction` from `test/utils/layers.ts`                      |
| debounced or async store state    | `await expect.poll(() => store.getState()…).toBe(…)`                |

Don't wait for the map spinner to be hidden right after an action: the new load may not have
started yet, so the spinner is still hidden and the wait passes too early. `waitForLayersLoaded`
requires the loaded state to hold for a moment, which covers that gap.

```typescript
// ✅ Good - Poll the debounced state until it arrives
await getByTestId('map-control-zoom-in').click()
// WHY: URL updates are debounced; poll instead of guessing how long the debounce takes
await expect.poll(() => store.getState().location.query.zoom).toBe(2.49)

// ✅ Also Good - No wait needed when expect.element() can retry
await getByTestId('open-modal-button').click()
// WHY: expect.element() will retry until the modal is visible
await expect.element(getByRole('dialog')).toBeVisible()

// ❌ Bad - Unnecessary wait when expect.element() handles it
await getByTestId('open-modal-button').click()
await new Promise((resolve) => setTimeout(resolve, 1000)) // Not needed!
await expect.element(getByRole('dialog')).toBeVisible()

// ❌ Bad - No wait when asserting debounced state (will be stale)
await getByTestId('map-control-zoom-in').click()
expect(store.getState().location.query.zoom).toBe(2.49) // May fail - state not updated yet
```

### 3. **Clear Mocks Between Tests**

Use `beforeEach` to reset mocks and ensure test isolation.

```typescript
beforeEach(() => {
  vi.clearAllMocks()
})
```

### 4. **Use Testing Middleware for Non-Router Redux Actions**

Use `createTestingMiddleware` to assert that **feature actions** were dispatched (e.g. `timebar/setHighlightedTime`, workspace actions). Do **not** use it for `location/setLocation` — router navigation and URL sync are asserted via `store.getState().location` (and will have dedicated router navigation tests).

```typescript
import { createTestingMiddleware } from 'test/testingStoreMiddeware'

const testingMiddleware = createTestingMiddleware()
const store = makeStore(defaultState, [testingMiddleware.createMiddleware()])

// ... perform UI interaction ...

const timebarAction = testingMiddleware.getLastActionByType('timebar/setHighlightedTime')
expect(timebarAction).toBeDefined()

// Or wait for an async side-effect action
await testingMiddleware.waitForAction('workspace/setReport')
```

### 5. **Mock Time-Dependent Values**

Mock `Date.now()` for consistent test results with time-based IDs.

```typescript
let dateNowSpy: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  // WHY: Layer IDs are generated using timestamps (e.g., 'eez__1771416000000')
  // Without mocking, parallel tests could generate the same ID and interfere with each other
  // The random component ensures each test run gets a unique ID even if run multiple times
  const testTimestamp = 1771416000000 + Math.floor(Math.random() * 1000000000)
  dateNowSpy = vi.spyOn(Date, 'now').mockReturnValue(testTimestamp)
})

afterEach(() => {
  // WHY: Restore the original Date.now() implementation after each test
  // This prevents the mock from affecting other tests or causing unexpected behavior
  dateNowSpy?.mockRestore()
})
```

### 6. **Use Coordinate Projection for Map Clicks**

Always project geographic coordinates to screen coordinates for accurate map interactions.

```typescript
// WHY: Access the map instance from Jotai store to get viewport information
const mapInstance = jotaiStore.get(mapInstanceAtom)
const viewport = mapInstance?.getViewports?.().find((v: any) => v.id === MAP_VIEW_ID)

// WHY: Convert geographic coordinates [longitude, latitude] to screen pixels [x, y]
// The map uses geographic coordinates, but user interactions (clicks) require screen coordinates
// viewport.project() handles the transformation based on current zoom/pan state
const [x, y] = viewport?.project([longitude, latitude]) || [0, 0]

await userEvent.click(mapElement, { position: { x, y } })
```

### 7. **Hover Before Clicking for Tooltips**

For elements with hover states, hover first to ensure consistent behavior.

```typescript
// ✅ Good
// WHY: layer panel buttons only show while their row is hovered, and they slide in over each
// other. clickLayerAction (test/utils/layers.ts) waits for the button and clicks it once through
// the DOM, so Playwright's hit-target check cannot fail a click the app already handled
await clickLayerAction(getByTestId, {
  row: 'activity-layer-panel-switch-presence',
  action: 'activity-layer-panel-remove-presence',
})

// ❌ May miss hover-dependent actions
// The button is hidden until its row is hovered
await getByTestId('activity-layer-panel-remove-presence').click()
```

### 8. **Use Multi-Step Drags**

For drag operations, use multiple steps to ensure events are captured.

```typescript
// WHY steps: 10 → Multi-step drags are required to properly trigger drag events
// Single-step drags are not captured by the event system; intermediate steps ensure proper event firing
// The browser's drag detection requires movement across multiple frames
await userEvent.dragAndDrop(source, target, {
  sourcePosition: { x: 400, y: 35 },
  targetPosition: { x: 700, y: 35 },
  steps: 10, // Required for proper event triggering
})
```

### 9. **Test Both Authenticated and Unauthenticated States**

When testing features that vary by auth state, test both scenarios.

```typescript
it('shows login for guests', async () => {
  // WHY: Not passing 'authenticated: true' means the test runs as a guest user
  // This allows us to test the login prompt that should appear for unauthenticated users
  await render({ store }) // Unauthenticated
  // assertions...
})

it('shows content for logged-in users', async () => {
  // WHY: authenticated: true renders as the (recorded, anonymised) test user, without a login
  await render({ store, authenticated: true }) // Authenticated
  // assertions...
})
```

### 10. **Use Appropriate Element Queries**

Choose the right query method for your use case.

```typescript
// Single element (throws if not found)
const button = getByTestId('submit-button')

// Check visibility
await expect.element(button).toBeVisible()

// Check for absence
await expect.element(button).not.toBeInTheDocument()

// Query multiple elements
const items = container.getAllByTestId('list-item')
```

## Testing Utilities

### Custom Render Function

Located in [appTestUtils.tsx](../appTestUtils.tsx)

```typescript
import { render } from 'test/appTestUtils'

await render({
  store, // Redux store (optional, creates new if not provided)
  jotaiStore, // Jotai store (optional, creates new if not provided)
  authenticated: true, // Pre-authenticate the test (optional)
})
```

**Features:**

- Wraps component in Redux and Jotai providers
- `authenticated: true` stores a fake token; `/auth/me` is answered from the anonymised recording
  - WHY: no login and no real token outside record mode, so runs are offline and deterministic
  - In record mode it loads the real tokens from `.auth/tokens.json` (written by global setup)
- Mocks `GFWAPI.logout()` for authenticated tests: it only clears localStorage
- Returns the Redux `store`, the `router` and the `jotaiStore` it used
- Ensures `__root__` element exists for modals (ROOT_DOM_ELEMENT)
  - WHY: Next.js modals and portals render into #\_\_next element by default
  - WHY: In the test environment, this element doesn't exist automatically
  - Without it, modal rendering would fail with "Target container is not a DOM element"

### Default State

Located in [defaultState.ts](../defaultState.ts)

Provides a consistent starting state for all tests.

```typescript
import { defaultState } from 'test/utils/store'

const store = makeStore(defaultState, [])
```

### Testing Middleware

Located in [testingStoreMiddeware.ts](../testingStoreMiddeware.ts)

Captures Redux actions for verification. Use for **non-router feature actions** only — not for `location/setLocation` (use `store.getState().location` instead).

```typescript
import { createTestingMiddleware } from 'test/testingStoreMiddeware'

const testingMiddleware = createTestingMiddleware()
const store = makeStore(defaultState, [testingMiddleware.createMiddleware()])

// ... perform UI interaction that should dispatch a feature action ...

const lastAction = testingMiddleware.getLastActionByType('timebar/setHighlightedTime')
expect(lastAction?.payload?.start).toBeDefined()
```

**Key Methods:**

- `getActions()` - Returns all dispatched actions (filters out internal Redux Toolkit actions)
- `getActionsByType(type)` - Returns only actions matching a specific type
- `waitForAction(type, timeout)` - Async wait for a specific action to be dispatched
  - WHY: Useful for testing async workflows and side effects
  - WHY: Timeout prevents tests from hanging if the action never occurs
- `createMiddleware()` - Creates the Redux middleware instance
  - Intercepts every action that flows through the store
  - Records actions for later assertions
  - Calls listeners to enable async waiting patterns

### GFW API Test Utils

Located in [test/utils/network/gfw-api-test.ts](../../utils/network/gfw-api-test.ts)

Helper class for testing GFW API interactions.

```typescript
import { GFWAPITestUtils } from 'test/utils/network/gfw-api-test'

const gfwApiTestUtils = new GFWAPITestUtils()

// WHY: Wait for a specific API endpoint to be called
// This is essential when testing features that make background API requests
// The 15-second timeout prevents tests from hanging if the request never happens
await gfwApiTestUtils.waitForRequest('/events')

// WHY: Access the underlying fetch spy to make detailed assertions
// Useful for verifying request parameters, headers, or other fetch call details
const spy = gfwApiTestUtils.fetchSpy
expect(spy).toHaveBeenCalled()
```

**Key Features:**

- Automatically creates a spy on `GFWAPI.fetch` during instantiation
  - WHY: Spying at the GFWAPI level captures all API calls regardless of which feature makes them
  - WHY: This is more robust than mocking individual API methods
- `waitForRequest(urlPattern)` - Waits for an API call matching the URL pattern (default timeout: 15s)
  - WHY: Polls the fetch spy every 100ms to check if the URL was called
  - WHY: Returns a promise that resolves when found or rejects on timeout
  - Use case: Testing that UI interactions trigger the correct API endpoint
- `fetchSpy` - Direct access to the Vitest spy for custom assertions
  - Verify call count: `expect(spy).toHaveBeenCalledTimes(2)`
  - Check parameters, body, or headers in fetch calls

**When to use:**

- Testing that user actions trigger correct API requests (search, filtering, etc.)
- Verifying API calls happen in the right order
- Ensuring correct parameters are sent to the backend
- Checking authentication headers are included in requests

### Navigation Helpers

Located in `test/utils/navigation/` (one file per navigation helper).

Helpers wrap `router.navigate()` using fixture data and production route paths. Use them to **set up test preconditions** — not to bypass navigation when you are testing the navigation flow itself.

```typescript
import { addVesselToWorkspace } from 'test/utils/navigation/addVesselToWorkspace'
import { navigateToVesselViewer } from 'test/utils/navigation/navigateToVesselViewer'
import { navigateToVesselSearch } from 'test/utils/navigation/navigateToVesselSearch'

const { getByTestId, router } = await render({ store })

// WHY: Navigate through TanStack Router (same path as production)
// Redux location state is synced automatically via setupRouterSync
await router.navigate(navigateToVesselViewer())
```

**When to use:**

- When you need the app on a specific route to test a feature
- To skip irrelevant UI interactions and focus on what you're testing
- When the state setup is complex and would require many user interactions

**When NOT to use:**

- When you're actually testing the navigation flow itself (click through the UI instead)
- When you need to verify that UI interactions trigger the correct route/location changes

**Asserting location state (router / URL sync):**

```typescript
// Read synced Redux location after navigation or UI interaction
await expect.poll(() => store.getState().location.query).toMatchObject({ ... })
await expect.poll(() => store.getState().location.type).toBe('WORKSPACE')

import { waitForLocationType } from 'test/utils/location'
await waitForLocationType(store, WORKSPACE_REPORT)

// Do not assert location/setLocation via testing middleware — that belongs in router navigation tests
```

## Debugging Tests

### Local Debugging

Commands, artifact locations and trace viewing are in [test/README.md](../README.md#running).

The trace viewer shows:

- Timeline of all actions
- DOM snapshots before/after each action
- Network requests and responses
- Browser console logs

### Common Issues

#### 1. "Cannot connect to iframe"

**Cause:** External navigation (OAuth, login pages) breaks the iframe connection.

**Solution:** Use pre-authentication with `authenticated: true` instead of testing actual login flows.

**Why this happens:**

- Vitest Browser Mode runs tests in an iframe for isolation
- Navigating to external OAuth providers breaks the iframe connection
- The test runner loses control and cannot continue execution

**The right approach:**

```typescript
// ✅ Use pre-authentication
const { getByTestId } = await render({ store, authenticated: true })

// ❌ Don't navigate to actual login pages in tests
await getByTestId('login-button').click() // This will break in iframe mode
```

#### 2. Flaky Tests Due to Timing

**Cause:** Async operations not fully completed before assertions.

**Solution:** Wait for the state the next step depends on — see the table in
[Async Data Loading](#11-async-data-loading). A fixed `setTimeout` is either too short on a slow
machine or wasted time on a fast one, and it hides the race instead of removing it.

Common races found in this suite:

- **Spinner already hidden:** right after an action the new load may not have started, so "spinner
  hidden" passes too early. `waitForLayersLoaded` requires the loaded state to hold for a moment.
- **Sidebar reflow:** a layer row moves while legends load, so a hover lands on the wrong row. For
  row actions use `clickLayerAction`; elsewhere wrap hover + check in `vi.waitFor`. Never retry a
  click that changes state: if it landed, the retry acts twice or fails on the new UI.
- **Camera still moving:** a lon/lat projected mid-animation hits a different pixel and 4wings cell.
  `projectToMap` / `clickMapAtCoordinates` wait for the viewport to settle.

**Remember:** Most UI assertions don't need waits because `expect.element()` retries automatically!

#### 3. Element Not Found

**Cause:** Element query executed before rendering completes.

**Solution:** Use `expect.element()` with visibility checks:

```typescript
// ✅ Good - Waits for element to appear in DOM and be visible
await expect.element(getByTestId('my-element')).toBeVisible()

// ❌ Bad - Throws immediately if element isn't rendered yet
const element = getByTestId('my-element') // This will fail if element isn't ready
```

**Why expect.element() is better:**

- Has built-in retry logic and waits for elements to appear
- More resilient to timing issues
- Provides better error messages when elements aren't found

#### 4. Drag Events Not Triggering

**Cause:** Single-step drags don't trigger proper events.

**Solution:** Use multi-step drags:

```typescript
// ✅ Good - Multi-step drag properly triggers all events
// WHY: Browser drag detection requires movement across multiple frames
// Single-step movement isn't recognized as a drag by the event system
await userEvent.dragAndDrop(source, target, { steps: 10 })

// ❌ Bad - Single step may not trigger drag events
await userEvent.dragAndDrop(source, target, { steps: 1 })
```

## Writing New Tests

### Checklist for New Integration Tests

- [ ] Test file named `[Feature].spec.tsx`
- [ ] Imports all necessary utilities (render, makeStore, userEvent)
- [ ] Uses `beforeEach` to clear mocks
- [ ] Descriptive test names starting with "should"
- [ ] **START without waits** - Add them only if tests fail due to timing
- [ ] Uses `data-testid` for element selection
- [ ] Tests both authenticated and unauthenticated scenarios (if applicable)
- [ ] Verifies both UI changes and state updates
- [ ] Includes cleanup in `afterEach` if needed
- [ ] Tests pass consistently in CI environment (run multiple times to check for flakiness)

### Example: Adding a New Feature Test

```typescript
import { render } from 'test/appTestUtils'
import { defaultState } from 'test/utils/store'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import { makeStore } from 'store'

describe('New Feature', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should perform expected behavior when user interacts', async () => {
    const store = makeStore(defaultState)
    const { getByTestId } = await render({ store })

    await userEvent.click(getByTestId('trigger-button'))

    await expect.element(getByTestId('result-display')).toBeVisible()

    await expect.poll(() => store.getState().feature.value).toBe('expected')
  })
})
```

## Additional Resources

- [Vitest Browser Mode Documentation](https://vitest.dev/guide/browser/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Vitest Browser userEvent API](https://vitest.dev/guide/browser/interactivity-api)
- [Integration Tests README](../README.md) - Authentication, running tests, CI setup
- [Playwright Trace Viewer](https://playwright.dev/docs/trace-viewer) - Debugging traces

## Summary

Integration tests in the Fishing Map app verify complete user workflows by:

1. **Rendering** the app through TanStack Router with real stores (`RouterProvider` + route tree)
2. **Interacting** with UI elements using userEvent API
3. **Asserting** both UI changes and state updates
4. **Capturing** artifacts (screenshots, traces) on failure

Follow these guidelines to write robust, maintainable integration tests that provide confidence in the application's end-to-end functionality.
