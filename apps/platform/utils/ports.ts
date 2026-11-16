import { useEffect, useSyncExternalStore } from 'react'
import memoizeOne from 'memoize-one'

import type { PortSource } from '@globalfishingwatch/api-types'

import i18n, { t } from 'features/i18n/i18n'
import { formatInfoField } from 'utils/info'

type Port = { id: string; label: string }
type PortData = { id: string; name: string; flag: string; sources: string[] }

let ports: PortData[] | null = null
let portsPromise: Promise<void> | null = null
const listeners = new Set<() => void>()

export const loadPorts = (): Promise<void> => {
  if (ports) return Promise.resolve()
  if (!portsPromise) {
    portsPromise = import('data/ports').then((mod) => {
      ports = mod.default
      listeners.forEach((l) => l())
    })
  }
  return portsPromise
}

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

export const usePorts = (enabled = true): boolean => {
  const ready = useSyncExternalStore(
    subscribe,
    () => ports !== null,
    () => false
  )
  useEffect(() => {
    if (enabled) {
      loadPorts()
    }
  }, [enabled])
  return ready
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

const buildPorts = memoizeOne((lng: string, source?: PortSource): Port[] =>
  ports!.flatMap((port) => (!source || port.sources.includes(source) ? parsePort(port, lng) : []))
)

// source: only the ports where that source saw encounters or loitering
export const getPorts = (source?: PortSource, lng = i18n.language): Port[] =>
  ports ? buildPorts(lng, source) : []
