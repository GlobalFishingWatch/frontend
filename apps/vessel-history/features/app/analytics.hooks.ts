import {
  trackEvent as trackEventBase,
  useAnalytics as useAnalyticsBase,
} from '@globalfishingwatch/react-hooks'

import {
  GOOGLE_ANALYTICS_DEBUG_MODE,
  GOOGLE_MEASUREMENT_ID,
  GOOGLE_TAG_MANAGER_ID,
} from 'data/config'
import { useUser } from 'features/user/user.hooks'

export enum TrackCategory {
  GeneralVVFeatures = 'general_vv_features',
  HighlightEvents = 'highlight_events',
  OfflineAccess = 'offline_access',
  SearchVesselVV = 'search_vessel_vv',
  User = 'user',
  VesselDetailActivityByTypeTab = 'vessel_detail_activity_by_type_tab',
  VesselDetailActivityOrMapTab = 'vessel_detail_activity_or_map_tab',
  VesselDetailActivityTab = 'vessel_detail_activity_tab',
  VesselDetailInfoTab = 'vessel_detail_info_tab',
  VesselDetailMapTab = 'vessel_detail_map_tab',
  VesselDetailRiskSummaryTab = 'vessel_detail_risk_summary_tab',
  VesselDetail = 'vessel_detail',
}

export const trackEvent = trackEventBase<TrackCategory>

export const useAnalytics = () => {
  const { user, logged } = useUser()
  useAnalyticsBase({
    debugMode: GOOGLE_ANALYTICS_DEBUG_MODE,
    googleMeasurementId: GOOGLE_MEASUREMENT_ID,
    googleTagManagerId: GOOGLE_TAG_MANAGER_ID,
    logged,
    user,
  })
}
