type MapUrl = {
  id: string
  url: string
}

const MARINE_MANAGER_URLS: MapUrl[] = [
  { id: 'ascension', url: 'https://globalfishingwatch.org/map/marine-manager/ascension-public' },
  {
    id: 'cmar_core_mpas',
    url: 'https://globalfishingwatch.org/map/marine-manager/cmar_core_mpas-public',
  },
  { id: 'colombia', url: 'https://globalfishingwatch.org/map/marine-manager/colombia-public' },
  {
    id: 'costa_rica',
    url: 'https://globalfishingwatch.org/map/marine-manager/costa_rica-public',
  },
  { id: 'fiji', url: 'https://globalfishingwatch.org/map/marine-manager/fiji-public' },
  { id: 'galapagos', url: 'https://globalfishingwatch.org/map/marine-manager/galapagos-public' },
  { id: 'guyana', url: 'https://globalfishingwatch.org/map/marine-manager/guyana-public' },
  { id: 'maldives', url: 'https://globalfishingwatch.org/map/marine-manager/maldives-public' },
  {
    id: 'marshall_islands',
    url: 'https://globalfishingwatch.org/map/marine-manager/marshall_islands-public',
  },
  {
    id: 'mediterranean',
    url: 'https://globalfishingwatch.org/map/marine-manager/mediterranean-public',
  },
  { id: 'micronesia', url: 'https://globalfishingwatch.org/map/marine-manager/micronesia-public' },
  { id: 'niue', url: 'https://globalfishingwatch.org/map/marine-manager/niue-public' },
  { id: 'palau', url: 'https://globalfishingwatch.org/map/marine-manager/palau-public' },
  { id: 'panama', url: 'https://globalfishingwatch.org/map/marine-manager/panama-public' },
  {
    id: 'revillagigedo',
    url: 'https://globalfishingwatch.org/map/marine-manager/revillagigedo-public',
  },
  { id: 'tristan', url: 'https://globalfishingwatch.org/map/marine-manager/tristan-public' },
]

