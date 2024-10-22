import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo } from 'react'
import { Button, Tab, Tabs } from '@globalfishingwatch/ui-components'
import { selectReportVesselGroupId } from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { VGRSection } from 'features/vessel-groups/vessel-groups.types'
import { TimebarVisualisations } from 'types'
import {
  useTimebarVesselGroupConnect,
  useTimebarVisualisationConnect,
} from 'features/timebar/timebar.hooks'
import VGREvents from 'features/reports/events/VGREvents'
import VGRActivity from 'features/reports/vessel-groups/activity/VGRActivity'
import { useSetMapCoordinates } from 'features/map/map-viewport.hooks'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'
import { isOutdatedVesselGroup } from 'features/vessel-groups/vessel-groups.utils'
import {
  useFitAreaInViewport,
  useReportAreaCenter,
  useVesselGroupBounds,
} from '../areas/area-reports.hooks'
import { useEditVesselGroupModal, useFetchVesselGroupReport } from './vessel-group-report.hooks'
import { selectVGRData, selectVGRStatus } from './vessel-group-report.slice'
import VesselGroupReportTitle from './VesselGroupReportTitle'
import VesselGroupReportVessels from './vessels/VesselGroupReportVessels'
import { selectVGRSection } from './vessel-group.config.selectors'
import VesselGroupReportInsights from './insights/VGRInsights'
import { selectVGRDataview } from './vessel-group-report.selectors'
import styles from './VesselGroupReport.module.css'

function VesselGroupReport() {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const fetchVesselGroupReport = useFetchVesselGroupReport()
  const vesselGroupId = useSelector(selectReportVesselGroupId)
  const isGFWUser = useSelector(selectIsGFWUser)
  const vesselGroup = useSelector(selectVGRData)!
  const reportStatus = useSelector(selectVGRStatus)
  const reportSection = useSelector(selectVGRSection)
  const reportDataview = useSelector(selectVGRDataview)
  const { dispatchTimebarVisualisation } = useTimebarVisualisationConnect()
  const { dispatchTimebarSelectedVGId } = useTimebarVesselGroupConnect()
  const fitAreaInViewport = useFitAreaInViewport()
  const { bbox } = useVesselGroupBounds(reportDataview?.id)
  const coordinates = useReportAreaCenter(bbox!)
  const setMapCoordinates = useSetMapCoordinates()
  const bboxHash = bbox ? bbox.join(',') : ''
  const isOutdated = isOutdatedVesselGroup(vesselGroup)
  const onEditClick = useEditVesselGroupModal()

  useEffect(() => {
    fetchVesselGroupReport(vesselGroupId)
    if (reportDataview) {
      dispatchTimebarVisualisation(TimebarVisualisations.VesselGroup)
      dispatchTimebarSelectedVGId(reportDataview?.id)
    }
  }, [
    reportDataview,
    dispatchTimebarSelectedVGId,
    dispatchTimebarVisualisation,
    fetchVesselGroupReport,
    vesselGroupId,
  ])

  useEffect(() => {
    if (reportSection === 'vessels' && coordinates) {
      setMapCoordinates(coordinates)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bboxHash, setMapCoordinates])

  const changeTab = useCallback(
    (tab: Tab<VGRSection>) => {
      dispatchQueryParams({ vGRSection: tab.id })
      trackEvent({
        category: TrackCategory.VesselGroupReport,
        action: `click_${tab.id}_tab`,
      })
      if (tab.id === 'activity') {
        fitAreaInViewport()
      }
    },
    [dispatchQueryParams, fitAreaInViewport]
  )

  const sectionTabs: Tab<VGRSection>[] = useMemo(
    () => [
      {
        id: 'vessels',
        title: t('common.vessels', 'vessels'),
        content: <VesselGroupReportVessels />,
      },
      {
        id: 'insights',
        title: t('common.insights', 'Insights'),
        content: <VesselGroupReportInsights />,
      },
      {
        id: 'activity',
        title: t('common.activity', 'Activity'),
        content: <VGRActivity />,
      },
      {
        id: 'events',
        title: t('common.events', 'Events'),
        content: <VGREvents />,
        disabled: !isGFWUser,
        tooltip: !isGFWUser ? t('common.comingSoon', 'Coming Soon!') : '',
      },
    ],
    [t, isGFWUser]
  )

  if (isOutdated) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.updateContainer}>
          <label>
            {t(
              'vesselGroupReport.linkDisabled',
              'You need to update the vessel group first to see the report'
            )}
          </label>
          <Button onClick={() => onEditClick(vesselGroup)}>
            {t('vesselGroup.clickToMigrate', 'Click to migrate')}
          </Button>
        </div>
      </div>
    )
  }

  // if (reportStatus === AsyncReducerStatus.Error) {
  //   return <VesselGroupReportError />
  // }

  return (
    <div>
      <VesselGroupReportTitle
        vesselGroup={vesselGroup}
        loading={reportStatus === AsyncReducerStatus.Loading}
      />
      <Tabs
        tabs={sectionTabs}
        activeTab={reportSection}
        onTabClick={changeTab}
        // mountAllTabsOnLoad
      />
    </div>
  )
}

export default VesselGroupReport
