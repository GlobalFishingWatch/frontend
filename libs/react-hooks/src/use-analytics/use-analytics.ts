import { useEffect, useMemo, useState } from 'react'
import ReactGA from 'react-ga4'
import type { InitOptions } from 'react-ga4/types/ga4'
import snakeCase from 'lodash/snakeCase'

import type { UserData } from '@globalfishingwatch/api-types'

export enum TrackCategory {
  User = 'user',
}

export type TrackEventParams<T> = {
  category: T | TrackCategory
  action: string
  label?: string
  value?: any
}

export const trackEvent = <T>({ category, action, label, value }: TrackEventParams<T>) => {
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
    label: label,
    value,
  })
}

export type useAnalyticsParams = {
  debugMode?: boolean
  googleMeasurementId?: string
  googleTagManagerId?: string
  gtagUrl?: string
  isLoading?: boolean
  logged: boolean
  pageview?: string
  user: UserData | null | undefined
}

export const useAnalytics = ({
  debugMode = false,
  googleMeasurementId,
  googleTagManagerId,
  gtagUrl = 'https://www.googletagmanager.com/gtm.js',
  isLoading = false,
  logged,
  pageview = '',
  user,
}: useAnalyticsParams) => {
  const [trackLogin, setTrackLogin] = useState(true)

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
      // Tip: Uncomment this to prevent sending hits to GA
      // ReactGA.set({ sendHitTask: null })
    }
  }, [config, initGtagOptions])

  useEffect(() => {
    if (config.length > 0) {
      ReactGA.send({ hitType: 'pageview', page: window.location.pathname + window.location.search })
    }
  }, [config.length, pageview])

  // Set to track login only when the user has logged out
  useEffect(() => {
    if (!logged) {
      setTrackLogin(true)
    }
  }, [logged])

  useEffect(() => {
    if (config.length === 0 || !trackLogin || isLoading) return

    if (user) {
      ReactGA.set({
        user_country: user.country ?? '',
        user_group: user.groups ?? '',
        user_org_type: user.organizationType ?? '',
        user_organization: user.organization ?? '',
        user_language: user.language ?? '',
      })
      trackEvent({
        category: TrackCategory.User,
        action: 'Login',
      })
      setTrackLogin(false)
    } else {
      ReactGA.set({
        user_country: '',
        user_group: '',
        user_org_type: '',
        user_organization: '',
        user_language: '',
      })
    }
  }, [user, trackLogin, config.length, isLoading])
}
