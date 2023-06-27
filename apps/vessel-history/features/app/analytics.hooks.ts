import { useEffect, useState } from 'react'
import ReactGA from 'react-ga4'
import {
  GOOGLE_TAG_MANAGER_ID,
  GOOGLE_MEASUREMENT_ID,
  IS_PRODUCTION,
  WORKSPACE_ENV,
} from 'data/config'
import { useUser } from 'features/user/user.hooks'

export const GOOGLE_ANALYTICS_INIT_OPTIONS =
  WORKSPACE_ENV === 'production' ? {} : { testMode: true }

export enum TrackCategory {
  GeneralVVFeatures = 'General VV features',
  HighlightEvents = 'Highlight Events',
  OfflineAccess = 'Offline Access',
  SearchVesselVV = 'Search Vessel VV',
  User = 'User',
  VesselDetailActivityByTypeTab = 'Vessel Detail ACTIVITY BY TYPE Tab',
  VesselDetailActivityOrMapTab = 'Vessel Detail ACTIVITY or MAP Tab',
  VesselDetailActivityTab = 'Vessel Detail ACTIVITY Tab',
  VesselDetailInfoTab = 'Vessel Detail INFO Tab',
  VesselDetailMapTab = 'Vessel Detail MAP Tab',
  VesselDetailRiskSummaryTab = 'Vessel Detail RISK SUMMARY Tab',
  VesselDetail = 'Vessel Detail',
}

export type TrackEventParams = {
  category: TrackCategory
  action: string
  label?: string
  value?: any
}

export const trackEvent = ({ category, action, label, value }: TrackEventParams) => {
  ReactGA.event({ category, action, label, value })
}

export const useAnalytics = () => {
  useEffect(() => {
    if (GOOGLE_MEASUREMENT_ID) {
      ReactGA.initialize(GOOGLE_MEASUREMENT_ID, {
        ...GOOGLE_ANALYTICS_INIT_OPTIONS,
      })
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
  }, [])
  const { user, logged } = useUser()
  const [trackLogin, setTrackLogin] = useState(true)
  const [trackGTMLogin, setTrackGTMLogin] = useState(true)

  // Set to track login only when the user has logged out
  useEffect(() => {
    !logged && setTrackLogin(true)
    !logged && setTrackGTMLogin(true)
  }, [logged])

  useEffect(() => {
    if (user && GOOGLE_MEASUREMENT_ID && trackLogin) {
      ReactGA.set({
        dimension3: `${JSON.stringify(user.groups)}` ?? '',
        dimension4: user.organizationType ?? '',
        dimension5: user.organization ?? '',
        dimension6: user.country ?? '',
        dimension7: user.language ?? '',
      })
      ReactGA.set({
        userProperties: {
          userGroup: user.groups,
          userOrgType: user.organizationType,
          userOrganization: user.organization,
          userCountry: user.country,
          userLanguage: user.language,
        },
      })
      trackEvent({
        category: TrackCategory.User,
        action: 'Login',
      })
      setTrackLogin(false)
    }
  }, [user, trackLogin])

  useEffect(() => {
    if (user && GOOGLE_TAG_MANAGER_ID && trackGTMLogin && window && window['dataLayer']) {
      const dataLayer = window['dataLayer'] || []
      dataLayer.push({
        event: 'userData',
        user_country: user.country ?? '',
        user_group: user.groups ?? '',
        user_org_type: user.organizationType ?? '',
        user_organization: user.organization ?? '',
        user_language: user.language ?? '',
      })
      setTrackGTMLogin(false)
    }
  }, [user, trackGTMLogin])
}
