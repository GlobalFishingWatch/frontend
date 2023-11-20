// PREDEFINED URLS
const FULL_MAP_PARAMS = 'latitude=0&longitude=0&zoom=0.5'
export const URL_ONE_MONTH =
  '/?start=2022-01-01T00%3A00%3A00.000Z&end=2022-02-28T00%3A00%3A00.000Z&dvIn[1][id]=vms-with-png&dvIn[1][cfg][vis]=false'

export const URL_FULL_DATA_AREA =
  '/?start=2012-01-01T00%3A00%3A00.000Z&end=2023-12-31T00%3A00%3A00.000Z&latitude=38.52482493227137&longitude=120.93347111612252&zoom=9.708387652927911'

export const URL_YEAR_2018 =
  '/?start=2018-01-01T00%3A00%3A00.000Z&end=2019-01-01T00%3A00%3A00.000Z&' + FULL_MAP_PARAMS

// API URLS
export const API_URL_VESSELS = '/v3/vessels*'
export const API_URL_SEARCH_VESSELS = '/v3/vessels/search*'
export const API_URL_4WINGS_TILES = '/v3/4wings/tile/heatmap/*/*/*'
export const API_URL_4WINGS_REPORT = '/v3/4wings/report*'

// CUSTOM API URLS
export const API_URL_GALAPAGOS_INFO = '/v3/datasets/public-eez-areas/context-layers/8403?'

//WORKSPACES
export const API_URL_WORKSPACES_LIST =
  '/v3/workspaces?app=fishing-map&logged-user-or-gfw=true&limit=999999&offset=0'
export const API_URL_WORKSPACES_DELETE = '/v3/workspaces/%WORKSPACE_ID%'
