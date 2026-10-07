import type { Place } from 'features/_places/places.loaders'
import { formatInfoField } from 'utils/info'

/** "Name (Country)" as the list and the map tooltip show it; port names get port casing. */
export const getPlaceLabel = ({ name, flag, type }: Pick<Place, 'name' | 'flag' | 'type'>) => {
  const label = type === 'port' ? (formatInfoField(name, 'port') as string) : name
  return flag ? `${label} (${formatInfoField(flag, 'flag')})` : label
}
