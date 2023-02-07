import { Fragment } from 'react'
import { Spinner } from '@globalfishingwatch/ui-components'
import { AsyncReducerStatus } from 'utils/async-slice'
import ReportSummary from './ReportSummary'
import ReportTitle from './ReportTitle'
import { useFetchReportArea, useFetchReportVessel } from './reports.hooks'

export type ReportType = 'activity' | 'area'

type ReportsProps = {}

export default function Report(props: ReportsProps) {
  const { status: reportStatus } = useFetchReportVessel()
  const { data: areaDetail } = useFetchReportArea()

  if (reportStatus === AsyncReducerStatus.Error) return <p>There was a error</p>
  if (reportStatus !== AsyncReducerStatus.Finished) return <Spinner />

  return (
    <Fragment>
      <ReportTitle title={areaDetail?.name} type="activity" />
      <ReportSummary />
    </Fragment>
  )
}
