import type { UserData } from '@globalfishingwatch/api-types'
import {
  trackEvent as trackEventBase,
  useAnalytics as useAnalyticsBase,
} from '@globalfishingwatch/react-hooks'

import {
  GOOGLE_ANALYTICS_DEBUG_MODE,
  GOOGLE_MEASUREMENT_ID,
  GOOGLE_TAG_MANAGER_ID,
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
