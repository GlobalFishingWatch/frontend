import { useCallback } from 'react'
import { atom, useAtom } from 'jotai'

/**
 * In-flight map interaction requests, and the hook to abort them.
 *
 * Split out of map-interactions.hooks.ts so always-loaded callers can cancel pending requests without
 * pulling that module's runtime deps (@globalfishingwatch/deck-layer-composer, and the whole interaction
 * pipeline). MainNav cancels them when the workspace category changes.
 *
 * Keep this module free of deck.gl / deck-layer-composer runtime imports.
 */
export type InteractionPromise = Promise<unknown> & { abort: () => void }

const initialInteractionPromises = {
  activity: undefined,
  events: undefined,
  detectionPositions: undefined,
}

export const interactionPromisesAtom = atom<{
  activity: InteractionPromise | undefined
  events: InteractionPromise | undefined
  detectionPositions: InteractionPromise | undefined
}>(initialInteractionPromises)

export const useCancelInteractionPromises = () => {
  const [interactionPromises, setInteractionPromises] = useAtom(interactionPromisesAtom)

  const cancelPendingInteractionRequests = useCallback(() => {
    const promisesRef = [
      interactionPromises.activity,
      interactionPromises.events,
      interactionPromises.detectionPositions,
    ]
    promisesRef.forEach((p) => {
      if (p) {
        p.abort()
      }
    })
    setInteractionPromises(initialInteractionPromises)
  }, [
    interactionPromises.events,
    interactionPromises.activity,
    interactionPromises.detectionPositions,
    setInteractionPromises,
  ])

  return cancelPendingInteractionRequests
}
