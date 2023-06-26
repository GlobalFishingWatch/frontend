import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { initialize as uaInitialize, set as uaSet, event as uaEvent, pageview } from 'react-ga'
import { selectUserData } from 'features/user/user.slice'
import {
  GOOGLE_TAG_MANAGER_ID,
  GOOGLE_UNIVERSAL_ANALYTICS_INIT_OPTIONS,
  GOOGLE_UNIVERSAL_ANALYTICS_ID,
  IS_PRODUCTION,
} from 'data/config'
import { selectLocationCategory } from 'routes/routes.selectors'

export enum TrackCategory {
  ActivityData = 'Activity data',
  Analysis = 'Analysis',
  DataDownloads = 'Data downloads',
  EnvironmentalData = 'Environmental data',
  HelpHints = 'Help hints',
  I18n = 'Internationalization',
  ReferenceLayer = 'Reference Layer',
  Timebar = 'Timebar',
  Tracks = 'Tracks',
  SearchVessel = 'Search Vessel',
  VesselGroups = 'Vessel groups',
  WorkspaceManagement = 'Workspace Management',
}

export type TrackEventParams = {
  category: TrackCategory
  action: string
  label?: string
  value?: any
}
export const trackEvent = ({ category, action, label, value }: TrackEventParams) => {
  uaEvent({ category, action, label, value })
}

export const useAnalytics = () => {
  const userData = useSelector(selectUserData)
  const locationCategory = useSelector(selectLocationCategory)

  useEffect(() => {
    if (GOOGLE_UNIVERSAL_ANALYTICS_ID) {
      uaInitialize(GOOGLE_UNIVERSAL_ANALYTICS_ID, {
        ...GOOGLE_UNIVERSAL_ANALYTICS_INIT_OPTIONS,
      })
      // Uncomment to prevent sending hits in non-production envs
      if (!IS_PRODUCTION) {
        uaSet({ sendHitTask: null })
      }
    }
  }, [])

  useEffect(() => {
    if (GOOGLE_UNIVERSAL_ANALYTICS_ID || GOOGLE_TAG_MANAGER_ID) {
      pageview(window.location.pathname + window.location.search)
    }
  }, [locationCategory])

  useEffect(() => {
    if (userData && GOOGLE_UNIVERSAL_ANALYTICS_ID) {
      uaSet({
        dimension3: `${JSON.stringify(userData.groups)}` ?? '',
        dimension4: userData.organizationType ?? '',
        dimension5: userData.organization ?? '',
        dimension6: userData.country ?? '',
        dimension7: userData.language ?? '',
      })
      uaSet({
        userProperties: {
          userGroup: userData.groups,
          userOrgType: userData.organizationType,
          userOrganization: userData.organization,
          userCountry: userData.country,
          userLanguage: userData.language,
        },
      })
      uaEvent({
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
