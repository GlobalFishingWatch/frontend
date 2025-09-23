import { DatasetTypes, type RelatedDataset } from '@globalfishingwatch/api-types'

import type { TurningTidesWorkspaceId } from 'features/track-correction/track-correction.config'

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
        type: DatasetTypes.Vessels,
      },
      {
        id: 'private-bra-onyxsat-vessel-identity-non-fishing:v20211126',
        type: DatasetTypes.Vessels,
      },
    ],
  },
  {
    id: 'tt-chile-public',
    label: 'Chile',
    relatedDatasets: [
      {
        id: 'public-chile-vessel-identity-fishing:v20211126',
        type: DatasetTypes.Vessels,
      },
      {
        id: 'public-chile-vessel-identity-non-fishing:v20211126',
        type: DatasetTypes.Vessels,
      },
    ],
  },
  {
    id: 'tt-peru-public',
    label: 'Peru',
    relatedDatasets: [
      {
        id: 'private-peru-vessel-identity-fishing:v20211126',
        type: DatasetTypes.Vessels,
      },
    ],
  },
]
