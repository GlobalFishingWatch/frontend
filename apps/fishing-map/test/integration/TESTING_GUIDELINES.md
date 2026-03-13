# Integration Testing Guidelines

## Overview

Integration tests verify that different parts of the Fishing Map application work together correctly. These tests run in a browser environment using Vitest Browser Mode and test complete user workflows from UI interaction to state management.

**Location:** `/apps/fishing-map/test/integration/`

**Technology Stack:**
- **Test Framework:** Vitest with Browser Mode
- **Rendering:** React Testing Library (vitest-browser-react)
- **State Management:** Redux + Jotai
- **User Interactions:** @vitest/browser userEvent API
- **Artifacts:** Screenshots and Playwright traces

## Test Structure

### File Organization

Each test file focuses on a specific feature or component:

```
test/integration/
├── App.spec.tsx              # Core app functionality
├── Datasets.spec.tsx          # Layer management (reference, environment, events, detections)
├── Map.spec.tsx               # Map rendering and interactions
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
import React from 'react'
import { createStore as createJotaiStore } from 'jotai'
import { render } from 'test/appTestUtils'
import { defaultState } from 'test/defaultState'
import { createTestingMiddleware } from 'test/testingStoreMiddeware'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import App from 'features/app/App'
import { makeStore } from 'store'

describe('Feature Name', () => {
  beforeEach(() => {
    // WHY: Clear all mocks before each test to ensure test isolation
    // Without this, spies and mocks from previous tests could affect subsequent tests
    vi.clearAllMocks()
  })

  it('should describe expected behavior', async () => {
    // WHY: makeStore creates a Redux store with initial state and optional middleware
    const store = makeStore(defaultState, [], true)
    // WHY: Jotai store needed to access map-specific atoms (mapInstanceAtom, viewStateAtom)
    // Map viewport state (lat/lng/zoom) is managed in Jotai, not Redux
    const jotaiStore = createJotaiStore()
    const { getByTestId } = await render(<App />, { store, jotaiStore })

    // Your test logic here
  })
})
```

## Common Test Casuistics

### 1. **State Synchronization**

Testing that UI changes properly update application state (Redux + URL).

**Pattern:**
```typescript
it('should reflect store changes on layer toggle', async () => {
  // WHY: Testing middleware captures all Redux actions for verification
  // This allows us to inspect the action history and verify state changes
  const testingMiddleware = createTestingMiddleware()
  const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
  const { getByTestId } = await render(<App />, { store })

  await getByTestId('activity-layer-panel-switch-ais').click()

  // WHY: Get all dispatched actions to find the one we're testing
  // filtering out 'middlewareRegistered' actions automatically
  const actions = testingMiddleware.getActions()
  // WHY: findLast gets the most recent HOME action (navigation action)
  // HOME actions contain the full URL state including dataviewInstances
  const toggleAction = actions.findLast((action) => action.type === 'HOME')

  // WHY: Verify both the action payload AND the resulting store state
  // This ensures the UI interaction → action → reducer → state flow works correctly
  expect(toggleAction?.query.dataviewInstances).toMatchObject(expectedResult)
  expect(store.getState()?.location?.query?.dataviewInstances).toMatchObject(expectedResult)
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
  const { getByTestId } = await render(<App />, { store, jotaiStore })

  // WHY: Wait 3000ms for map initialization and vessel data to fully load
  // Map must: initialize deck.gl, fetch tiles, render layers, and position vessels
  // This is longer than layer loading (2000ms) because it includes full map bootstrap
  // ⚠️ IMPORTANT: This wait is REQUIRED because we're about to interact with map features
  // that depend on tiles being loaded. Without it, the click coordinates won't find any vessels.
  await new Promise((resolve) => setTimeout(resolve, 3000))

  const mapInstance = jotaiStore.get(mapInstanceAtom)
  const viewport = mapInstance?.getViewports?.().find((v: any) => v.id === MAP_VIEW_ID)
  // WHY: Convert geographic coordinates [longitude, latitude] to screen pixels [x, y]
  // The map uses geographic coordinates, but user interactions (clicks) require screen coordinates
  // viewport.project() handles the transformation based on current zoom/pan state
  const [x, y] = viewport?.project([-17.3, 26.4]) || [0, 0]

  // WHY: Hovering before clicking ensures the map's hover state is properly set
  // This makes feature selection more reliable, especially with overlapping features
  await userEvent.hover(mapElement, { position: { x, y } })
  
  // WHY: Wait 500ms for hover state to stabilize before clicking
  // The map hover detection has debouncing logic; immediate clicks may miss the feature
  // ⚠️ IMPORTANT: This wait is REQUIRED because hover state is debounced
  await new Promise((resolve) => setTimeout(resolve, 500))
  
  await userEvent.click(mapElement, { position: { x, y } })

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
  // WHY: Testing middleware captures Redux actions so we can verify state changes
  const testingMiddleware = createTestingMiddleware()
  const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
  const { getByTestId } = await render(<App />, { store })

  await getByTestId('activity-add-layer-button').click()
  await getByTestId('add-layer-eez-button').click()

  // WHY: Wait 2000ms for layer data to load and tiles to be fetched from the API
  // Layer addition triggers async operations: API calls, tile loading, and deck.gl layer creation
  // ⚠️ IMPORTANT: This wait is ONLY needed if we're going to interact with the map after this
  // (e.g., clicking on a feature that depends on the loaded tiles)
  // If we're only checking the Redux action, this wait might not be necessary!
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const actions = testingMiddleware.getActions()
  const addLayerAction = actions.findLast((action) => action.type === 'HOME')

  // WHY: Use expect.stringContaining for IDs because they include timestamps
  // Layer IDs are generated as 'eez__1771416000000' (dataviewId + timestamp)
  // ℹ️ NOTE: This assertion doesn't need a wait because we're checking the Redux action,
  // not the rendered map. The action is dispatched immediately when the button is clicked.
  expect(addLayerAction?.query).toMatchObject({
    dataviewInstances: [{ id: expect.stringContaining('eez'), category: 'context' }]
  })
})
```

