import { Dataset } from '@globalfishingwatch/api-types'

export const datasets: Dataset[] = [
  {
    alias: ['public-global-fishing-effort:latest'],
    id: 'public-global-fishing-effort:v20201001',
    name: 'AIS fishing bq',
    type: '4wings:v1',
    description:
      'Global Fishing Watch uses data about a vessel’s identity, type, location, speed, direction and more that is broadcast using the Automatic Identification System (AIS) and collected via satellites and terrestrial receivers. AIS was developed for safety/collision-avoidance. Global Fishing Watch analyzes AIS data collected from vessels that our research has identified as known or possible commercial fishing vessels, and applies a fishing presence algorithm to determine “apparent fishing activity” based on changes in vessel speed and direction. The algorithm classifies each AIS broadcast data point for these vessels as either apparently fishing or not fishing and shows the former on the Global Fishing Watch fishing activity heat map. AIS data as broadcast may vary in completeness, accuracy and quality. Also, data collection by satellite or terrestrial receivers may introduce errors through missing or inaccurate data. Global Fishing Watch’s fishing presence algorithm is a best effort mathematically to identify “apparent fishing activity.” As a result, it is possible that some fishing activity is not identified as such by Global Fishing Watch; conversely, Global Fishing Watch may show apparent fishing activity where fishing is not actually taking place. For these reasons, Global Fishing Watch qualifies designations of vessel fishing activity, including synonyms of the term “fishing activity,” such as “fishing” or “fishing effort,” as “apparent,” rather than certain. Any/all Global Fishing Watch information about “apparent fishing activity” should be considered an estimate and must be relied upon solely at your own risk. Global Fishing Watch is taking steps to make sure fishing activity designations are as accurate as possible. Global Fishing Watch fishing presence algorithms are developed and tested using actual fishing event data collected by observers, combined with expert analysis of vessel movement data resulting in the manual classification of thousands of known fishing events. Global Fishing Watch also collaborates extensively with academic researchers through our research program to share fishing activity classification data and automated classification techniques.',
    startDate: '2012-01-01T00:00:00.000Z',
    endDate: null,
    unit: 'hours',
    status: 'done',
    importLogs: null,
    category: 'activity',
    subcategory: 'fishing',
    source: 'Global Fishing Watch - AIS Fishing - BQ',
    ownerId: 78,
    ownerType: 'gfw',
    configuration: {
      table: 'ais_global_v20201001_fishing_effort_public',
      source: 'bigquery',
      dataset: 'ais_global_v20201001_fishing_effort_public_v2',
      project: 'gfw-research',
      version: 2,
      translate: true,
      documentation: {
        type: 'fishing-effort',
        enable: true,
        status: 'Active',
        queries: [
          'https://github.com/GlobalFishingWatch/composer-dags-production/blob/main/dags/publication/ais/v20201001/fishing-effort/public/config.yaml#L3',
        ],
        provider: 'AIS',
      },
      apiSupportedVersions: ['v1', 'v2'],
    },
    createdAt: '2022-01-05T09:55:00.994Z',
    relatedDatasets: [
      {
        id: 'public-global-fishing-tracks:v20201001',
        type: 'carriers-tracks:v1',
      },
      {
        id: 'public-global-fishing-vessels:v20201001',
        type: 'carriers-vessels:v1',
      },
      {
        id: 'public-global-fishing-events:v20201001',
        type: 'carriers-events:v1',
      },
      {
        id: 'public-global-encounters-events:v20201001',
        type: 'carriers-events:v1',
      },
      {
        id: 'public-global-port-visits-c2-events:v20201001',
        type: 'carriers-events:v1',
      },
    ],
    schema: {
      flag: {
        type: 'string',
        maxLength: 3,
        minLength: 3,
      },
      geartype: {
        enum: [
          'tuna_purse_seines',
          'driftnets',
          'trollers',
          'set_longlines',
          'purse_seines',
          'pots_and_traps',
          'other_fishing',
          'dredge_fishing',
          'set_gillnets',
          'fixed_gear',
          'trawlers',
          'fishing',
          'seiners',
          'other_purse_seines',
          'other_seines',
          'squid_jigger',
          'pole_and_line',
          'drifting_longlines',
        ],
        type: 'string',
      },
      vessel_id: {
        type: 'string',
        minLength: 3,
      },
      vesselGroups: {
        type: 'string',
      },
    },
    fieldsAllowed: ['flag', 'vessel_id', 'geartype', 'vesselGroups'],
  } as any,
]

export default datasets
