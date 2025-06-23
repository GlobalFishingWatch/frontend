import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { groupBy } from 'es-toolkit'

import type { ContextPickingObject, UserLayerPickingObject } from '@globalfishingwatch/deck-layers'
import { Icon, IconButton } from '@globalfishingwatch/ui-components'

import type { ExtendedFeatureByVesselEventPort } from 'features/map/map.slice'
import PortsReportLink from 'features/reports/report-port/PortsReportLink'
import { formatInfoField } from 'utils/info'

import styles from '../Popup.module.css'

type PortsLayersProps = {
  features: (ContextPickingObject | UserLayerPickingObject)[]
  showFeaturesDetails: boolean
}

function PortsTooltipSection({ features, showFeaturesDetails = false }: PortsLayersProps) {
  const { t } = useTranslation()
  const featuresByType = groupBy(features, (f) => f.layerId)
  return (
    <Fragment>
      {Object.values(featuresByType).map((featureByType, index) => {
        const { color } = featureByType[0]
        return (
          <div key={`${featureByType[0].title}-${index}`} className={styles.popupSection}>
            <Icon icon="dots" className={styles.layerIcon} style={{ color }} />
            <div className={styles.popupSectionContent}>
              {showFeaturesDetails && (
                <h3 className={styles.popupSectionTitle}>{t('event.port_other', 'Ports')}</h3>
              )}
              {featureByType.map((feature) => {
                const { port_id, name, flag } = feature.properties
                const port: ExtendedFeatureByVesselEventPort = {
                  id: port_id,
                  name,
                  country: flag,
                }
                return (
                  <div className={styles.row} key={port_id}>
                    <span className={styles.rowText}>
                      {`${formatInfoField(name, 'port')} (${formatInfoField(flag, 'flag')})`}
                    </span>
                    {showFeaturesDetails && (
                      <div className={styles.rowActions}>
                        <PortsReportLink port={port}>
                          <IconButton
                            icon="analysis"
                            tooltip={t(
                              'portsReport.seePortReport',
                              'See all entry events to this port'
                            )}
                            size="small"
                          />
                        </PortsReportLink>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </Fragment>
  )
}

export default PortsTooltipSection
