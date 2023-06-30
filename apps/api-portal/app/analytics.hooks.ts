import { useEffect, useMemo, useState } from 'react'
import { snakeCase } from 'lodash'
import ReactGA from 'react-ga4'
import { InitOptions } from 'react-ga4/types/ga4'
import { UserData } from '@globalfishingwatch/api-types'
import {
  GOOGLE_TAG_MANAGER_ID,
  GOOGLE_MEASUREMENT_ID,
  GOOGLE_ANALYTICS_DEBUG_MODE,
} from 'components/data/config'

export enum TrackCategory {
  User = 'user',
}

export type TrackEventParams = {
  category: TrackCategory
  action: string
  label?: string
  value?: any
}

export const trackEvent = ({ category, action, label, value }: TrackEventParams) => {
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
    category: snakeCase(category),
    label: label,
    value,
  })
}

export const useAnalytics = (
  user: UserData | null | undefined,
  logged: boolean,
  isLoading: boolean
) => {
  const [trackLogin, setTrackLogin] = useState(true)

  const { config, initGtagOptions }: { config: InitOptions[]; initGtagOptions: any } =
    useMemo(() => {
      const config: InitOptions[] = []
      const initGtagOptions: any = {
        // Debug Mode enables the usage of Debug View in Google Analytics > Admin
        ...(GOOGLE_ANALYTICS_DEBUG_MODE ? { debug_mode: 1 } : {}),
      }
      if (GOOGLE_TAG_MANAGER_ID) {
        config.push({ trackingId: GOOGLE_TAG_MANAGER_ID })
        initGtagOptions.gtagUrl = 'https://www.googletagmanager.com/gtm.js'
      }
      if (GOOGLE_MEASUREMENT_ID) {
        config.push({ trackingId: GOOGLE_MEASUREMENT_ID })
      }
      return { config, initGtagOptions }
    }, [])

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
  }, [config.length])

  // Set to track login only when the user has logged out
  useEffect(() => {
    !logged && setTrackLogin(true)
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