**Layer Categories Tested:**
- **Reference Layers:** EEZ, MPA, RFMO boundaries
- **Environment Layers:** Bathymetry, SST, chlorophyll
- **Events Layers:** Port visits, encounters, loitering
- **Detection Layers:** AIS, VMS, SAR, Optical
- **User Layers:** Tracks, polygons, points, BigQuery

### 4. **Authentication Flows**

Testing authenticated vs. unauthenticated user experiences.

**Pattern:**
```typescript
it('should show login prompt when user is not logged in', async () => {
  // WHY: Not passing 'authenticated: true' means the test runs as a guest user
  // This allows us to test the login prompt that should appear for unauthenticated users
  const { getByRole } = await render(<App />, { store })

  await getByTestId('activity-add-layer-button').click()
  await userEvent.click(getByRole('button', { name: 'User' }))

  expect(getByRole('dialog').getByText('Register or login to upload datasets')).toBeVisible()
})

it('should show user dataset sections when user is logged in', async () => {
  // WHY: authenticated: true loads pre-fetched auth tokens from /.auth/tokens.json
  // This avoids navigating to external OAuth pages which would break the iframe-based test environment
  // Global setup authenticates once and saves tokens; tests reuse them for speed and reliability
  const { getByRole, getByText } = await render(<App />, { store, authenticated: true })

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
  const { getByTestId } = await render(<App />, { store, jotaiStore })
  const timebarWrapper = getByTestId('timebar-wrapper')

  // WHY: Wait 3000ms for map and timebar to fully initialize
  await new Promise((resolve) => setTimeout(resolve, 3000))

  // WHY steps: 5 → Multi-step drags are required to properly trigger drag events
  // Single-step drags are not captured by the event system; intermediate steps ensure proper event firing
  await userEvent.dragAndDrop(timebarWrapper, timebarWrapper, {
    sourcePosition: { x: 400, y: 35 },
    targetPosition: { x: 700, y: 35 },
    steps: 5,
  })

  const actions = testingMiddleware.getActions()
  const timebarAction = actions.findLast((action) => action.type === 'timebar/setHighlightedTime')
  
  // WHY: Verify the timebar interaction triggered the expected Redux action
  // This ensures the timeline scrubbing updates the application state correctly
  expect(timebarAction).toBeDefined()
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
it('should render tabs and vessel basic info', async () => {
  const { getByTestId, getByText } = await render(<App />, { store })
  
  store.dispatch(navigateToVesselViewerAction)

  await expect.element(getByTestId('vv-vessel-name')).toHaveTextContent('Gabu Reefer')
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
it('can search for a vessel and see it on the map', async () => {
  const { getByTestId } = await render(<App />, { store, jotaiStore })

  store.dispatch(navigateToVesselSearchAction)

  await userEvent.type(getByTestId('search-vessels-basic-input'), 'Gabu Reefer')
  await userEvent.click(getByTestId('link-vessel-profile'))

  await new Promise((resolve) => setTimeout(resolve, 3000))

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
  const { getByTestId } = await render(<App />, { store, jotaiStore })

  // ⚠️ IMPORTANT: Wait for initial data to load before assertions
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Perform action that triggers API calls
  await userEvent.click(getByTestId('map-control-zoom-in'))
  await new Promise((resolve) => setTimeout(resolve, 1000))

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
import { GFWAPITestUtils } from 'test/utils/network/gfw-api-test'

it('should wait for API request to complete', async () => {
  // WHY: GFWAPITestUtils wraps the fetch spy with convenient helpers
  // waitForRequest() waits for a specific API call to complete before continuing
  const GFWAPITest = new GFWAPITestUtils()
  const { getByTestId } = await render(<App />, { store })

  store.dispatch(addVesselToWorkspaceAction)

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
  const { getByTestId } = await render(<App />, { store })

  await getByTestId('map-control-zoom-in').click()
  await new Promise((resolve) => setTimeout(resolve, 1100))
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
  const { getByTestId, getByRole } = await render(<App />, { store })

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
  const { getByTestId } = await render(<App />, { store })

  await getByTestId('activity-add-layer-button').click()
  await getByTestId('add-layer-button').click()
  
  // ⚠️ DECISION POINT: Do we need this wait?
  // - YES if we're clicking map features that depend on loaded data
  // - NO if we're just checking that UI elements appear (expect.element() retries automatically)
  
  // Example 1: Wait IS needed - interacting with loaded data
  await new Promise((resolve) => setTimeout(resolve, 2000))
  const mapElement = getByTestId('app-main')
  await userEvent.click(mapElement, { position: { x: 100, y: 100 } })
  
  // Example 2: Wait NOT needed - just checking UI rendered
  await expect.element(getByTestId('data-display')).toBeVisible()
})
```

