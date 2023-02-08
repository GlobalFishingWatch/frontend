import React from 'react'
import { ReportActivityUnit } from './Report'
import ReportActivityGraph from './ReportActivityGraph'

type ReportVesselTableProps = {
  activityUnit: ReportActivityUnit
}

export default function ReportActivity({ activityUnit }: ReportVesselTableProps) {
  return (
    <div>
      <ReportActivityGraph />
    </div>
  )
}
