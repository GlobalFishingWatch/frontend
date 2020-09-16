import React, { createContext, useRef, useContext } from 'react'

const MapStateContext = createContext<any>('')

const MapboxRefProvider: React.FC = ({ children }) => {
  const MapboxRef = useRef()
  return <MapStateContext.Provider value={MapboxRef}>{children}</MapStateContext.Provider>
}

function useMapboxRef() {
  const context = useContext(MapStateContext)
  if (context === undefined) {
    throw new Error('useMapboxRef must be used within a MapboxRefProvider')
  }
  return context
}

export { MapboxRefProvider, useMapboxRef }
