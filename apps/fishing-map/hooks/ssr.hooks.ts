import { useSyncExternalStore } from 'react'

function subscribeToHydrationStore() {
  return () => {}
}

function getClientHydrationSnapshot() {
  return true
}

function getServerHydrationSnapshot() {
  return false
}

export function useIsClientHydrated() {
  return useSyncExternalStore(
    subscribeToHydrationStore,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot
  )
}
