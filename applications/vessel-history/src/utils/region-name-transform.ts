import { Region } from "features/regions/regions.slice"

export const getEEZName = (region: Region | null | undefined, ocean?: string): string => {
  return region?.label?.replace('Exclusive Economic Zone', 'EEZ') || ocean || 'unknown'
}
