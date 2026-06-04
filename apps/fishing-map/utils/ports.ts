import memoizeOne from 'memoize-one'

import i18n, { t } from 'features/i18n/i18n'
import { formatInfoField } from 'utils/info'

type Port = { id: string; label: string }
type PortData = { id: string; name: string; flag: string }

let ports: PortData[] | null = null
let portsPromise: Promise<void> | null = null

export const loadPorts = (): Promise<void> => {
  if (ports) return Promise.resolve()
  if (!portsPromise) {
    portsPromise = import('data/ports').then((mod) => {
      ports = mod.default
    })
  }
  return portsPromise
}

const parsePort = (port: PortData, lng = i18n.language): Port => {
  const flag = t((t) => t[port.flag], { ns: 'flags', lng, defaultValue: port.flag }) as string
  return {
    id: port.id,
    label: `${formatInfoField(port.name, 'port')} (${flag})`,
  }
}

export const getPortsByIds = (ids: string[], lng = i18n.language): Port[] => {
  if (!ports) return []
  return ids.flatMap((id) => {
    const port = ports!.find((f) => f.id === id)
    if (!port || !lng) return []
    return parsePort(port, lng)
  })
}

const buildPorts = memoizeOne((lng: string): Port[] => ports!.map((port) => parsePort(port, lng)))

export const getPorts = (lng = i18n.language): Port[] => (ports ? buildPorts(lng) : [])
