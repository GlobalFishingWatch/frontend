import type { StrapiBaseAttributes } from 'features/cms/strapi.types'

export type DataTerminologySlugs =
  | 'authorization'
  | 'encounter'
  | 'fishing'
  | 'fishingLicenseStatus'
  | 'fleetCode'
  | 'geartype'
  | 'geartypeBRA'
  | 'insights'
  | 'insightsCoverage'
  | 'insightsFishing'
  | 'insightsFlagsChanges'
  | 'insightsGaps'
  | 'insightsIUU'
  | 'insightsMOUList'
  | 'insightsVesselGroups'
  | 'loitering'
  | 'operator'
  | 'owner'
  | 'port_visit'
  | 'portVisitAfter'
  | 'registryInfo'
  | 'registrySources'
  | 'selfReported'
  | 'shiptype'
  | 'shiptypeBRA'
  | 'sources'
  | 'vessels'

export type DataTerminology = StrapiBaseAttributes & {
  title?: string
  slug: DataTerminologySlugs
  description: string
}
