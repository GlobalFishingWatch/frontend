import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { BathymetryContourPickingObject } from '@globalfishingwatch/deck-layers'

import { getDatasetTitleByDataview } from 'features/_map/datasets/datasets.utils'
import { selectAllDataviewInstancesResolved } from 'features/_map/dataviews/selectors/dataviews.resolvers.selectors'
import I18nNumber from 'features/i18n/i18nNumber'

import PopupSectionLayout from '../shared/PopupSectionLayout'

import styles from '../Popup.module.css'

type BathymetryContourTooltipSectionProps = {
  features: BathymetryContourPickingObject[]
  showFeaturesDetails: boolean
}

function BathymetryContourTooltipSection({
  features,
  showFeaturesDetails,
}: BathymetryContourTooltipSectionProps) {
  const { t } = useTranslation()
  const dataviews = useSelector(selectAllDataviewInstancesResolved) as UrlDataviewInstance[]

  if (!features?.length) return null

  return (
    <Fragment>
      {features.map((feature) => {
        const dataview = dataviews.find((d) => d.id === feature.layerId)
        const depth = Math.abs(feature.properties.elevation)
        return (
          <PopupSectionLayout
            key={feature.id}
            icon="polygons"
            iconColor={feature.color}
            title={
              showFeaturesDetails
                ? dataview
                  ? getDatasetTitleByDataview(dataview, { showPrivateIcon: false })
                  : feature.title
                : undefined
            }
          >
            <div className={styles.row}>
              <span className={styles.rowText}>
                <I18nNumber number={depth} /> {t((t) => t.common.meters)}
              </span>
            </div>
          </PopupSectionLayout>
        )
      })}
    </Fragment>
  )
}

export default BathymetryContourTooltipSection
