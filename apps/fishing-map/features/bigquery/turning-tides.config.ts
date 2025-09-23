import { DatasetTypes, type RelatedDataset } from '@globalfishingwatch/api-types'

import type { TurningTidesWorkspaceId } from 'features/track-correction/track-correction.config'

export const TURNING_TIDES_TTL_DAYS = 365 * 2

export type TurningTidesCountryOption = (typeof CountryOptions)[number]
export const CountryOptions: {
  id: TurningTidesWorkspaceId
  label: string
  relatedDatasets: RelatedDataset[]
}[] = [
  {
    id: 'tt-brazil-public',
    label: 'Brazil',
    relatedDatasets: [
      {
        id: 'private-bra-onyxsat-vessel-identity-fishing:v20211126',
        type: DatasetTypes.Vessels, //"vessels:v1"
      },
      {
        id: 'private-bra-onyxsat-vessel-identity-non-fishing:v20211126',
        type: DatasetTypes.Vessels, //"vessels:v1"
      },
    ],
  },
  {
    id: 'tt-chile-public',
    label: 'Chile',
    relatedDatasets: [
      {
        id: 'public-chile-vessel-identity-fishing:v20211126',
        type: DatasetTypes.Vessels, //"vessels:v1"
      },
      {
        id: 'public-chile-vessel-identity-non-fishing:v20211126',
        type: DatasetTypes.Vessels, //"vessels:v1"
      },
    ],
  },
  {
    id: 'tt-peru-public',
    label: 'Peru',
    relatedDatasets: [
      {
        id: 'private-peru-vessel-identity-fishing:v20211126',
        type: DatasetTypes.Vessels, //"vessels:v1"
      },
    ],
  },
]
