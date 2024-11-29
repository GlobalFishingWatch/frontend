import type { Region } from 'features/regions/regions.slice'

export const getEEZName = (region: Region | null | undefined): string => {
  return region?.label?.replace('Exclusive Economic Zone', 'EEZ') || 'unknown'
}
