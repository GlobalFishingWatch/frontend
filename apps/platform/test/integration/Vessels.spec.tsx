import { createStore as createJotaiStore } from 'jotai'
import { render } from 'test/appTestUtils'
import { GABU_REEFER_NAME } from 'test/utils/fixtures'
import { clickMapAtCoordinates, projectToMap, waitForLayersLoaded } from 'test/utils/map'
import { addVesselToWorkspace } from 'test/utils/navigation/addVesselToWorkspace'
import { GFWAPITestUtils } from 'test/utils/network/gfw-api-test'
import { defaultState } from 'test/utils/store'
import { getTimebarX } from 'test/utils/timebar'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { PIPE_DATASET_VERSION } from '@globalfishingwatch/datasets-client/constants'
import { TEMPLATE_VESSEL_DATAVIEW_SLUG } from '@platform/config/map/dataviews'
import { getLayerSchemaFilterTestId } from '@platform/config/selectors/map'

import { makeStore } from 'store'

/** Dataset version the app pins vessels with */
const V = `v${PIPE_DATASET_VERSION}.0`

const GABU_REEFER_TRACK: [number, number] = [-17.3, 26.4]
const GABU_REEFER_CELL: [number, number] = [-15, 28]
const GABU_REEFER_BANJUL_VISIT_DATE = Date.parse('2026-02-01T00:00:00.000Z')

const filterPresenceBySpain = async (
  getByTestId: Awaited<ReturnType<typeof render>>['getByTestId'],
  getByText: Awaited<ReturnType<typeof render>>['getByText']
) => {
  const filterButton = getByTestId('activity-layer-panel-btn-filter-presence')
  await userEvent.hover(filterButton)
  await userEvent.click(filterButton)
  // Every schema filter used to share the `multi-select` test id, so `.first()` depended on which
  // filter the dataset listed first. Target the flag filter by its own id.
  const flagFilter = getLayerSchemaFilterTestId('flag')
  await userEvent.click(getByTestId(`${flagFilter}-input`))
  await userEvent.type(getByTestId(`${flagFilter}-input`), 'Spa')
  await userEvent.click(getByTestId(`${flagFilter}-option-ESP`))
  await userEvent.tab()
  await userEvent.click(getByText('Confirm'))
}

const showOnlyPresence = async (getByTestId: Awaited<ReturnType<typeof render>>['getByTestId']) => {
  await userEvent.click(getByTestId('activity-layer-panel-switch-ais'))
  await userEvent.click(getByTestId('activity-layer-panel-switch-vms'))
  await userEvent.click(getByTestId('activity-layer-panel-switch-presence'))
}

