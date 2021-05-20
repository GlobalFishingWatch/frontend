import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectUserData } from 'features/user/user.slice'

const GOOGLE_UNIVERSAL_ANALYTICS_ID = process.env.REACT_APP_GOOGLE_UNIVERSAL_ANALYTICS_ID

export const useAnalytics = () => {
  const userData = useSelector(selectUserData)

  useEffect(() => {
    if (userData && GOOGLE_UNIVERSAL_ANALYTICS_ID && window.gtag) {
      window.gtag('config', GOOGLE_UNIVERSAL_ANALYTICS_ID, {
        user_id: userData.id,
        custom_map: {
          dimension1: 'userId',
          dimension3: 'userGroup',
          dimension4: 'userOrgType',
          dimension5: 'userOrganization',
          dimension6: 'userCountry',
          dimension7: 'userLanguage',
        },
      })
      window.gtag('set', 'user_properties', {
        user_id: userData.id,
        user_group: userData.groups,
        user_org_type: userData.organizationType,
        user_organization: userData.organization,
        user_country: userData.country,
        user_language: userData.language,
      })
      window.gtag('event', 'login', {
        userId: userData.id,
        userGroup: userData.groups,
        userOrgType: userData.organizationType,
        userOrganization: userData.organization,
        userCountry: userData.country,
        userLanguage: userData.language,
      })
    }
  }, [userData])
}
