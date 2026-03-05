import { useState } from 'react'

import type { Tab } from '@globalfishingwatch/ui-components'
import { Tabs } from '@globalfishingwatch/ui-components'

import DebugDataviews from './DebugDataviews'
import DebugFeatureFlags from './DebugFeatureFlags'
import DebugTestingTools from './DebugTestingTools'

type DebugTabId = 'feature-flags' | 'dataviews' | 'testing-tools'

const tabs: Tab<DebugTabId>[] = [
  { id: 'feature-flags', title: 'Feature flags', content: <DebugFeatureFlags /> },
  { id: 'dataviews', title: 'Dataviews', content: <DebugDataviews /> },
  { id: 'testing-tools', title: 'Testing tools', content: <DebugTestingTools /> },
]

const DebugMenu: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DebugTabId>('feature-flags')

  return (
    <Tabs<DebugTabId>
      tabs={tabs}
      activeTab={activeTab}
      onTabClick={(tab) => setActiveTab(tab.id)}
    />
  )
}

export default DebugMenu
