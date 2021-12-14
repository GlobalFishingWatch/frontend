import React, { Fragment, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@globalfishingwatch/ui-components'
import I18nNumber from 'features/i18n/i18nNumber'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { ROOT_DOM_ELEMENT } from 'data/config'
import popupStyles from './Popup.module.css'
import styles from './FishingLayers.module.css'
import VesselsTable from './VesselsTable'

type FishingTooltipRowProps = {
  feature: TooltipEventFeature
  showFeaturesDetails: boolean
}

function FishingTooltipRow({ feature, showFeaturesDetails }: FishingTooltipRowProps) {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)

  const onModalClose = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  let title = feature.title
  if (feature.temporalgrid && feature.temporalgrid.interval === '10days') {
    title = [
      title,
      t('common.dateRange', {
        start: formatI18nDate(feature.temporalgrid.visibleStartDate),
        end: formatI18nDate(feature.temporalgrid.visibleEndDate),
        defaultValue: 'between {{start}} and {{end}}',
      }),
    ].join(' ')
  }

  return (
    <Fragment>
      <Modal appSelector={ROOT_DOM_ELEMENT} title={title} isOpen={modalOpen} onClose={onModalClose}>
        {feature.vesselsInfo && (
          <div className={styles.modalContainer}>
            <VesselsTable feature={feature} showFullList={true} />
            {feature.vesselsInfo.overflowLoad && (
              <div className={styles.vesselsMore}>
                + {feature.vesselsInfo.overflowLoadNumber} {t('common.more', 'more')}
              </div>
            )}
          </div>
        )}
      </Modal>
      <div className={popupStyles.popupSection}>
        <span
          className={popupStyles.popupSectionColor}
          style={{ backgroundColor: feature.color }}
        />
        <div className={popupStyles.popupSectionContent}>
          {showFeaturesDetails && <h3 className={popupStyles.popupSectionTitle}>{title}</h3>}
          <div className={popupStyles.row}>
            <span className={popupStyles.rowText}>
              <I18nNumber number={feature.value} />{' '}
              {t([`common.${feature.temporalgrid?.unit}` as any, 'common.hour'], 'hours', {
                count: parseInt(feature.value), // neded to select the plural automatically
              })}
            </span>
          </div>
          {feature.vesselsInfo && (
            <Fragment>
              <VesselsTable feature={feature} />
              {feature.vesselsInfo.overflow && (
                <button className={styles.vesselsMore} onClick={() => setModalOpen(true)}>
                  + {feature.vesselsInfo.overflowNumber} {t('common.more', 'more')}
                </button>
              )}
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  )
}

export default FishingTooltipRow
