// PREDEFINED URLS
const FULL_MAP_PARAMS = 'latitude=0&longitude=0&zoom=0.5'
export const URL_ONE_MONTH =
  '/?start=2022-01-01T00%3A00%3A00.000Z&end=2022-02-28T00%3A00%3A00.000Z&dvIn[1][id]=vms&dvIn[1][cfg][vis]=false'

export const URL_FULL_DATA_AREA =
  '/?start=2012-01-01T00%3A00%3A00.000Z&end=2023-12-31T00%3A00%3A00.000Z&latitude=38.52482493227137&longitude=120.93347111612252&zoom=9.708387652927911'

export const URL_YEAR_2018 =
  '/?start=2018-01-01T00%3A00%3A00.000Z&end=2019-01-01T00%3A00%3A00.000Z&' + FULL_MAP_PARAMS

export const URL_VESSEL_PROFILE =
  '/map/fishing-activity/default-public/vessel/3d92d0d1e-ed36-e1bd-fd55-3735c2a5485e?start=2021-01-01T00%3A00%3A00.000Z&end=2024-01-01T00%3A00%3A00.000Z&latitude=-51.41842735496924&longitude=-16.9961338043213&zoom=2.3748783848980315&dvIn[0][id]=vessel-3d92d0d1e-ed36-e1bd-fd55-3735c2a5485e&dvIn[0][dvId]=fishing-map-vessel-track-v-3&dvIn[0][cfg][track]=public-global-all-tracks%3Av20231026&dvIn[0][cfg][info]=public-global-vessel-identity%3Av3.0&dvIn[0][cfg][events][0]=public-global-fishing-events%3Av20231026&dvIn[0][cfg][events][1]=public-global-port-visits-c2-events%3Av20231026&dvIn[0][cfg][events][2]=public-global-encounters-events%3Av20231026&dvIn[0][cfg][events][3]=public-global-loitering-events%3Av20231026&dvIn[0][cfg][events][4]=public-global-gaps-events%3Av20231026&dvIn[0][cfg][clr]=%23F95E5E&dvIn[0][datasetsConfigMigration][public-global-all-tracks:v20231026]=public-global-all-tracks%3Av3.0&dvIn[0][datasetsConfigMigration][public-global-fishing-events:v20231026]=public-global-fishing-events%3Av3.0&dvIn[0][datasetsConfigMigration][public-global-loitering-events:v20231026]=public-global-loitering-events%3Av3.0&dvIn[0][datasetsConfigMigration][public-global-encounters-events:v20231026]=public-global-encounters-events%3Av3.0&dvIn[0][datasetsConfigMigration][public-global-gaps-events:v20231026]=public-global-gaps-events%3Av3.0&lTD=&fTD=&tV=vessel&vDi=public-global-vessel-identity%3Av3.0&vE[0]=encounter&vE[1]=port_visit&tk[0]=public-global-vessel-identity%3Av3.0'

export const URL_VESSEL_PROFILE_2020 =
  '/map/fishing-activity/default-public/vessel/3d92d0d1e-ed36-e1bd-fd55-3735c2a5485e?start=2021-01-01T00%3A00%3A00.000Z&end=2024-01-01T00%3A00%3A00.000Z&latitude=-51.62826704426086&longitude=-48.04732049999999&zoom=2.746324859308452&dvIn[0][id]=vessel-3d92d0d1e-ed36-e1bd-fd55-3735c2a5485e&dvIn[0][dvId]=fishing-map-vessel-track&dvIn[0][cfg][track]=public-global-all-tracks%3Av20231026&dvIn[0][cfg][info]=public-global-vessel-identity%3Av20231026&dvIn[0][cfg][events][0]=public-global-fishing-events%3Av20231026&dvIn[0][cfg][events][1]=public-global-port-visits-c2-events%3Av20231026&dvIn[0][cfg][events][2]=public-global-encounters-events%3Av20231026&dvIn[0][cfg][events][3]=public-global-loitering-events%3Av20231026&dvIn[0][cfg][events][4]=public-global-gaps-events%3Av20231026&dvIn[0][cfg][clr]=%23F95E5E&lTD=&fTD=&timebarVisualisation=vessel&vesselDatasetId=public-global-vessel-identity%3Av20231026&visibleEvents[0]=loitering&visibleEvents[1]=encounter&visibleEvents[2]=port_visit&tk[0]=public-global-vessel-identity%3Av20231026'

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