**Wait Times by Operation:**
> **⚠️ IMPORTANT:** These wait times are **NOT required in every test**. Only add waits when you detect timing issues or flakiness. Many tests will work without explicit waits because `expect.element()` has built-in retry logic. Add waits only when:
> - Data must be fetched from an API before interaction
> - Animations/transitions must complete before next action
> - Debounced operations need time to settle
> - Map layers need time to render tiles
>
> Start without waits, then add them only if tests fail due to timing.

- Map initialization: `3000ms` (only when interacting with map features immediately after render)
- Layer data loading: `2000ms` (only when clicking map features that depend on loaded tiles)
- Debounced URL updates: `1500ms` (only when asserting URL state after map interactions)
- Hover tooltip delay: `300ms-500ms` (only when clicking elements revealed by hover)
- UI animations: `200ms` (only when elements have CSS transitions)

## Best Practices

> ### ⚠️ Critical: Don't Add Unnecessary Waits!
> 
> **Start without waits** - Many tests work perfectly without explicit `setTimeout` calls because:
> - `expect.element()` has built-in retry logic
> - Most UI rendering is fast enough
> - Premature waits make tests slower and harder to maintain
> 
> **Add waits only when:**
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

⚠️ **Use waits sparingly** - Only add them when tests fail due to timing issues.

Many assertions don't need explicit waits because `expect.element()` has built-in retry logic. Add waits only when:
- Testing behavior that occurs AFTER an async operation completes
- Interacting with elements that appear after data loads
- Asserting state changes from debounced operations

```typescript
// ✅ Good - Wait only when needed (e.g., for debounced URL updates)
await getByTestId('map-control-zoom-in').click()
// WHY: URL updates are debounced 1000ms, so we wait 1500ms (1000ms + buffer)
await new Promise((resolve) => setTimeout(resolve, 1500))
expect(store.getState().location.query.zoom).toBe(2.49)

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

### 4. **Use Testing Middleware for Redux Actions**

Track Redux actions using the custom testing middleware.

```typescript
const testingMiddleware = createTestingMiddleware()
const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)

