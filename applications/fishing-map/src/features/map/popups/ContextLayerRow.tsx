import React from 'react'
import { ContextLayerType } from '@globalfishingwatch/layer-composer/dist/generators/types'
import { TooltipEventFeature } from 'features/map/map.hooks'
import styles from './Popup.module.css'

// TODO: don't use titles here, think how to get the layer id
const propertyByTitle: Record<string, string> = {
  EEZ: 'geoname',
  'Tuna RFMO areas': 'id',
  'WPP NRI areas': 'region_id',
  mpa: 'name',
}
function getRowByLayer(feature: TooltipEventFeature) {
  console.log('getRowByLayer -> feature', feature)
  const property = propertyByTitle[feature.title]
    ? feature.properties[propertyByTitle[feature.title]]
    : ''
  return <div>{property || feature.value}</div>
}

type ContextTooltipRowProps = {
  feature: TooltipEventFeature
}

function ContextTooltipRow({ feature }: ContextTooltipRowProps) {
  return (
    <div className={styles.popupSection}>
      <span className={styles.popupSectionColor} style={{ backgroundColor: feature.color }} />
      <div className={styles.popupSectionContent}>
        <h3 className={styles.popupSectionTitle}>{feature.title}</h3>
        {getRowByLayer(feature)}
      </div>
    </div>
  )
}

export default ContextTooltipRow
