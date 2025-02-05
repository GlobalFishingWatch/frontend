import VesselLink from 'features/vessel/VesselLink'

import type { ReportTableVessel } from './report-vessels.types'

import styles from './VesselGraphLink.module.css'

export default function VesselGraphLink({ data }: { data?: ReportTableVessel }) {
  if (!data) {
    return null
  }
  const { id, datasetId } = data
  return (
    <VesselLink
      className={styles.hiddenLink}
      vesselId={id}
      datasetId={datasetId}
      showTooltip={false}
    />
  )
}
