import { describe, expect, it } from 'vitest'

import type { Dataview } from '@globalfishingwatch/api-types'
import { EndpointId } from '@globalfishingwatch/api-types'

import { TEMPLATE_VESSEL_DATAVIEW_SLUG, TEMPLATE_VESSEL_DATAVIEW_SLUG_GAPS } from 'data/workspaces'
import { VESSEL_DATAVIEW_SLUG_VMS_PERU } from 'data/workspaces-vms'

import { getVesselDataviewInstance } from './dataviews.utils'

const INFO_DATASET = 'public-global-vessel-identity:v4.0'
const VMS_INFO_DATASET = 'private-per-vessel-identity:v4.0'

const standardTemplate = {
  slug: TEMPLATE_VESSEL_DATAVIEW_SLUG,
  datasetsConfig: [{ datasetId: INFO_DATASET, params: [], endpoint: EndpointId.Vessel }],
} as unknown as Dataview

const gapsTemplate = {
  slug: TEMPLATE_VESSEL_DATAVIEW_SLUG_GAPS,
  datasetsConfig: [{ datasetId: INFO_DATASET, params: [], endpoint: EndpointId.Vessel }],
} as unknown as Dataview

const vmsTemplate = {
  slug: VESSEL_DATAVIEW_SLUG_VMS_PERU,
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
    const instance = getInstance({ dataviewTemplateId: TEMPLATE_VESSEL_DATAVIEW_SLUG_GAPS })
    expect(instance.dataviewId).toBe(TEMPLATE_VESSEL_DATAVIEW_SLUG_GAPS)
  })

  it('falls back to the info-matching template when no dataviewTemplateId is given', () => {
    const instance = getInstance({})
    expect(instance.dataviewId).toBe(TEMPLATE_VESSEL_DATAVIEW_SLUG)
  })

  it('keeps VMS separation by matching the info dataset', () => {
    const instance = getInstance({ datasets: { info: VMS_INFO_DATASET, track: 'track' } })
    expect(instance.dataviewId).toBe(VESSEL_DATAVIEW_SLUG_VMS_PERU)
  })

  it('falls back to the default template slug when no info match exists', () => {
    const instance = getInstance({ datasets: { info: 'unknown-dataset', track: 'track' } })
    expect(instance.dataviewId).toBe(TEMPLATE_VESSEL_DATAVIEW_SLUG)
  })
})
