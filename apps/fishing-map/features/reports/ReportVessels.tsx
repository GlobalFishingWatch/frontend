import React from 'react'
import { ReportActivityUnit } from './Report'
import ReportVesselsGraph from './ReportVesselsGraph'
import ReportVesselsFilter from './ReportVesselsFilter'
import ReportVesselsTable from './ReportVesselsTable'

type ReportVesselTableProps = {
  activityUnit: ReportActivityUnit
}

export default function ReportVessels({ activityUnit }: ReportVesselTableProps) {
  return (
    <div>
      <ReportVesselsGraph />
      <ReportVesselsFilter />
      <ReportVesselsTable activityUnit={activityUnit} />
    </div>
  )
}
