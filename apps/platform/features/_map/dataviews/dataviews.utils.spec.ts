import { describe, expect, it } from 'vitest'

import type { Dataview } from '@globalfishingwatch/api-types'
import { EndpointId } from '@globalfishingwatch/api-types'
import {
  TEMPLATE_VESSEL_DATAVIEW_SLUG,
  TEMPLATE_VESSEL_GAPS_DATAVIEW_SLUG,
  VESSEL_VMS_PERU_DATAVIEW_SLUG,
} from '@platform/config/map/dataviews'

import { getVesselDataviewInstance } from './dataviews.utils'

const INFO_DATASET = 'public-global-vessel-identity:v4.0'
const VMS_INFO_DATASET = 'private-per-vessel-identity:v4.0'
const VMS_INFO_DATASET_NEXT_VERSION = 'private-per-vessel-identity:v5.0'

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

  it('still matches the country template when the info dataset version moved on', () => {
    const instance = getInstance({
      datasets: { info: VMS_INFO_DATASET_NEXT_VERSION, track: 'track' },
    })
    expect(instance.dataviewId).toBe(VESSEL_VMS_PERU_DATAVIEW_SLUG)
  })

  it('never crosses countries when matching without the version', () => {
    const instance = getInstance({
      datasets: { info: 'private-vms-bra-vessel-identity:v5.0', track: 'track' },
    })
    expect(instance.dataviewId).toBe(TEMPLATE_VESSEL_DATAVIEW_SLUG)
    expect(instance.dataviewId).not.toBe(VESSEL_VMS_PERU_DATAVIEW_SLUG)
  })

  it('prefers an exact match over a version-tolerant one', () => {
    const exactTemplate = {
      slug: TEMPLATE_VESSEL_GAPS_DATAVIEW_SLUG,
      datasetsConfig: [
        { datasetId: VMS_INFO_DATASET_NEXT_VERSION, params: [], endpoint: EndpointId.Vessel },
      ],
    } as unknown as Dataview
    const instance = getVesselDataviewInstance({
      vessel: { id: 'vessel-1' },
      datasets: { info: VMS_INFO_DATASET_NEXT_VERSION, track: 'track' },
      // vmsTemplate (:v4.0) comes first, so only an exact-match-first pass picks the other one
      dataviewTemplates: [vmsTemplate, exactTemplate],
    })
    expect(instance.dataviewId).toBe(TEMPLATE_VESSEL_GAPS_DATAVIEW_SLUG)
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
