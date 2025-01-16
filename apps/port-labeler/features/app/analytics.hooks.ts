import { useSelector } from 'react-redux'

import {
  trackEvent as trackEventBase,
  useAnalytics as useAnalyticsBase,
} from '@globalfishingwatch/react-hooks'

import { GOOGLE_MEASUREMENT_ID, GOOGLE_TAG_MANAGER_ID } from 'data/config'
import { isUserLogged, selectUserData } from 'features/user/user.slice'

const GOOGLE_ANALYTICS_DEBUG_MODE =
  (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_DEBUG_MODE || 'false').toLowerCase() === 'true'

export enum TrackCategory {
  I18n = 'internationalization',
  User = 'user',
}

export const trackEvent = trackEventBase<TrackCategory>

export const useAnalytics = () => {
  const user = useSelector(selectUserData)
  const logged = useSelector(isUserLogged)

  useAnalyticsBase({
    debugMode: GOOGLE_ANALYTICS_DEBUG_MODE,
    googleMeasurementId: GOOGLE_MEASUREMENT_ID,
    googleTagManagerId: GOOGLE_TAG_MANAGER_ID,
    logged,
    user,
  })
}
