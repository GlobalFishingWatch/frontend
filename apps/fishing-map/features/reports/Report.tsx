import ReportTitle from './ReportTitle'

export type ReportType = 'activity' | 'area'

type ReportsProps = {}

export default function Report(props: ReportsProps) {
  return <ReportTitle title="title" type="activity" />
}
