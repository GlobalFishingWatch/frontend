import { useSelector } from 'react-redux'

import type { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import type { TabsProps } from '@globalfishingwatch/ui-components'
import { Tabs } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useVesselIdentityTabs } from 'features/vessel/identity/vessel-identity.hooks'
import { selectVesselIdentitySource } from 'features/vessel/vessel.config.selectors'
import { useReplaceQueryParams } from 'router/routes.hook'

import styles from './VesselIdentity.module.css'

const VesselIdentity = () => {
  const { replaceQueryParams } = useReplaceQueryParams()
  const identitySource = useSelector(selectVesselIdentitySource)
  const { identityTabs } = useVesselIdentityTabs()

  const onTabClick: TabsProps<VesselIdentitySourceEnum>['onTabClick'] = (tab) => {
    replaceQueryParams({ vesselIdentitySource: tab.id })
    trackEvent({
      category: TrackCategory.VesselProfile,
      action: 'click_vessel_source_tab',
      label: tab.id,
    })
  }

  return (
    <div className={styles.identityContainer}>
      <Tabs
        activeTab={identitySource}
        onTabClick={onTabClick}
        className={styles.tabsContainer}
        tabs={identityTabs}
      />
    </div>
  )
}

export default VesselIdentity
