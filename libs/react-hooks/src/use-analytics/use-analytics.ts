import { useEffect, useMemo, useState } from 'react'
import ReactGA from 'react-ga4'
import type { InitOptions } from 'react-ga4/types/ga4'
import snakeCase from 'lodash/snakeCase'

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
  ReactGA.event(snakeCase(action), {
    category: snakeCase((category as string) ?? ''),
    ...(label && { label }),
    ...(value && { value }),
    ...other,
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
    if (config.length > 0) {
      ReactGA.initialize(config, initGtagOptions)
      setInitialized(true)
      // Tip: Uncomment this to prevent sending hits to GA
      // ReactGA.set({ sendHitTask: null })
    }
  }, [config, initGtagOptions])

  return useMemo(() => ({ initialized, setConfig: ReactGA.set }), [initialized])
}
