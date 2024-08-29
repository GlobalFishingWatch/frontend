import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo } from 'react'
import { Tab, Tabs } from '@globalfishingwatch/ui-components'
import { selectReportVesselGroupId } from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { VesselGroupReportSection } from 'types'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { useFetchVesselGroupReport } from './vessel-group-report.hooks'
import {
  selectVesselGroupReportData,
  selectVesselGroupReportStatus,
} from './vessel-group-report.slice'
import VesselGroupReportError from './VesselGroupReportError'
import VesselGroupReportTitle from './VesselGroupReportTitle'
import VesselGroupReportVessels from './vessels/VesselGroupReportVessels'
import { selectVesselGroupReportSection } from './vessel-group.config.selectors'

type VesselGroupReportProps = {}

function VesselGroupReport(props: VesselGroupReportProps) {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const fetchVesselGroupReport = useFetchVesselGroupReport()
  const vesselGroupId = useSelector(selectReportVesselGroupId)
  const vesselGroup = useSelector(selectVesselGroupReportData)!
  const reportStatus = useSelector(selectVesselGroupReportStatus)
  const reportSection = useSelector(selectVesselGroupReportSection)

  useEffect(() => {
    fetchVesselGroupReport(vesselGroupId)
  }, [fetchVesselGroupReport, vesselGroupId])

  const changeTab = useCallback(
    (tab: Tab<VesselGroupReportSection>) => {
      dispatchQueryParams({ vesselGroupReportSection: tab.id })
      trackEvent({
        category: TrackCategory.VesselGroupReport,
        action: `click_${tab.id}_tab`,
      })
    },
    [dispatchQueryParams]
  )

  const sectionTabs: Tab<VesselGroupReportSection>[] = useMemo(
    () => [
      {
        id: 'vessels',
        title: t('common.vessels', 'vessels'),
        content: <VesselGroupReportVessels />,
      },
      {
        id: 'insights',
        title: t('common.areas', 'Areas'),
        disabled: true,
        content: <p>Coming soon</p>,
      },
      {
        id: 'activity',
        title: t('common.activity', 'Activity'),
        disabled: true,
        content: <p>Coming soon</p>,
      },
      {
        id: 'events',
        title: t('common.events', 'Events'),
        disabled: true,
        content: <p>Coming soon</p>,
      },
    ],
    [t]
  )

  if (reportStatus === AsyncReducerStatus.Error) {
    return <VesselGroupReportError />
  }

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
        mountAllTabsOnLoad
      />
    </div>
  )
}

export default VesselGroupReport
