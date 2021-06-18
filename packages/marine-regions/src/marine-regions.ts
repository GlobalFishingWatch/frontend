import eez from './data/eez'
import rfmo from './data/rfmo'
import mpa from './data/mpa'
import marineRegionsLocales from './data/locales'
import sourceLocales from './data/locales/source.json'

export type MarineRegionLocaleKey = keyof typeof sourceLocales
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

export type GetMarineRegionLocaleParam = {
  locale: MarineRegionsLocale
}

const localizeName = (name: MarineRegionLocaleKey, locale = MarineRegionsLocale.en) => {
  if (!marineRegionsLocales[locale]) {
    return name
  }
  return (marineRegionsLocales[locale][name] as MarineRegionLocaleKey) || name
}

const getLocalizedMarineRegions = (
  regionsList: Record<string, MarineRegion>,
  { locale = MarineRegionsLocale.en }: GetMarineRegionLocaleParam = {} as GetMarineRegionLocaleParam
): MarineRegion[] => {
  return Object.values(regionsList).map((region) => ({
    ...region,
    label: localizeName(region.label as MarineRegionLocaleKey, locale),
  }))
}

const getEEZ = (locale?: GetMarineRegionLocaleParam): MarineRegion[] =>
  getLocalizedMarineRegions(eez, locale)

const getMPA = (): MarineRegion[] => Object.values(mpa)

const getRFMO = (locale?: GetMarineRegionLocaleParam): MarineRegion[] =>
  getLocalizedMarineRegions(rfmo, locale)

export { getEEZ, getMPA, getRFMO }
