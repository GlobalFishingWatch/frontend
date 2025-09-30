import memoizeOne from 'memoize-one'

import ports from 'data/ports'
import i18n, { t } from 'features/i18n/i18n'
import { formatInfoField } from 'utils/info'

type Port = { id: string; label: string }
type PortData = { id: string; name: string; flag: string }

const parsePort = (port: PortData, lng = i18n.language): Port => {
  const flag = t(`flags:${port.flag}`, { lng, defaultValue: port.flag }) as string
  return {
    id: port.id,
    label: `${formatInfoField(port.name, 'port')} (${flag})`,
  }
}

export const getPortById = (id: string, lng = i18n.language): Port | undefined => {
  const port = ports.find((f) => f.id === id)
  if (!port || !lng) return undefined
  return parsePort(port, lng)
}

export const getPortsByIds = (ids: string[], lng = i18n.language): Port[] => {
  return ids.flatMap((id) => {
    const port = ports.find((f) => f.id === id)
    if (!port || !lng) return []
    return parsePort(port, lng)
  })
}

export const getPorts = memoizeOne((lng = i18n.language): Port[] => {
  return ports.map((port) => parsePort(port, lng))
})
