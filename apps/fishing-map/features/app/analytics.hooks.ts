import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import ReactGA from 'react-ga4'
import { snakeCase } from 'lodash'
import { selectUserData } from 'features/user/user.slice'
import { GOOGLE_TAG_MANAGER_ID, GOOGLE_MEASUREMENT_ID, IS_PRODUCTION } from 'data/config'
import { selectLocationCategory } from 'routes/routes.selectors'

const GOOGLE_UNIVERSAL_ANALYTICS_INIT_OPTIONS = IS_PRODUCTION ? {} : { testMode: true }

export enum TrackCategory {
  ActivityData = 'activity_data',
  Analysis = 'analysis',
  DataDownloads = 'data_downloads',
  EnvironmentalData = 'environmental_data',
  HelpHints = 'help_hints',
  I18n = 'internationalization',
  ReferenceLayer = 'reference_layer',
  Timebar = 'timebar',
  Tracks = 'tracks',
  SearchVessel = 'search_vessel',
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
  ReactGA.event(category, {
    action: snakeCase(action),
    label,
    value,
  })
}

export const useAnalytics = () => {
  const userData = useSelector(selectUserData)
  const locationCategory = useSelector(selectLocationCategory)

  useEffect(() => {
    if (GOOGLE_MEASUREMENT_ID) {
      ReactGA.initialize(GOOGLE_MEASUREMENT_ID, GOOGLE_UNIVERSAL_ANALYTICS_INIT_OPTIONS)
      // Uncomment to prevent sending hits in non-production envs
      if (!IS_PRODUCTION) {
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
    if (userData && GOOGLE_MEASUREMENT_ID) {
      ReactGA.set({
        dimension3: `${JSON.stringify(userData.groups)}` ?? '',
        dimension4: userData.organizationType ?? '',
        dimension5: userData.organization ?? '',
        dimension6: userData.country ?? '',
        dimension7: userData.language ?? '',
      })
      ReactGA.set({
        userProperties: {
          userGroup: userData.groups,
          userOrgType: userData.organizationType,
          userOrganization: userData.organization,
          userCountry: userData.country,
          userLanguage: userData.language,
        },
      })
      ReactGA.event({
        category: 'User',
        action: 'Login',
      })
    }
  }, [userData])

  useEffect(() => {
    if (userData && GOOGLE_TAG_MANAGER_ID && typeof window !== 'undefined' && window['dataLayer']) {
      const dataLayer = window['dataLayer'] || []
      dataLayer.push({
        event: 'userData',
        user_country: userData.country ?? '',
        user_group: userData.groups ?? '',
        user_org_type: userData.organizationType ?? '',
        user_organization: userData.organization ?? '',
        user_language: userData.language ?? '',
      })
    }
  }, [userData])
}