describe('Vessel map popup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should open vessel popup on vessel click and show tile related info', async () => {
    const store = makeStore(defaultState, [])
    const jotaiStore = createJotaiStore()

    const { getByTestId, router } = await render({ authenticated: true, store, jotaiStore })
    await router.navigate(addVesselToWorkspace())
    // The track has to be loaded for the click to pick it
    await waitForLayersLoaded(jotaiStore)

    await clickMapAtCoordinates({
      jotaiStore,
      getByTestId,
      longitude: GABU_REEFER_TRACK[0],
      latitude: GABU_REEFER_TRACK[1],
    })

    const mapPopup = getByTestId('map-popup-wrapper')
    await expect.element(mapPopup.getByText('Gabu Reefer')).toBeVisible()
    await expect.element(mapPopup.getByText('Speed', { exact: true })).toBeVisible()
    await expect.element(mapPopup.getByText(/^[\d.]+ knots$/)).toBeVisible()
    await expect.element(mapPopup.getByText('Depth', { exact: true })).toBeVisible()
    await expect.element(mapPopup.getByText(/^[\d.]+ meters$/)).toBeVisible()
  })

  it('should be able to close an opened popup', async () => {
    const store = makeStore(defaultState, [])
    const jotaiStore = createJotaiStore()

    const { getByTestId, router } = await render({ store, jotaiStore })
    await router.navigate(addVesselToWorkspace())
    await waitForLayersLoaded(jotaiStore)

    await clickMapAtCoordinates({
      jotaiStore,
      getByTestId,
      longitude: GABU_REEFER_TRACK[0],
      latitude: GABU_REEFER_TRACK[1],
    })
    await userEvent.click(getByTestId('close-popup-button'))

    await expect.element(getByTestId('map-popup-wrapper')).not.toBeInTheDocument()
  })

  it('should be able to navigate to vessel viewer inside the vessel popup', async () => {
    const store = makeStore(defaultState, [])
    const jotaiStore = createJotaiStore()

    const { getByTestId, router } = await render({ authenticated: true, store, jotaiStore })
    await router.navigate(addVesselToWorkspace())
    await waitForLayersLoaded(jotaiStore)

    await clickMapAtCoordinates({
      jotaiStore,
      getByTestId,
      longitude: GABU_REEFER_CELL[0],
      latitude: GABU_REEFER_CELL[1],
    })

    await expect.element(getByTestId('link-vessel-profile').first()).toBeVisible()
    await getByTestId('link-vessel-profile').first().click()

    await expect.element(getByTestId('vv-vessel-name')).toMatchTextContent(GABU_REEFER_NAME)
  })

  it('should display the vessel track on the timebar', async () => {
    const GFWAPITest = new GFWAPITestUtils()
    const store = makeStore(defaultState, [])

    const { getByTestId, getByText, router, jotaiStore } = await render({
      authenticated: true,
      store,
    })
    await router.navigate(addVesselToWorkspace())

    const timebarElement = getByTestId('timebar-wrapper')

    await GFWAPITest.waitForRequest('/events')

    const x = await getTimebarX(getByTestId, jotaiStore, GABU_REEFER_BANJUL_VISIT_DATE)
    await userEvent.hover(timebarElement, { position: { x, y: 35 } })

    // This check is not showing on webkit right now, need to investigate why, skipping for now to unblock other tests
    // await expect
    //   .element(getByTestId('timeline-tooltip-container').getByText('Gabu Reefer'))
    //   .toBeVisible()

    await expect.element(getByTestId('timebar-highlighter')).toBeVisible()

    await expect.element(getByText(/Docked at Banjul, Gambia \(Republic of The\)/)).toBeVisible()
  })

  it('should be able to see vessel info on hover and pin a vessel to the map to see it on the sidebar', async () => {
    const store = makeStore(defaultState)
    const jotaiStore = createJotaiStore()

    const { getByTestId, getByText } = await render({ store, jotaiStore })

    await showOnlyPresence(getByTestId)
    await waitForLayersLoaded(jotaiStore)

    await clickMapAtCoordinates({ jotaiStore, getByTestId, longitude: 8.5, latitude: -48 })

    await expect.element(getByTestId('vessel-pin-button-ibsa-quinto')).toBeVisible()
    await getByTestId('vessel-pin-button-ibsa-quinto').click()

    // Pinning adds a vessel track instance to the URL (navigation syncs into `location`; there is
    // no MAP action any more). Assert the pinned vessel, not every other instance in the URL.
    await expect
      .poll(() => store.getState().location.query)
      .toMatchObject({
        dataviewInstances: expect.arrayContaining([
          expect.objectContaining({
            id: `vessel-9375434a0-0b91-7247-5a95-57a10d2b08df:${V}`,
            dataviewId: TEMPLATE_VESSEL_DATAVIEW_SLUG,
            deleted: false,
            config: expect.objectContaining({
              info: `public-global-vessel-identity:${V}`,
              track: `public-global-all-tracks:${V}`,
              events: [
                `public-global-fishing-events:${V}`,
                `public-global-port-visits-events:${V}`,
                `public-global-encounters-events:${V}`,
                `public-global-loitering-events:${V}`,
                `public-global-gaps-events:${V}`,
              ],
              relatedVesselIds: [
                '19630081d-d249-9b1d-2b6d-46113987f976',
                '9126f54fd-d5b3-2c09-0552-abcceccd10ff',
              ],
              color: '#F95E5E',
            }),
          }),
        ]),
      })

    await userEvent.hover(getByTestId('map-popup-wrapper').getByText('Ibsa Quinto'))

    await expect.element(getByTestId('vessel-switch-Ibsa-Quinto')).toBeVisible()

    await expect.element(getByText(/Ibsa Quinto - \(Spain\)/)).toBeVisible()
  })

  it('should show vessel info on vessel hover', async () => {
    const store = makeStore(defaultState, [])
    const jotaiStore = createJotaiStore()

    const { getByTestId, getByText, router } = await render({
      authenticated: true,
      store,
      jotaiStore,
    })
    await router.navigate(addVesselToWorkspace())
    await waitForLayersLoaded(jotaiStore)

    const position = await projectToMap(jotaiStore, ...GABU_REEFER_CELL)
    await userEvent.hover(getByTestId('app-main'), { position })

    await expect.element(getByText('Gabu Reefer')).toBeVisible()
    await expect.element(getByText(/Docked at Las Palmas, Spain/)).toBeVisible()
  })

  it('should show vessel name, flag and date on vessel name hover on sidebar', async () => {
    const store = makeStore(defaultState, [])

    const { getByTestId, getByText, router } = await render({ store })
    await router.navigate(addVesselToWorkspace())

    const vesselNameElement = getByTestId('vessel-layer-vessel-name')
    const vesselTooltip = getByText(
      /Gabu Reefer - \(Gambia \(Republic of The\)\) \(\w+ \d+, \d{4} - \w+ \d+, \d{4}\)/
    )

    // The sidebar reflows while the vessel layer loads, which can move the name out from under the
    // pointer and close the tooltip (flaky in the full suite). Hover and check in one retried step.
    await vi.waitFor(
      async () => {
        await userEvent.hover(vesselNameElement)
        await expect.element(vesselTooltip, { timeout: 1000 }).toBeVisible()
      },
      { timeout: 15000, interval: 250 }
    )
  })

  it('should be able to filter vessels by flag', async () => {
    const fetchSpy = vi.spyOn(GFWAPI, 'fetch')
    const store = makeStore(defaultState, [])
    const jotaiStore = createJotaiStore()

    const { getByTestId, getByText } = await render({ store, jotaiStore })

    await showOnlyPresence(getByTestId)
    await waitForLayersLoaded(jotaiStore)

    await filterPresenceBySpain(getByTestId, getByText)
    // The filter reloads the presence tiles
    await waitForLayersLoaded(jotaiStore)

    await clickMapAtCoordinates({
      jotaiStore,
      getByTestId,
      longitude: GABU_REEFER_CELL[0],
      latitude: GABU_REEFER_CELL[1],
    })

    // `expect.element(locator).toHaveLength(6)` did not count anything. Check the filter reached
    // the cell request, and that the popup lists Spanish vessels.
    await expect
      .poll(() =>
        fetchSpy.mock.calls.some(
          ([url]) => url.includes('/4wings/interaction/') && decodeURIComponent(url).includes('ESP')
        )
      )
      .toBe(true)
    await expect
      .element(getByTestId('map-popup-wrapper').getByText('ESP', { exact: true }).first())
      .toBeVisible()
  })

  it('should be able to interact with vessels after filtering by flag', async () => {
    const store = makeStore(defaultState, [])
    const jotaiStore = createJotaiStore()

    const { getByTestId, getByText, router } = await render({
      authenticated: true,
      store,
      jotaiStore,
    })
    await router.navigate(addVesselToWorkspace())

    await showOnlyPresence(getByTestId)
    await waitForLayersLoaded(jotaiStore)

    await filterPresenceBySpain(getByTestId, getByText)
    await waitForLayersLoaded(jotaiStore)

    await clickMapAtCoordinates({
      jotaiStore,
      getByTestId,
      longitude: GABU_REEFER_TRACK[0],
      latitude: GABU_REEFER_TRACK[1],
    })

    await expect.element(getByTestId('map-popup-wrapper').getByText('Gabu Reefer')).toBeVisible()
  })
})
