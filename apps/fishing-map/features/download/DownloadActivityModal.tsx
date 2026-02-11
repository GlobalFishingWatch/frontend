import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { useLocalStorage } from '@globalfishingwatch/react-hooks'
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
import DownloadSurvey, { DISABLE_DOWNLOAD_SURVEY } from 'features/download/DownloadSurvey'

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
  const [disableDownloadSurvey, _] = useLocalStorage(DISABLE_DOWNLOAD_SURVEY, false)
  const [showSurvey, setShowSurvey] = useState(false)

  useEffect(() => {
    if (activityAndDetectionsDataviews.length > 0) {
      dispatch(setDownloadActiveTab(HeatmapDownloadTab.ByVessel))
    } else if (environmentalDataviews.length > 0) {
      dispatch(setDownloadActiveTab(HeatmapDownloadTab.Environment))
    }
  }, [activityAndDetectionsDataviews, dispatch, environmentalDataviews])

  const onDownload = useCallback(() => {
    if (!disableDownloadSurvey) {
      setShowSurvey(true)
    }
  }, [disableDownloadSurvey])

  const tabs = useMemo(() => {
    return [
      {
        id: HeatmapDownloadTab.ByVessel,
        title: t((t) => t.download.byVessel),
        content: <DownloadActivityByVessel onDownloadCallback={onDownload} />,
        disabled: activityAndDetectionsDataviews.length === 0,
      },
      {
        id: HeatmapDownloadTab.Gridded,
        title: t((t) => t.download.gridded),
        content: <DownloadActivityGridded onDownloadCallback={onDownload} />,
        testId: 'activity-modal-gridded-activity',
        disabled: activityAndDetectionsDataviews.length === 0,
      },
      {
        id: HeatmapDownloadTab.Environment,
        title: t((t) => t.common.environment),
        content: <DownloadActivityEnvironment onDownloadCallback={onDownload} />,
        testId: 'activity-modal-environment',
        disabled: environmentalDataviews.length === 0,
      },
    ] as Tab<HeatmapDownloadTab>[]
  }, [t, environmentalDataviews, activityAndDetectionsDataviews, onDownload])

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
      title={t((t) => t.download.title)}
      isOpen={downloadModalOpen}
      onClose={onClose}
      contentClassName={styles.modalContent}
    >
      {showSurvey ? (
        <DownloadSurvey onClose={onClose} />
      ) : (
        <Tabs
          tabs={tabs}
          activeTab={activeTab?.id}
          onTabClick={onTabClick}
          buttonSize={'default'}
        />
      )}
    </Modal>
  )
}

export default DownloadActivityModal
