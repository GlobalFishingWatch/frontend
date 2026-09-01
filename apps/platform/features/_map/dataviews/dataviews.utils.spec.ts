import { describe, expect, it } from 'vitest'

import type { Dataset, Dataview } from '@globalfishingwatch/api-types'
import { EndpointId, EventTypes } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { LONGLINE_FISHING_EVENTS_DATASET } from '@platform/config/map/datasets'
import {
  TEMPLATE_VESSEL_DATAVIEW_SLUG,
  TEMPLATE_VESSEL_GAPS_DATAVIEW_SLUG,
  VESSEL_VMS_PERU_DATAVIEW_SLUG,
} from '@platform/config/map/dataviews'

import { getVesselDataviewInstance, withLonglineSetsEvents } from './dataviews.utils'

const INFO_DATASET = 'public-global-vessel-identity:v4.0'
const VMS_INFO_DATASET = 'private-per-vessel-identity:v4.0'

const standardTemplate = {
  slug: TEMPLATE_VESSEL_DATAVIEW_SLUG,
  datasetsConfig: [{ datasetId: INFO_DATASET, params: [], endpoint: EndpointId.Vessel }],
} as unknown as Dataview

const gapsTemplate = {
  slug: TEMPLATE_VESSEL_GAPS_DATAVIEW_SLUG,
  datasetsConfig: [{ datasetId: INFO_DATASET, params: [], endpoint: EndpointId.Vessel }],
} as unknown as Dataview

const vmsTemplate = {
  slug: VESSEL_VMS_PERU_DATAVIEW_SLUG,
  datasetsConfig: [{ datasetId: VMS_INFO_DATASET, params: [], endpoint: EndpointId.Vessel }],
} as unknown as Dataview

const dataviewTemplates = [standardTemplate, gapsTemplate, vmsTemplate]

const getInstance = (params: Partial<Parameters<typeof getVesselDataviewInstance>[0]>) =>
  getVesselDataviewInstance({
    vessel: { id: 'vessel-1' },
    datasets: { info: INFO_DATASET, track: 'track' },
    dataviewTemplates,
    ...params,
  })

describe('getVesselDataviewInstance template selection', () => {
  it('uses the explicit dataviewTemplateId when provided, overriding the info match', () => {
    const instance = getInstance({ dataviewTemplateId: TEMPLATE_VESSEL_GAPS_DATAVIEW_SLUG })
    expect(instance.dataviewId).toBe(TEMPLATE_VESSEL_GAPS_DATAVIEW_SLUG)
  })

  it('falls back to the info-matching template when no dataviewTemplateId is given', () => {
    const instance = getInstance({})
    expect(instance.dataviewId).toBe(TEMPLATE_VESSEL_DATAVIEW_SLUG)
  })

  it('keeps VMS separation by matching the info dataset', () => {
    const instance = getInstance({ datasets: { info: VMS_INFO_DATASET, track: 'track' } })
    expect(instance.dataviewId).toBe(VESSEL_VMS_PERU_DATAVIEW_SLUG)
  })

  it('falls back to the default template slug when no info match exists', () => {
    const instance = getInstance({ datasets: { info: 'unknown-dataset', track: 'track' } })
    expect(instance.dataviewId).toBe(TEMPLATE_VESSEL_DATAVIEW_SLUG)
  })
})

describe('getVesselDataviewInstance trackRealTime ssvid gate', () => {
  const datasets = { info: INFO_DATASET, track: 'track', trackRealTime: 'track-realtime' }

  it('keeps trackRealTime when the vessel carries an ssvid', () => {
    const instance = getInstance({ vessel: { id: 'vessel-1', ssvid: '224000000' }, datasets })
    expect(instance.config?.trackRealTime).toBe('track-realtime')
  })

  it('drops trackRealTime when there is no ssvid to query it with', () => {
    const instance = getInstance({ datasets })
    expect(instance.config?.trackRealTime).toBeUndefined()
    expect(instance.config?.track).toBe('track')
  })
})

describe('withLonglineSetsEvents', () => {
  const fishingDatasetId = 'public-global-fishing-events:v3.0'
  const fishingEventsConfig = {
    datasetId: fishingDatasetId,
    endpoint: EndpointId.Events,
    params: [],
    query: [{ id: 'vessels', value: ['vessel-1'] }],
  }
  const dataview = {
    id: 'vessel-vessel-1',
    datasetsConfig: [fishingEventsConfig],
  } as UrlDataviewInstance
  const fishingDataset = { id: fishingDatasetId, subcategory: EventTypes.Fishing } as Dataset
  const longlineDataset = { id: LONGLINE_FISHING_EVENTS_DATASET } as Dataset

  it('swaps the fishing events dataset and upserts day/night includes', () => {
    const result = withLonglineSetsEvents(dataview, [fishingDataset, longlineDataset])
    const eventsConfig = result.datasetsConfig?.find(
      (config) => config.endpoint === EndpointId.Events
    )
    expect(eventsConfig?.datasetId).toBe(LONGLINE_FISHING_EVENTS_DATASET)
    expect(eventsConfig?.query).toEqual([
      { id: 'vessels', value: ['vessel-1'] },
      {
        id: 'includes',
        value: ['fishing.dayNightCategory', 'fishing.fractionAtNight'],
      },
    ])
  })

  it('appends includes onto an existing includes query', () => {
    const withIncludes = {
      ...dataview,
      datasetsConfig: [
        {
          ...fishingEventsConfig,
          query: [
            { id: 'vessels', value: ['vessel-1'] },
            { id: 'includes', value: ['existing'] },
          ],
        },
      ],
    } as UrlDataviewInstance
    const result = withLonglineSetsEvents(withIncludes, [fishingDataset, longlineDataset])
    const eventsConfig = result.datasetsConfig?.find(
      (config) => config.endpoint === EndpointId.Events
    )
    expect(eventsConfig?.query?.find((query) => query.id === 'includes')?.value).toEqual([
      'existing',
      'fishing.dayNightCategory',
      'fishing.fractionAtNight',
    ])
  })

  it('is a no-op when the longline dataset is not loaded', () => {
    expect(withLonglineSetsEvents(dataview, [fishingDataset])).toBe(dataview)
  })

  it('is a no-op when there is no fishing events config', () => {
    const noEvents = { ...dataview, datasetsConfig: [] } as UrlDataviewInstance
    expect(withLonglineSetsEvents(noEvents, [fishingDataset, longlineDataset])).toBe(noEvents)
  })
})
