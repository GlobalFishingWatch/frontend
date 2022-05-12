import React, { Fragment } from 'react'
import { groupBy } from 'lodash'
import { useTranslation } from 'react-i18next'
import { Icon, Spinner } from '@globalfishingwatch/ui-components'
import I18nNumber from 'features/i18n/i18nNumber'
import { TooltipEventFeature, useClickedEventConnect } from 'features/map/map.hooks'
import { AsyncReducerStatus } from 'utils/async-slice'
import { MAX_TOOLTIP_LIST } from '../map.slice'
import styles from './Popup.module.css'

type SarsTooltipRowProps = {
  feature: TooltipEventFeature
  showFeaturesDetails: boolean
}
function SarsTooltipRow({ feature, showFeaturesDetails }: SarsTooltipRowProps) {
  console.log(feature)
  const { t } = useTranslation()
  const { sarsInteractionStatus } = useClickedEventConnect()
  const sarsGroupedById = groupBy(feature.sars?.slice(0, MAX_TOOLTIP_LIST), 'ssvid')
  const overflows = feature.sars?.length > MAX_TOOLTIP_LIST

  return (
    <div className={styles.popupSection}>
      <Icon icon="heatmap" className={styles.layerIcon} style={{ color: feature.color }} />
      <div className={styles.popupSectionContent}>
        {showFeaturesDetails && <h3 className={styles.popupSectionTitle}>{feature.title}</h3>}
        <div className={styles.row}>
          <span className={styles.rowText}>
            <I18nNumber number={feature.value} />{' '}
            {t([`common.${feature.temporalgrid?.unit}` as any, 'common.detection'], 'detections', {
              count: parseInt(feature.value), // neded to select the plural automatically
            })}
          </span>
        </div>
        {sarsInteractionStatus === AsyncReducerStatus.Loading && (
          <div className={styles.loading}>
            <Spinner size="small" />
          </div>
        )}
        {showFeaturesDetails &&
          sarsInteractionStatus === AsyncReducerStatus.Finished &&
          sarsGroupedById && (
            <Fragment>
              <table className={styles.viirsTable}>
                <thead>
                  <tr>
                    <th>{t('vessel.ssvid', 'Ssvid')}</th>
                    <th>
                      {t(
                        [`common.${feature.temporalgrid?.unit}` as any, 'common.detection'],
                        'detections',
                        {
                          count: parseInt(feature.value), // neded to select the plural automatically
                        }
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(sarsGroupedById).map((id) => {
                    const detections = sarsGroupedById[id]
                    return (
                      <tr key={id}>
                        <td>{id}</td>
                        <td>{<I18nNumber number={detections.length} />}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </Fragment>
          )}
        {overflows && (
          <div className={styles.vesselsMore}>
            + {feature.sars.length - MAX_TOOLTIP_LIST} {t('common.more', 'more')}
          </div>
        )}
      </div>
    </div>
  )
}

export default SarsTooltipRow
