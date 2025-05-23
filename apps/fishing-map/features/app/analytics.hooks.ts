import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { trackEvent as trackEventBase, useAnalyticsInit } from '@globalfishingwatch/react-hooks'

import { GOOGLE_MEASUREMENT_ID, GOOGLE_TAG_MANAGER_ID } from 'data/config'
import { selectIsGuestUser, selectUserData } from 'features/user/selectors/user.selectors'
import { selectLocationCategory, selectLocationType } from 'routes/routes.selectors'

const GOOGLE_ANALYTICS_DEBUG_MODE =
  (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TEST_MODE || 'false').toLowerCase() === 'true'

export enum TrackCategory {
  General = 'general',
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
  VesselGroupReport = 'vessel_group_report',
  VesselProfile = 'vessel_profile',
  WorkspaceManagement = 'workspace_management',
  MapInteraction = 'map_interaction',
}

export const trackEvent = trackEventBase<TrackCategory>

export const useAnalytics = () => {
  const { i18n } = useTranslation()
  const user = useSelector(selectUserData)
  const locationType = useSelector(selectLocationType)
  const locationCategory = useSelector(selectLocationCategory)
  const isGuestUser = useSelector(selectIsGuestUser)

  const { initialized, setConfig } = useAnalyticsInit({
    debugMode: GOOGLE_ANALYTICS_DEBUG_MODE,
    googleMeasurementId: GOOGLE_MEASUREMENT_ID,
    googleTagManagerId: GOOGLE_TAG_MANAGER_ID,
  })

  useEffect(() => {
    if (initialized && locationType && (isGuestUser || (user && user.id))) {
      trackEvent({
        category: TrackCategory.General,
        action: 'general',
        other: {
          pagetype:
            locationType === 'WORKSPACES_LIST'
              ? locationType + ' (' + locationCategory + ')'
              : locationType,
          language: i18n.language,
          user_login_state: isGuestUser ? 'logged out' : 'Logged in',
          ...(!isGuestUser && {
            user_id: user?.id,
            // customer_email: user?.email,
            // customer_email_hashed: user?.email ? btoa(user.email) : '',
            organization_type: user?.organizationType,
            organization_type_hashed: user?.organizationType ? btoa(user.organizationType) : '',
            country: user?.country,
            user_group: user?.groups.join(','),
          }),
        },
      } as any)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, locationType, user, isGuestUser, locationCategory])

  useEffect(() => {
    if (initialized && user && !isGuestUser) {
      setConfig({
        user_id: user.id ?? '',
        user_country: user.country ?? '',
        user_group: user.groups?.join(',') ?? '',
        user_org_type: user.organizationType ?? '',
        user_organization: user.organization ?? '',
        user_language: user.language ?? '',
      })
    }
  }, [initialized, user, isGuestUser, setConfig])

  return initialized
}
