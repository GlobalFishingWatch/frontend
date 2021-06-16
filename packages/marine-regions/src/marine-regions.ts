import eez from './data/eez'
import rfmo from './data/rfmo'
import mpa from './data/mpa'

export type MarineRegionLocaleKey = string
export enum MarineRegionType {
  eez = 'eez',
  rfmo = 'rfmo',
  mpa = 'mpa',
}
export enum MarineRegionsLocale {
  en = 'en',
  es = 'es',
  fr = 'fr',
  id = 'id',
}

export interface MarineRegion<T = string> {
  id: string | number
  label: T
}

type GetMarineRegionLocaleParam = {
  locale: MarineRegionsLocale
}

const getMarineRegion = (
  regionsList: Record<string, MarineRegion<MarineRegionLocaleKey>>,
  { locale = MarineRegionsLocale.en }: GetMarineRegionLocaleParam = {} as GetMarineRegionLocaleParam
): MarineRegion[] => {
  return Object.values(regionsList).map((region) => region)
}

const getEEZ = (): MarineRegion[] => getMarineRegion(eez)

const getMPA = (): MarineRegion[] => getMarineRegion(mpa)

const getRFMO = (): MarineRegion[] => getMarineRegion(rfmo)

export { getEEZ, getMPA, getRFMO }
