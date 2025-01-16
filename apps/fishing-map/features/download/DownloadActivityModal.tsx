import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { Tab } from '@globalfishingwatch/ui-components'
import { Modal, Tabs } from '@globalfishingwatch/ui-components'

import { ROOT_DOM_ELEMENT } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectActiveActivityAndDetectionsDataviews,
  selectActiveHeatmapAnimatedEnvironmentalDataviews,
} from 'features/dataviews/selectors/dataviews.selectors'
import { selectDownloadActivityModalOpen } from 'features/download/download.selectors'
import {
  resetDownloadActivityState,
  selectDownloadActiveTabId,
  setDownloadActiveTab,
} from 'features/download/downloadActivity.slice'
import DownloadActivityEnvironment from 'features/download/DownloadActivityEnvironment'

import { HeatmapDownloadTab } from './downloadActivity.config'
import DownloadActivityByVessel from './DownloadActivityByVessel'
import DownloadActivityGridded from './DownloadActivityGridded'

import styles from './DownloadModal.module.css'

function DownloadActivityModal() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const activeTabId = useSelector(selectDownloadActiveTabId)
  const activityAndDetectionsDataviews = useSelector(selectActiveActivityAndDetectionsDataviews)
  const environmentalDataviews = useSelector(selectActiveHeatmapAnimatedEnvironmentalDataviews)
  const downloadModalOpen = useSelector(selectDownloadActivityModalOpen)

  useEffect(() => {
    if (activityAndDetectionsDataviews.length > 0) {
      dispatch(setDownloadActiveTab(HeatmapDownloadTab.ByVessel))
    } else if (environmentalDataviews.length > 0) {
      dispatch(setDownloadActiveTab(HeatmapDownloadTab.Environment))
    }
  }, [activityAndDetectionsDataviews, dispatch, environmentalDataviews])

  const tabs = useMemo(() => {
    return [
      {
        id: HeatmapDownloadTab.ByVessel,
        title: t('download.byVessel', 'Active vessels'),
        content: <DownloadActivityByVessel />,
        disabled: activityAndDetectionsDataviews.length === 0,
      },
      {
        id: HeatmapDownloadTab.Gridded,
        title: t('download.gridded', 'Gridded activity'),
        content: <DownloadActivityGridded />,
        testId: 'activity-modal-gridded-activity',
        disabled: activityAndDetectionsDataviews.length === 0,
      },
      {
        id: HeatmapDownloadTab.Environment,
        title: t('common.environment', 'Environment'),
        content: <DownloadActivityEnvironment />,
        testId: 'activity-modal-environment',
        disabled: environmentalDataviews.length === 0,
      },
    ] as Tab<HeatmapDownloadTab>[]
  }, [t, environmentalDataviews, activityAndDetectionsDataviews])

  const activeTab = tabs.find((tab) => tab.id === activeTabId)

  const onTabClick = (tab: Tab<HeatmapDownloadTab>) => {
    dispatch(setDownloadActiveTab(tab?.id))
  }

  const onClose = () => {
    dispatch(resetDownloadActivityState())
  }

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={t('download.title', 'Download')}
      isOpen={downloadModalOpen}
      onClose={onClose}
      contentClassName={styles.modalContent}
    >
      <Tabs tabs={tabs} activeTab={activeTab?.id} onTabClick={onTabClick} buttonSize={'default'} />
    </Modal>
  )
}

export default DownloadActivityModal
