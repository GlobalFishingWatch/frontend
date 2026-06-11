import { useEffect, useMemo, useState } from 'react'
import type ReactGADefault from 'react-ga4'
import { snakeCase } from 'es-toolkit'

type InitOptions = Extract<Parameters<typeof ReactGADefault.initialize>[0], object[]>[number]

type ReactGAClient = {
  event?: (eventName: string, params?: Record<string, any>) => void
  initialize?: (trackingId: string | InitOptions[], options?: any) => void
  set?: (...args: any[]) => void
  default?: ReactGAClient
}

function resolveReactGAClient(mod: unknown): ReactGAClient {
  const reactGA = ((mod as { default?: ReactGAClient })?.default ?? mod) as ReactGAClient
  if (typeof reactGA.event === 'function') {
    return reactGA
  }
  if (reactGA.default && typeof reactGA.default.event === 'function') {
    return reactGA.default
  }
  return reactGA
}

// react-ga4 is loaded on demand so it stays out of the initial bundle.
// Calls made before the module resolves are ordered by the shared promise,
// and react-ga4 itself queues events fired before initialize().
let reactGAClientPromise: Promise<ReactGAClient> | undefined

function getReactGAClient() {
  if (!reactGAClientPromise) {
    reactGAClientPromise = import('react-ga4').then(resolveReactGAClient)
  }
  return reactGAClientPromise
}

export enum TrackCategory {
  User = 'user',
}

export type TrackEventParams<T> = {
  category: T | TrackCategory
  action: string
  label?: string
  value?: any
  other?: Record<string, any>
}

export const trackEvent = <T>({
  category,
  action,
  label,
  value,
  other = {},
}: TrackEventParams<T>) => {
  getReactGAClient().then((reactGA) => {
    if (typeof reactGA.event !== 'function') {
      return
    }
    /**
     * IMPORTANT
     *
     * To send the category and action in snake_case to GA4
     * it is necessary to use this:
     * ```
     * ReactGA.event(name, params)
     * ```
     * method signature so they won't be converted to title case.
     *
     * https://github.com/codler/react-ga4/issues/15
     */
    reactGA.event(snakeCase(action), {
      ...(category && { category: snakeCase((category as string) ?? '') }),
      ...(label && { label }),
      ...(value && { value }),
      ...other,
    })
  })
}

export type useAnalyticsParams = {
  debugMode?: boolean
  googleMeasurementId?: string
  googleTagManagerId?: string
  gtagUrl?: string
}

export const useAnalyticsInit = ({
  debugMode = false,
  googleMeasurementId,
  googleTagManagerId,
  gtagUrl = 'https://www.googletagmanager.com/gtm.js',
}: useAnalyticsParams) => {
  const [initialized, setInitialized] = useState(false)
  const { config, initGtagOptions }: { config: InitOptions[]; initGtagOptions: any } =
    useMemo(() => {
      const config: InitOptions[] = []
      const initGtagOptions: any = {
        // Debug Mode enables the usage of Debug View in Google Analytics > Admin
        ...(debugMode ? { debug_mode: 1 } : {}),
      }
      if (googleTagManagerId) {
        config.push({ trackingId: googleTagManagerId })
        initGtagOptions.gtagUrl = gtagUrl
      }
      if (googleMeasurementId) {
        config.push({ trackingId: googleMeasurementId })
      }
      return { config, initGtagOptions }
    }, [debugMode, googleMeasurementId, googleTagManagerId, gtagUrl])

  useEffect(() => {
    if (config.length === 0) {
      return
    }
    let cancelled = false
    getReactGAClient().then((reactGA) => {
      if (cancelled) {
        return
      }
      if (typeof reactGA.initialize === 'function') {
        reactGA.initialize(config, initGtagOptions)
        setInitialized(true)
      }
      // Tip: Uncomment this to prevent sending hits to GA
      // reactGA.set({ sendHitTask: null })
    })
    return () => {
      cancelled = true
    }
  }, [config, initGtagOptions])

  return useMemo(() => {
    return {
      initialized,
      setConfig: (...args: any[]) => {
        getReactGAClient().then((reactGA) => {
          if (typeof reactGA.set === 'function') {
            reactGA.set(...args)
          }
        })
      },
    }
  }, [initialized])
}
