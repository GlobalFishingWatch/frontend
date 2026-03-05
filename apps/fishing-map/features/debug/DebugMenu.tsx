import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import type { Tab } from '@globalfishingwatch/ui-components'
import { Tabs } from '@globalfishingwatch/ui-components'

import { selectIsGFWUser } from 'features/user/selectors/user.selectors'

import DebugDataviews from './DebugDataviews'
import DebugFeatureFlags from './DebugFeatureFlags'
import DebugTestingTools from './DebugTestingTools'

type DebugTabId = 'feature-flags' | 'dataviews' | 'testing-tools'

const DebugMenu: React.FC = () => {
  const isGFWUser = useSelector(selectIsGFWUser)

  const tabs: Tab<DebugTabId>[] = useMemo(() => {
    const tabs = [
      { id: 'dataviews', title: 'Dataviews', content: <DebugDataviews /> },
      { id: 'testing-tools', title: 'Testing tools', content: <DebugTestingTools /> },
    ] as Tab<DebugTabId>[]

    if (isGFWUser) {
      return [
        { id: 'feature-flags', title: 'Feature flags', content: <DebugFeatureFlags /> },
        ...tabs,
      ]
    }
    return tabs
  }, [isGFWUser])

  const [activeTab, setActiveTab] = useState<DebugTabId>(tabs[0].id)

  return (
    <Tabs<DebugTabId>
      tabs={tabs}
      activeTab={activeTab}
      onTabClick={(tab) => setActiveTab(tab.id)}
    />
  )
}

export default DebugMenu
