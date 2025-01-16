import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { Map } from 'maplibre-gl'

const MapStateContext = createContext<any>('')
interface MapboxRefContextProviderProps {
  children: React.ReactNode
}

const MapboxRefProvider: React.FC<MapboxRefContextProviderProps> = ({ children }) => {
  const mapboxRef = useRef(undefined)
  const [mapboxRefReady, seMapboxRefReady] = useState(false)
  const [mapboxInstance, seMapboxInstance] = useState<Map | undefined>()

  const onReady = useCallback(() => {
    seMapboxRefReady(true)
    seMapboxInstance((mapboxRef.current as any).getMap())
  }, [])

   
  useEffect(() => {
    if (mapboxRef.current !== undefined && !mapboxRefReady) {
      onReady()
    }
  })

  const context = useMemo(
    () => ({
      mapboxRef,
      mapboxRefReady,
      mapboxInstance,
      onReady,
    }),
    [mapboxInstance, mapboxRefReady, onReady]
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

function useMapboxRefCallback() {
  const context = useContext(MapStateContext)
  if (context === undefined) {
    throw new Error('useMapboxRef must be used within a MapboxRefProvider')
  }
  return context.onReady
}

function useMapboxInstance() {
  const context = useContext(MapStateContext)
  if (context === undefined) {
    throw new Error('useMapboxInstance must be used within a MapboxRefProvider')
  }
  return context.mapboxInstance
}

export { MapboxRefProvider, useMapboxRef, useMapboxInstance, useMapboxRefCallback }