// ... perform actions ...

const actions = testingMiddleware.getActions()
const targetAction = actions.findLast((action) => action.type === 'TARGET_TYPE')
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
// WHY: Hovering reveals hidden UI elements (buttons, tooltips, menus)
// Layer panel buttons are hidden until hover to reduce visual clutter
await userEvent.hover(removeButton)

// WHY: Wait 300ms for hover animation/transition to complete
// Without this, the click might occur before buttons are fully visible and clickable
await new Promise((resolve) => setTimeout(resolve, 300))
await removeButton.click()

// ❌ May miss hover-dependent actions
// This could fail if the button isn't visible without hovering first
await removeButton.click()
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
  await render(<App />, { store }) // Unauthenticated
  // assertions...
})

it('shows content for logged-in users', async () => {
  // WHY: authenticated: true loads pre-fetched auth tokens from /.auth/tokens.json
  // This avoids navigating to external OAuth pages which would break the iframe-based test environment
  await render(<App />, { store, authenticated: true }) // Authenticated
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

await render(<App />, {
  store,                    // Redux store (optional, creates new if not provided)
  jotaiStore,              // Jotai store (optional, creates new if not provided)
  authenticated: true,     // Pre-authenticate the test (optional)
})
```

**Features:**
- Wraps component in Redux and Jotai providers
- Handles authentication token loading from `.auth/tokens.json`
  - WHY: Tokens are fetched only once and reused across all tests for performance
  - WHY: Re-authenticating for every test would be slow and unnecessary since tokens are long-lived
- Mocks `GFWAPI.logout()` for authenticated tests
  - WHY: Tests share the same auth tokens for performance (one global authentication)
  - WHY: If a test calls logout() and it hits the real API, it would invalidate the token for all tests
  - Solution: Mock logout to only clear localStorage (local effect) without API calls (global effect)
- Ensures `__next` element exists for modals
  - WHY: Next.js modals and portals render into #__next element by default
  - WHY: In the test environment, this element doesn't exist automatically
  - Without it, modal rendering would fail with "Target container is not a DOM element"

### Default State

Located in [defaultState.ts](../defaultState.ts)

Provides a consistent starting state for all tests.

```typescript
import { defaultState } from 'test/defaultState'

const store = makeStore(defaultState, [], true)
```

### Testing Middleware

Located in [testingStoreMiddeware.ts](../testingStoreMiddeware.ts)

Captures Redux actions for verification.

```typescript
import { createTestingMiddleware } from 'test/testingStoreMiddeware'

// WHY: Each test should have its own middleware instance for isolation
// Prevents action history from one test affecting another
const testingMiddleware = createTestingMiddleware()

// WHY: Pass middleware array to makeStore to intercept all Redux actions
// The middleware records every action that flows through the store
const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)

// ... perform actions ...

// WHY: Get all dispatched actions to verify the action flow
// Automatically filters out 'middlewareRegistered' actions (Redux Toolkit internals)
const actions = testingMiddleware.getActions()

// WHY: findLast gets the most recent action of a specific type
// Useful when multiple actions of the same type are dispatched during a test
const lastAction = actions.findLast((action) => action.type === 'TARGET_TYPE')
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

### Navigation Actions

Located in `test/utils/actions/`

Pre-built actions for setting up application state programmatically.

> **Important:** These actions are NOT for testing navigation itself. They are for **setting up test preconditions** by dispatching Redux actions directly, bypassing the UI. This makes tests faster and more focused on the specific feature being tested.

```typescript
import { addVesselToWorkspaceAction } from 'test/utils/actions/addVesselToWorkspace'
import { navigateToVesselViewerAction } from 'test/utils/actions/navigateToVesselViewer'
import { navigateToVesselSearchAction } from 'test/utils/actions/navigateToVesselSearch'

// WHY: Dispatch action directly to set up the desired state
// This avoids having to simulate clicking through the UI to reach the vessel viewer
// Use this when you want to TEST the vessel viewer, not the navigation to it
store.dispatch(navigateToVesselViewerAction)
```

**When to use:**
- When you need the app in a specific state to test a feature
- To skip irrelevant UI interactions and focus on what you're testing
- To make tests faster by avoiding multi-step UI setup
- When the state setup is complex and would require many user interactions

**When NOT to use:**
- When you're actually testing the navigation flow itself
- When you need to verify that UI interactions trigger the correct state changes

## Debugging Tests

### Local Debugging

```bash
# Run all tests
nx test fishing-map

# Run with interactive UI (recommended for debugging)
nx test:ui fishing-map

# Run specific test file
nx test fishing-map Vessels.spec.tsx

# Run in CI environment (Docker)
nx test:ci fishing-map
```

### Reading Test Artifacts

After a test failure, artifacts are saved to:

- **Screenshots:** `test/integration/__screenshots__/`
- **Traces:** `test/integration/__traces__/`

**View a trace file:**
```bash
npx playwright show-trace "apps/fishing-map/test/integration/__traces__/Vessels.spec.tsx/trace-file.trace.zip"
```

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
const { getByTestId } = await render(<App />, { store, authenticated: true })

// ❌ Don't navigate to actual login pages in tests
await getByTestId('login-button').click() // This will break in iframe mode
```

#### 2. Flaky Tests Due to Timing

**Cause:** Async operations not fully completed before assertions.

**Solution:** Add wait times **only when needed** - don't add them preemptively!

```typescript
// WHY: Wait for async operations (API calls, animations, state updates)
// Without waiting, assertions may execute before data is ready, causing flaky failures
await new Promise((resolve) => setTimeout(resolve, 2000))
```

**When to add waits:**
1. **Start without waits** - Let `expect.element()` retry logic handle most cases
2. **Run the test** - See if it fails due to timing
3. **Add targeted waits** - Only where timing issues are detected
4. **Use minimum wait time** - Don't add extra buffer "just in case"

**Standard wait times by operation:**
- Map initialization: `3000ms` (full bootstrap with tiles)
- Layer data loading: `2000ms` (API + rendering)
- Debounced URL updates: `1500ms` (1000ms debounce + 500ms buffer)
- Hover tooltip delay: `300ms-500ms` (CSS transitions)
- UI animations: `200ms` (simple transitions)

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
import React from 'react'
import { render } from 'test/appTestUtils'
import { defaultState } from 'test/defaultState'
import { createTestingMiddleware } from 'test/testingStoreMiddeware'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import App from 'features/app/App'
import { makeStore } from 'store'

describe('New Feature', () => {
  beforeEach(() => {
    // WHY: Clear all mocks before each test to ensure test isolation
    vi.clearAllMocks()
  })

  it('should perform expected behavior when user interacts', async () => {
    // 1. Setup
    // WHY: Testing middleware captures all Redux actions for verification
    const testingMiddleware = createTestingMiddleware()
    // WHY: Create store with testing middleware to intercept actions
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const { getByTestId } = await render(<App />, { store })

    // 2. Act
    // WHY: Simulate user interaction with the feature
    await userEvent.click(getByTestId('trigger-button'))
    
    // ⚠️ DECISION: Do we need to wait here?
    // - Start WITHOUT this wait and run the test
    // - Add it ONLY if the test fails due to timing
    // - Ask: Does the next assertion depend on async operations completing?
    
    // If yes, add a targeted wait:
    // WHY: Wait 500ms for async operations to complete
    // Adjust this based on your feature's requirements (API calls, animations, etc.)
    // await new Promise((resolve) => setTimeout(resolve, 500))

    // 3. Assert UI
    // WHY: Verify the UI changed in response to the user interaction
    // ℹ️ NOTE: No wait needed here - expect.element() has built-in retry logic
    await expect.element(getByTestId('result-display')).toBeVisible()

    // 4. Assert State
    // WHY: Verify the Redux state was updated correctly
    const actions = testingMiddleware.getActions()
    const targetAction = actions.findLast((action) => action.type === 'EXPECTED_ACTION')
    expect(targetAction).toBeDefined()
    expect(store.getState().feature.value).toBe('expected')
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

1. **Rendering** the full App component with real stores
2. **Interacting** with UI elements using userEvent API
3. **Asserting** both UI changes and state updates
4. **Capturing** artifacts (screenshots, traces) on failure

Follow these guidelines to write robust, maintainable integration tests that provide confidence in the application's end-to-end functionality.
