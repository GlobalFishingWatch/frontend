import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import Button from '@globalfishingwatch/ui-components/dist/button'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { TooltipEventFeature, useClickedEventConnect } from 'features/map/map.hooks'
import { AsyncReducerStatus } from 'utils/async-slice'
import styles from './Popup.module.css'

type UserContextLayersProps = {
  features: TooltipEventFeature[]
}

function TileClusterTooltipRow({ features }: UserContextLayersProps) {
  const { t } = useTranslation()
  const { apiEventStatus } = useClickedEventConnect()
  return (
    <Fragment>
      {features.map((feature, index) => {
        return (
          <div key={`${feature.title}-${index}`} className={styles.popupSection}>
            <span className={styles.popupSectionColor} style={{ backgroundColor: feature.color }} />
            <div className={styles.popupSectionContent}>
              {<h3 className={styles.popupSectionTitle}>{feature.title}</h3>}
              <div className={styles.row} key={`${feature.value}-${index}`}>
                {apiEventStatus === AsyncReducerStatus.Loading ? (
                  <div className={styles.loading}>
                    <Spinner size="small" />
                  </div>
                ) : (
                  <div>
                    <div className={styles.row}>
                      <span className={styles.rowText}>{feature.event?.start}</span>
                    </div>
                    <div className={styles.row}>
                      <span className={styles.rowText}>{feature.event?.vessel?.name}</span>
                      <IconButton icon="plus" />
                    </div>
                    <div className={styles.row}>
                      <span className={styles.rowText}>
                        {feature.event?.encounter?.vessel?.name}
                      </span>
                    </div>
                    <div className={styles.row}>
                      <Button>{t('event.seeInCVP', 'See in Carrier Vessel Portal')}</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </Fragment>
  )
}

export default TileClusterTooltipRow
