import type { ReportVesselWithDatasets } from 'features/reports/areas/area-reports.selectors'
import type { VesselGroupVesselTableParsed } from 'features/reports/vessel-groups/vessels/vessel-group-report-vessels.selectors'
import VesselLink from 'features/vessel/VesselLink'

import styles from './VesselGraphLink.module.css'

export default function VesselGraphLink({
  data,
}: {
  data?: VesselGroupVesselTableParsed | ReportVesselWithDatasets
}) {
  if (!data) {
    return null
  }
  const { vesselId, dataset } = data
  const datasetId = dataset || (data as ReportVesselWithDatasets).infoDataset?.id
  return (
    <VesselLink
      className={styles.hiddenLink}
      vesselId={vesselId}
      datasetId={datasetId}
      showTooltip={false}
    />
  )
}
