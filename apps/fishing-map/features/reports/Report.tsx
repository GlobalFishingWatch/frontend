import { Fragment } from 'react'
import { Spinner } from '@globalfishingwatch/ui-components'
import { AsyncReducerStatus } from 'utils/async-slice'
import { useFetchReportArea, useFetchReportVessel } from './reports.hooks'
import ReportSummary from './ReportSummary'
import ReportTitle from './ReportTitle'
import ReportActivity from './ReportActivity'
import ReportVessels from './ReportVessels'

export type ReportType = 'activity' | 'area'
export type ReportActivityUnit = 'hours' | 'detections'

type ReportsProps = {}

export default function Report(props: ReportsProps) {
  const { status: reportStatus } = useFetchReportVessel()
  const { data: areaDetail } = useFetchReportArea()

  if (reportStatus === AsyncReducerStatus.Error) return <p>There was a error</p>
  if (reportStatus !== AsyncReducerStatus.Finished) return <Spinner />

  // TODO get this from datasets config
  const activityUnit = 'hours' // using hours as we are doing only fishing effort for now

  return (
    <Fragment>
      <ReportTitle title={areaDetail?.name} type="activity" />
      <ReportSummary />
      <ReportActivity activityUnit={activityUnit} />
      <ReportVessels activityUnit={activityUnit} reportName={areaDetail?.name} />
    </Fragment>
  )
}
