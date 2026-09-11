import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { groupBy } from 'es-toolkit'

import type { ContextPickingObject, UserLayerPickingObject } from '@globalfishingwatch/deck-layers'
import { IconButton } from '@globalfishingwatch/ui-components'

import type { ExtendedFeatureByVesselEventPort } from 'features/_map/map/map.slice'
import PortsReportLink from 'features/_reports/report-port/PortsReportLink'
import { formatInfoField } from 'utils/info'

import PopupSectionLayout from '../shared/PopupSectionLayout'

import styles from '../Popup.module.css'

type PortsTooltipSectionProps = {
  features: (ContextPickingObject | UserLayerPickingObject)[]
  showFeaturesDetails: boolean
}

function PortsTooltipSection({ features, showFeaturesDetails = false }: PortsTooltipSectionProps) {
  const { t } = useTranslation()
  const featuresByType = groupBy(features, (f) => f.layerId)
  return (
    <Fragment>
      {Object.values(featuresByType).map((featureByType, index) => {
        const { dataviewId, color } = featureByType[0]
        return (
          <PopupSectionLayout
            key={`${dataviewId}-${index}`}
            icon="dots"
            iconColor={color}
            title={showFeaturesDetails ? t((t) => t.event.ports) : undefined}
          >
            {featureByType.map((feature) => {
              const { id, name, flag } = feature.properties
              const port: ExtendedFeatureByVesselEventPort = {
                id: feature?.id || id,
                name,
                country: flag,
              }
              return (
                <div className={cx(styles.row, styles.popupSectionRow)} key={port.id}>
                  <span className={styles.rowText}>
                    {`${formatInfoField(name, 'port')} (${formatInfoField(flag, 'flag')})`}
                  </span>
                  {showFeaturesDetails && (
                    <div className={styles.rowActions}>
                      <PortsReportLink port={port}>
                        <IconButton
                          icon="analysis"
                          tooltip={t((t) => t.portsReport.seePortReport)}
                          size="small"
                        />
                      </PortsReportLink>
                    </div>
                  )}
                </div>
              )
            })}
          </PopupSectionLayout>
        )
      })}
    </Fragment>
  )
}

export default PortsTooltipSection
