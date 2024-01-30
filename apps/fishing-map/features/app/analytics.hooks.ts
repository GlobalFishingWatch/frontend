import { useSelector } from 'react-redux'
import {
  trackEvent as trackEventBase,
  useAnalytics as useAnalyticsBase,
} from '@globalfishingwatch/react-hooks'
import { GOOGLE_MEASUREMENT_ID, GOOGLE_TAG_MANAGER_ID } from 'data/config'
import { selectIsUserLogged, selectUserData } from 'features/user/selectors/user.selectors'
import { selectLocationCategory } from 'routes/routes.selectors'

export const GOOGLE_ANALYTICS_DEBUG_MODE =
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
  VesselProfile = 'vessel_profile',
  VesselGroups = 'vessel_groups',
  WorkspaceManagement = 'workspace_management',
}

export const trackEvent = trackEventBase<TrackCategory>

export const useAnalytics = () => {
  const user = useSelector(selectUserData)
  const logged = useSelector(selectIsUserLogged)
  const locationCategory = useSelector(selectLocationCategory)

  useAnalyticsBase({
    debugMode: GOOGLE_ANALYTICS_DEBUG_MODE,
    googleMeasurementId: GOOGLE_MEASUREMENT_ID,
    googleTagManagerId: GOOGLE_TAG_MANAGER_ID,
    logged,
    pageview: locationCategory,
    user,
  })
}
