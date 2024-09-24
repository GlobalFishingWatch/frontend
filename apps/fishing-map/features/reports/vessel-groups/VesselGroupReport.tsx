import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo } from 'react'
import { Tab, Tabs } from '@globalfishingwatch/ui-components'
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
import { useFitAreaInViewport } from '../areas/area-reports.hooks'
import { useFetchVesselGroupReport } from './vessel-group-report.hooks'
import { selectVGRData, selectVGRStatus } from './vessel-group-report.slice'
import VesselGroupReportTitle from './VesselGroupReportTitle'
import VesselGroupReportVessels from './vessels/VesselGroupReportVessels'
import { selectVGRSection } from './vessel-group.config.selectors'
import VesselGroupReportInsights from './insights/VGRInsights'
import { selectVGRDataview } from './vessel-group-report.selectors'

function VesselGroupReport() {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const fetchVesselGroupReport = useFetchVesselGroupReport()
  const vesselGroupId = useSelector(selectReportVesselGroupId)
  const vesselGroup = useSelector(selectVGRData)!
  const reportStatus = useSelector(selectVGRStatus)
  const reportSection = useSelector(selectVGRSection)
  const reportDataview = useSelector(selectVGRDataview)
  const { dispatchTimebarVisualisation } = useTimebarVisualisationConnect()
  const { dispatchTimebarSelectedVGId } = useTimebarVesselGroupConnect()
  const fitAreaInViewport = useFitAreaInViewport()

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
      },
    ],
    [t]
  )

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
