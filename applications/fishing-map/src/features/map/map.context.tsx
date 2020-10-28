import React, { createContext, useRef, useContext, useState, useEffect, useMemo } from 'react'

const MapStateContext = createContext<any>('')

const MapboxRefProvider: React.FC = ({ children }) => {
  const mapboxRef = useRef()
  const [mapboxRefReady, seMapboxRefReady] = useState(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (mapboxRef.current !== undefined && !mapboxRefReady) {
      seMapboxRefReady(true)
    }
  })
  const context = useMemo(
    () => ({
      mapboxRef,
      mapboxRefReady,
    }),
    [mapboxRefReady]
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

function useMapboxRefReady() {
  const context = useContext(MapStateContext)
  if (context === undefined) {
    throw new Error('useMapboxRef must be used within a MapboxRefProvider')
  }
  return context.mapboxRefReady
}

export { MapboxRefProvider, useMapboxRef, useMapboxRefReady }
