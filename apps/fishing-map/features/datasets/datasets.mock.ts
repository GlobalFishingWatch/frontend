import {
  Dataset,
  DatasetCategory,
  DatasetStatus,
  DatasetTypes,
} from '@globalfishingwatch/api-types'

export const SKYLIGHT_ENCOUNTERS_DATASET_ID = 'skylight-encounters'
export const SKYLIGHT_LOITERING_DATASET_ID = 'skylight-loitering'
export const SKYLIGHT_FISHING_DATASET_ID = 'skylight-fishing'

export const datasets: Dataset[] = [
  {
    alias: null,
    id: SKYLIGHT_ENCOUNTERS_DATASET_ID,
    name: 'Standard Rendezvous',
    type: DatasetTypes.TemporalContext,
    description:
      'A Standard Rendezvous indicates when two AIS-transmitting vessels have come within a short distance together, which is helpful for (but not exclusive to) analyzing potential, at-sea transshipment events. Skylight uses a rules-based method to determine whether two vessels are participating in a rendezvous. Two vessels have to come within a short distance of each other for at least 30 minutes and travel at approximately the same speed and heading to be considered a rendezvous. When Skylight says “short distance”, vessels should be within 250 meters of each other within 3 minutes of the AIS position reports.There are some additional parameters Skylight applies to try and exclude activities like vessels carrying fishing equipment outfitted with AIS. Source: Skylight',
    startDate: '2015-01-01T00:00:00.000Z',
    status: DatasetStatus.Done,
    category: DatasetCategory.RealTime,
    subcategory: '',
    source: 'Skylight',
    ownerId: 0,
    ownerType: 'user',
    configuration: {},
    createdAt: '',
    relatedDatasets: [],
    schema: {},
    fieldsAllowed: [],
  },
  {
    alias: null,
    id: SKYLIGHT_LOITERING_DATASET_ID,
    name: 'Dark Rendezvous',
    type: DatasetTypes.TemporalContext,
    description:
      "A Dark Rendezvous is when a single vessel transmitting AIS displays tracks resembling potential at-sea transshipment. This behavior includes slowing down and making loitering maneuvers. These events are considered 'dark' because the other vessel that is potentially part of the transshipment is not transmitting AIS.. OSR stands for One Sided Rendezvous. Source: Skylight",
    startDate: '2015-01-01T00:00:00.000Z',
    status: DatasetStatus.Done,
    category: DatasetCategory.RealTime,
    subcategory: '',
    source: 'Skylight',
    ownerId: 0,
    ownerType: 'user',
    configuration: {},
    createdAt: '',
    relatedDatasets: [],
    schema: {},
    fieldsAllowed: [],
  },
  {
    alias: null,
    id: SKYLIGHT_FISHING_DATASET_ID,
    name: 'Fishing events',
    type: DatasetTypes.TemporalContext,
    description:
      'The model was also trained with fisheries observer data from the North Atlantic. The model now recognizes similar behavior while processing all incoming AIS positions. The model has been trained to recognize trawling, purse seining, long lining, and squid jigging. Gill netting and pole & line examples were not provided to the model. Source: Skylight',
    startDate: '2015-01-01T00:00:00.000Z',
    status: DatasetStatus.Done,
    category: DatasetCategory.RealTime,
    subcategory: '',
    source: 'Skylight',
    ownerId: 0,
    ownerType: 'user',
    configuration: {},
    createdAt: '',
    relatedDatasets: [],
    schema: {},
    fieldsAllowed: [],
  },
]

export default datasets
