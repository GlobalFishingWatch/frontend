import React, { createContext, useRef, useContext, useState, useEffect, useMemo } from 'react'
import type { Map } from '@globalfishingwatch/mapbox-gl'

type MapStateContextPayload = {
  mapboxRef?: any
  mapboxInstance?: Map
}

const MapStateContext = createContext<MapStateContextPayload>({})

const MapboxRefProvider: React.FC = ({ children }) => {
  const mapboxRef = useRef()
  const [mapboxRefReady, seMapboxRefReady] = useState(false)
  const [mapboxInstance, seMapboxInstance] = useState<Map>()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (mapboxRef.current !== undefined && !mapboxRefReady) {
      seMapboxRefReady(true)
      seMapboxInstance((mapboxRef.current as any).getMap())
    }
  })
  const context = useMemo(
    () => ({
      mapboxRef,
      mapboxInstance,
    }),
    [mapboxInstance]
  )
  return <MapStateContext.Provider value={context}>{children}</MapStateContext.Provider>
}

function useMapboxRef() {
  const context = useContext(MapStateContext)
  if (context === undefined) {
    throw new Error('useMapboxRef must be used within a MapboxRefProvider')
  }
  return context.mapboxRef
}

function useMapboxInstance() {
  const context = useContext(MapStateContext)
  if (context === undefined) {
    throw new Error('useMapboxInstance must be used within a MapboxRefProvider')
  }
  return context.mapboxInstance
}

export { MapboxRefProvider, useMapboxRef, useMapboxInstance }
