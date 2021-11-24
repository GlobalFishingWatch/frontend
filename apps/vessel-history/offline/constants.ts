export const BASE_URL =
  process.env.NEXT_PUBLIC_URL || (process.env.NODE_ENV === 'production' ? '/vessel-viewer' : '')

export const LANDMASS_OFFLINE_GEOJSON = `${
  process.env.NEXT_PUBLIC_URL ?? ''
}/data/ne_10m_admin_0_countries_gj.geojson`

export const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY

export default { BASE_URL, API_GATEWAY, LANDMASS_OFFLINE_GEOJSON }
