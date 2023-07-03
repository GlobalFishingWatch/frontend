import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import ReactGA from 'react-ga4'
import { InitOptions } from 'react-ga4/types/ga4'
import { snakeCase } from 'lodash'
import { selectUserData } from 'features/user/user.slice'
import { GOOGLE_TAG_MANAGER_ID, GOOGLE_MEASUREMENT_ID } from 'data/config'
import { selectLocationCategory } from 'routes/routes.selectors'

export const GOOGLE_ANALYTICS_TEST_MODE =
  (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TEST_MODE || 'false').toLowerCase() === 'true'

export enum TrackCategory {
  ActivityData = 'activity_data',
  Analysis = 'analysis',
  DataDownloads = 'data_downloads',
  EnvironmentalData = 'environmental_data',
  HelpHints = 'help_hints',
  I18n = 'internationalization',
  ReferenceLayer = 'reference_layer',
  SearchVessel = 'search_vessel',
  Timebar = 'timebar',
  Tracks = 'tracks',
  User = 'user',
  VesselGroups = 'vessel_groups',
  WorkspaceManagement = 'workspace_management',
}

export type TrackEventParams = {
  category: TrackCategory
  action: string
  label?: string
  value?: any
}
export const trackEvent = ({ category, action, label, value }: TrackEventParams) => {
  /**
   * https://github.com/codler/react-ga4/issues/15
   * To send the category and action in snake_case to GA4
   * without be converted to title case is necessary to use:
   * ReactGA.event(name, params)
   */
  ReactGA.event(snakeCase(action), {
    category: snakeCase(category),
    label: label,
    value,
  })
}

export const useAnalytics = () => {
  const user = useSelector(selectUserData)
  const locationCategory = useSelector(selectLocationCategory)

  useEffect(() => {
    const config: InitOptions[] = []
    const initGtagOptions: any = {
      ...(GOOGLE_ANALYTICS_TEST_MODE ? { testMode: true } : {}),
    }
    if (GOOGLE_TAG_MANAGER_ID) {
      config.push({ trackingId: GOOGLE_TAG_MANAGER_ID })
      initGtagOptions.gtagUrl = 'https://www.googletagmanager.com/gtm.js'
    }
    if (GOOGLE_MEASUREMENT_ID) {
      config.push({ trackingId: GOOGLE_MEASUREMENT_ID })
    }

    if (config.length > 0) {
      ReactGA.initialize(config, initGtagOptions)
      // Tip: To send hits to GA you'll have to set
      // GOOGLE_ANALYTICS_TEST_MODE=false in your .env.local
      if (GOOGLE_ANALYTICS_TEST_MODE) {
        ReactGA.set({ sendHitTask: null })
      }
    }
  }, [])

  useEffect(() => {
    if (GOOGLE_MEASUREMENT_ID || GOOGLE_TAG_MANAGER_ID) {
      ReactGA.send({ hitType: 'pageview', page: window.location.pathname + window.location.search })
    }
  }, [locationCategory])

  useEffect(() => {
    if (user && (GOOGLE_MEASUREMENT_ID || GOOGLE_TAG_MANAGER_ID)) {
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
    }
  }, [user])
}