const ANALYSTS_URLS: MapUrl[] = [
  // Analysts
  {
    id: 'cian-test',
    url: 'https://globalfishingwatch.org/map/fishing-activity/default-public?start=2021-01-01T00%3A00%3A00.000Z&end=2026-01-01T00%3A00%3A00.000Z&longitude=-28.265650652618778&latitude=41.29676459608503&zoom=5.948135926916953&dvIn[0][id]=fishing-effort-ais__1773329732125&dvIn[0][category]=~0&dvIn[0][dvId]=apparent-fishing-effort-ais-v-4&dvIn[0][cfg][clr]=%2300EEFF&dvIn[0][cfg][colorRamp]=sky&dvIn[0][cfg][filters][distance_from_port_km]=3&dvIn[0][cfg][filters][flag][0]=PRT&dvIn[1][id]=user-polygons-1770735578194&dvIn[1][cfg][clr]=~1&dvIn[1][cfg][filters][name][0]=~2&dvIn[1][cfg][colorRamp]=~1&dvIn[1][cfg][thickness]=3&dvIn[1][dvId]=~3&dvIn[1][dsC][0][dsId]=public-mpa-16-1770735577762&dvIn[1][dsC][0][ept]=~4&dvIn[2][id]=vessel-384d458ab-bbd8-689d-c0fc-df0b7acb3792&dvIn[2][dvId]=fishing-map-vessel-track-v-3&dvIn[2][cfg][info]=public-global-vessel-identity%3Av3.0&dvIn[2][cfg][track]=~7&dvIn[2][cfg][events][0]=~8&dvIn[2][cfg][events][1]=~9&dvIn[2][cfg][events][2]=~10&dvIn[2][cfg][events][3]=~11&dvIn[2][cfg][events][4]=~12&dvIn[2][cfg][rVIs][0]=b7929e6f6-6908-a9b9-ecba-d1aa07c7c56f&dvIn[2][cfg][rVIs][1]=~13&dvIn[2][cfg][clr]=%2333B679&dvIn[2][cfg][vis]=false&dvIn[2][dT]=false&dvIn[3][id]=vessel-4cb2fc563-3ea5-e936-251b-8da32398dfb3&dvIn[3][dvId]=fishing-map-vessel-track-v-3&dvIn[3][cfg][info]=public-global-vessel-identity%3Av3.0&dvIn[3][cfg][track]=~7&dvIn[3][cfg][events][0]=~8&dvIn[3][cfg][events][1]=~9&dvIn[3][cfg][events][2]=~10&dvIn[3][cfg][events][3]=~11&dvIn[3][cfg][events][4]=~12&dvIn[3][cfg][clr]=%23F95E5E&dvIn[3][cfg][vis]=false&dvIn[3][dT]=false&dvIn[4][id]=ais&dvIn[4][cfg][filters][distance_from_port_km]=3&dvIn[4][cfg][filters][flag][0]=ESP&dvIn[4][cfg][clr]=~14&dvIn[4][cfg][colorRamp]=~14&dvIn[4][cfg][vis]=true&dvIn[5][id]=context-layer-eez&dvIn[5][cfg][vis]=true&dvIn[5][cfg][thickness]=3&dvIn[6][id]=user-polygons-1770658553929-1770658553929&dvIn[6][cfg][clr]=~15&dvIn[6][cfg][colorRamp]=~15&dvIn[6][cfg][thickness]=3&dvIn[6][cfg][filterOperators][name]=exclude&dvIn[6][cfg][filters][name][0]=~2&dvIn[6][dvId]=~3&dvIn[6][dsC][0][dsId]=public-azores-rampa-1745486569505&dvIn[6][dsC][0][ept]=~4&dvIn[7][id]=vms&dvIn[7][dT]=true&dvIn[8][id]=presence&dvIn[8][dT]=true&dvIn[9][id]=vessel-b7929e6f6-6908-a9b9-ecba-d1aa07c7c56f&dvIn[9][dvId]=fishing-map-vessel-track-v-3&dvIn[9][cfg][clr]=%23F09300&dvIn[9][cfg][info]=public-global-vessel-identity%3Av3.0&dvIn[9][cfg][track]=~7&dvIn[9][cfg][events][0]=~8&dvIn[9][cfg][events][1]=~9&dvIn[9][cfg][events][2]=~10&dvIn[9][cfg][events][3]=~11&dvIn[9][cfg][events][4]=~12&dvIn[9][cfg][rVIs][0]=384d458ab-bbd8-689d-c0fc-df0b7acb3792&dvIn[9][cfg][rVIs][1]=~13&dvIn[9][cfg][vis]=false&dvIn[9][dT]=false&bDV&lTD=&fTD=&tk[0]=activity&tk[1]=%23FF66CF&tk[2]=PMA%2016&tk[3]=default-context-layer&tk[4]=context-tiles&tk[5]=fishing-map-vessel-track-v-3&tk[6]=public-global-vessel-identity%3Av3.0&tk[7]=public-global-all-tracks%3Av3.0&tk[8]=public-global-fishing-events%3Av3.0&tk[9]=public-global-port-visits-events%3Av3.1&tk[10]=public-global-encounters-events%3Av3.0&tk[11]=public-global-loitering-events%3Av3.0&tk[12]=public-global-gaps-events%3Av3.0&tk[13]=b706ce031-1359-3d1f-9304-2434bdccfc90&tk[14]=%23FFD466&tk[15]=%23FCFF66&tV=heatmap&vDi=public-global-vessel-identity%3Av3.0&vIs=registryInfo&vE[0]=fishing&vE[1]=encounter&vE[2]=port_visit&vE[3]=gap&aVM=heatmap-high-res&sbO=true&mA[0][lon]=-31.28954220207258&mA[0][lat]=40.56916487240526&mA[0][clr]=%23FF66F7&mA[0][label]=MPA%2016&mA[0][id]=1770735531421&mAV=true&vAm=type&vS=~0&vA=eez&vR=encounters&includeRelatedIdentities=true',
  },
  {
    id: 'rmi_mpa_1_aug_2025_1_feb_2026',
    url: 'https://globalfishingwatch.org/map/fishing-activity/rmi_mpa_1_aug_2025_1_feb_2026-user-public?latitude=13.467976540683445&longitude=169.2941148351874&zoom=7.2508521384170725&userTab=workspaces',
  },
  {
    id: 'solomon_islands_mpa_update_2_0',
    url: 'https://globalfishingwatch.org/map/fishing-activity/solomon_islands_mpa_update_2_0-user-public?latitude=19&longitude=26&zoom=1.49&userTab=workspaces',
  },
  {
    id: 'png_dogleg_ais_viirs',
    url: 'https://globalfishingwatch.org/map/fishing-activity/png_dogleg_ais_viirs-user-public?latitude=-9.805331578049007&longitude=141.37659829144164&zoom=7.728819430777402&userTab=workspaces&start=2026-01-01T00%3A00%3A00.000Z&end=2026-03-12T00%3A00%3A00.000Z',
  },
  {
    id: 'gulf_of_papau_jan_to_march',
    url: 'https://globalfishingwatch.org/map/fishing-activity/gulf_of_papau_jan_to_march-user-public?latitude=-8.507672851642393&longitude=144.3552672575087&zoom=7.764940944162476&userTab=workspaces&start=2026-01-01T00%3A00%3A00.000Z&end=2026-03-14T00%3A00%3A00.000Z',
  },
  {
    id: 'peru_vms_cmar',
    url: 'https://globalfishingwatch.org/map/fishing-activity/peru_vms_cmar-user-public?latitude=-0.14843442546503327&longitude=-85.11644404159081&zoom=5.379697035033315&userTab=workspaces&lTD=&fTD=&trackCorrectionId=',
  },
  {
    id: 'ecuador_patrol_planning_analysis',
    url: 'https://globalfishingwatch.org/map/marine-manager/ecuador_patrol_planning_analysis-user-public?longitude=-90.0402437008626&latitude=0.6656099143115483&zoom=7.061772481439386&start=2025-04-01T00%3A00%3A00.000Z&end=2025-07-01T00%3A00%3A00.000Z&dvIn[0][id]=loitering__1760621666203&dvIn[0][category]=~0&dvIn[0][dvId]=loitering-cluster-events-v-3&dvIn[0][cfg][clr]=%23CEA9F9&dvIn[0][cfg][filters][type][0]=CARRIER&dvIn[1][id]=encounter-events&dvIn[1][cfg][vis]=true&dvIn[2][id]=user-polygons-1760621648684-1760621648684&dvIn[2][cfg][clr]=%231AFF6B&dvIn[2][cfg][colorRamp]=spring-green&dvIn[2][cfg][thickness]=3&dvIn[2][dvId]=~1&dvIn[2][dsC][0][dsId]=public-galapagos-buffer-1759759003671&dvIn[2][dsC][0][ept]=~2&dvIn[3][id]=user-polygons-1760621635797-1760621635797&dvIn[3][cfg][clr]=%23F95E5E&dvIn[3][cfg][thickness]=3&dvIn[3][dvId]=~1&dvIn[3][dsC][0][dsId]=public-hermandad-buffer-1759759153948&dvIn[3][dsC][0][ept]=~2&dvIn[4][id]=seamounts__1749249423982&dvIn[4][cfg][vis]=false&tV=~0&sbO=true&tk[0]=events&tk[1]=default-context-layer&tk[2]=context-tiles',
  },
  {
    id: 'solicitacao_mpa_feb_2026_diagnostico_arrasto',
    url: 'https://globalfishingwatch.org/map/fishing-activity/solicitacao_mpa_feb_2026_diagnostico_arrasto-public?latitude=0&longitude=26&zoom=1.6519486107234462&userTab=workspaces',
  },
  {
    id: 'albardao_national_park',
    url: 'https://globalfishingwatch.org/map/fishing-activity/albardao_national_park-public/report/public-albardao-national-park-1773170492492/3?dvIn[0][id]=presence&dvIn[0][cfg][vis]=true&dvIn[1][id]=viirs&dvIn[1][cfg][vis]=true&dvIn[2][id]=sar&dvIn[2][cfg][vis]=true&dvIn[3][id]=sentinel2&dvIn[3][cfg][vis]=true&bDV&longitude=-52.4076635&latitude=-33.4985364&zoom=8.03527039&rC=activity&rVP=0&tV=heatmap&reportDetectionsSubCategory=viirs&reportActivitySubCategory=fishing',
  },
  {
    id: 'fernando_de_noronha_and_seamounts_north_chain',
    url: 'https://globalfishingwatch.org/map/fishing-activity/fernando_de_noronha_and_seamounts_north_chain-public',
  },
  {
    id: 'peru_20_nm',
    url: 'https://globalfishingwatch.org/map/fishing-activity/peru_20_nm-public/report/public-eez-areas/8432?latitude=-11.94070594&longitude=-77.46763389&zoom=5.01889314&userTab=workspaces&start=2025-01-01T00%3A00%3A00.000Z&end=2026-01-01T00%3A00%3A00.000Z&dvIn[0][id]=ais&dvIn[0][cfg][vis]=true&dvIn[0][cfg][filters][distance_from_port_km]=3&dvIn[0][cfg][filters][flag][0]=CHN&dvIn[0][cfg][filters][geartype][0]=squid_jigger&dvIn[0][cfg][filters][geartype][1]=fishing&dvIn[0][cfg][filters][geartype][2]=pole_and_line&dvIn[1][id]=vessel-group-1750248697935&dvIn[1][dT]=true&bDV&tV=heatmap&rBU=nauticalmiles&rBV=20&rBO=difference',
  },
  {
    id: 'srfc_2025_annual_report',
    url: 'https://globalfishingwatch.org/map/fishing-activity/srfc_2025_annual_report-user-public?tV=heatmap',
  },
  {
    id: 'mdg_exploration',
    url: 'https://globalfishingwatch.org/map/fishing-activity/mdg_exploration-user-public',
  },
]

const PUBLIC_URLS: MapUrl[] = [{ id: 'default', url: 'https://globalfishingwatch.org/map' }]

export const MAP_URLS = [...PUBLIC_URLS, ...MARINE_MANAGER_URLS, ...ANALYSTS_URLS]
