import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { stringify } from 'qs'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import Button from '@globalfishingwatch/ui-components/dist/button'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { EventVessel } from '@globalfishingwatch/api-types/dist'
import { TooltipEventFeature, useClickedEventConnect } from 'features/map/map.hooks'
import { AsyncReducerStatus } from 'utils/async-slice'
import I18nDate from 'features/i18n/i18nDate'
import useViewport from '../map-viewport.hooks'
import styles from './Popup.module.css'

const CVP_LINK = 'https://carrier-portal.dev.globalfishingwatch.org/carrier-portal'

type UserContextLayersProps = {
  features: TooltipEventFeature[]
}

function TileClusterTooltipRow({ features }: UserContextLayersProps) {
  const { t } = useTranslation()
  const { apiEventStatus } = useClickedEventConnect()
  const { viewport } = useViewport()

  const onPinClick = (vessel: EventVessel | undefined) => {
    console.log('TODO')
    if (vessel) {
      console.log(vessel)
    }
  }

  return (
    <Fragment>
      {features.map((feature, index) => {
        const linkParams = {
          ...viewport,
          dataset: 'carriers:v20201201', // TODO remove hardcoded dataset here
          vessel: feature.event?.vessel?.id,
          ...(feature.event && { timestamp: new Date(feature.event.start).getTime() }),
        }
        const urlLink = `${CVP_LINK}/?${stringify(linkParams)}`
        return (
          <div key={`${feature.title}-${index}`} className={styles.popupSection}>
            <span className={styles.popupSectionColor} style={{ backgroundColor: feature.color }} />
            <div className={styles.popupSectionContent}>
              {<h3 className={styles.popupSectionTitle}>{feature.title}</h3>}
              <div className={styles.row}>
                {apiEventStatus === AsyncReducerStatus.Loading ? (
                  <div className={styles.loading}>
                    <Spinner size="small" />
                  </div>
                ) : feature.event ? (
                  <div>
                    <span className={styles.rowText}>
                      <I18nDate date={feature.event?.start as string} />
                    </span>
                    <div className={styles.rowColum}>
                      <p className={styles.rowTitle}>{t('vessel.carrier', 'Carrier')}</p>
                      <div className={styles.centered}>
                        <span className={styles.rowText}>{feature.event?.vessel?.name}</span>
                        <IconButton
                          icon="pin"
                          size="small"
                          onClick={() => onPinClick(feature.event?.vessel)}
                        />
                      </div>
                    </div>
                    <div className={styles.row}>
                      <div className={styles.column}>
                        <span className={styles.rowTitle}>{t('vessel.donor', 'Donor vessel')}</span>
                        <div className={styles.centered}>
                          <span className={styles.rowText}>
                            {feature.event?.encounter?.vessel?.name}
                          </span>
                          <IconButton
                            icon="pin"
                            size="small"
                            onClick={() => onPinClick(feature.event?.encounter?.vessel)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className={styles.row}>
                      <Button href={urlLink}>
                        {t('event.seeInCVP', 'See in Carrier Vessel Portal')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  t('event.noData', 'No data available')
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
