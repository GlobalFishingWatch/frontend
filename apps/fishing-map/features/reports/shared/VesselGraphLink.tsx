import VesselLink from 'features/vessel/VesselLink'
import type { VesselGroupVesselTableParsed } from 'features/reports/vessel-groups/vessels/vessel-group-report-vessels.selectors'
import styles from './VesselGraphLink.module.css'

export default function VesselGraphLink({ data }: { data?: VesselGroupVesselTableParsed }) {
  if (!data) {
    return null
  }
  const { vesselId, dataset } = data
  return (
    <VesselLink
      className={styles.hiddenLink}
      vesselId={vesselId}
      datasetId={dataset}
      showTooltip={false}
    />
  )
}
