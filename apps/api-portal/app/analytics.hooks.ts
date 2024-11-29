import {
  trackEvent as trackEventBase,
  useAnalytics as useAnalyticsBase,
} from '@globalfishingwatch/react-hooks'
import type { UserData } from '@globalfishingwatch/api-types'
import {
  GOOGLE_TAG_MANAGER_ID,
  GOOGLE_MEASUREMENT_ID,
  GOOGLE_ANALYTICS_DEBUG_MODE,
} from 'components/data/config'

export enum TrackCategory {
  User = 'user',
}

export const trackEvent = trackEventBase<TrackCategory>

export const useAnalytics = (
  user: UserData | null | undefined,
  logged: boolean,
  isLoading: boolean
) => {
  useAnalyticsBase({
    debugMode: GOOGLE_ANALYTICS_DEBUG_MODE,
    googleMeasurementId: GOOGLE_MEASUREMENT_ID,
    googleTagManagerId: GOOGLE_TAG_MANAGER_ID,
    isLoading,
    logged,
    user,
  })
}
