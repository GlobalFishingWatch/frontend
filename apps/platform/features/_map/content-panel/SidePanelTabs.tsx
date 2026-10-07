import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { Icon } from '@globalfishingwatch/ui-components/icon'
import { Tabs } from '@globalfishingwatch/ui-components/tabs'

import { IS_CHATBOT_ENABLED } from 'data/map/config'
import { useSidePanel, useSidePanelLabel } from 'features/_map/content-panel/contentPanel.hooks'
import { useAppSearch } from 'router/routes.hook'
import type { SidePanelContent, SidePanelState } from 'types'

import styles from './SidePanelTabs.module.css'

const ChatContainer = lazy(() => import('features/_map/content-panel/chat/ChatContainer'))
const DataTerminologyContent = lazy(
  () => import('features/_map/content-panel/data-terminology/DataTerminologyContent')
)
const DatasetInfoContainer = lazy(
  () => import('features/_map/content-panel/datasets-info/DatasetInfoContainer')
)
const UserDatasetInfoContainer = lazy(
  () => import('features/_map/content-panel/datasets-info/UserDatasetInfoContainer')
)
const UserGuideContent = lazy(
  () => import('features/_map/content-panel/user-guide/UserGuideContent')
)

function SidePanelView({ item }: { item: SidePanelState }) {
  return (
    <Suspense fallback={null}>
      {item.type === 'userGuide' && (
        <UserGuideContent id={item.id} subcontentId={item.subcontentId} />
      )}
      {item.type === 'datasets' && (
        <DatasetInfoContainer id={item.id} subcontentId={item.subcontentId} />
      )}
      {item.type === 'userDataset' && <UserDatasetInfoContainer id={item.id} />}
      {item.type === 'dataTerminology' && <DataTerminologyContent id={item.id} />}
      {item.type === 'chat' && IS_CHATBOT_ENABLED && <ChatContainer />}
    </Suspense>
  )
}

function SidePanelTabs() {
  const { sidePanels = [], sidePanelActive } = useAppSearch()
  const { t } = useTranslation()
  const { setActiveSidePanel, closeSidePanel } = useSidePanel()
  const getLabel = useSidePanelLabel()
  const activeTab = sidePanels.some((panel) => panel.type === sidePanelActive)
    ? sidePanelActive
    : sidePanels[0]?.type

  return (
    <Tabs<SidePanelContent>
      className={styles.tabs}
      headerClassName={cx(styles.header, { [styles.single]: sidePanels.length === 1 })}
      tabClassName={styles.tabContent}
      activeTab={activeTab}
      buttonSize="small"
      tabs={sidePanels.map((panel) => ({
        id: panel.type,
        title: (
          <span className={styles.tabTitle}>
            {getLabel(panel.type)}
            <span
              role="button"
              tabIndex={0}
              className={styles.close}
              aria-label={t((t) => t.common.close)}
              onClick={(e) => {
                e.stopPropagation()
                closeSidePanel(panel.type)
              }}
            >
              <Icon icon="close" />
            </span>
          </span>
        ),
        content: <SidePanelView item={panel} />,
      }))}
      onTabClick={(tab) => setActiveSidePanel(tab.id)}
    />
  )
}

export default SidePanelTabs
