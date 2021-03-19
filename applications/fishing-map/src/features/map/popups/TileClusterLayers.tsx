import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { stringify } from 'qs'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import Button from '@globalfishingwatch/ui-components/dist/button'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { EventVessel } from '@globalfishingwatch/api-types/dist'
import { TooltipEventFeature, useClickedEventConnect } from 'features/map/map.hooks'
import { AsyncReducerStatus } from 'utils/async-slice'
import I18nDate from 'features/i18n/i18nDate'
import { getVesselDataviewInstance } from 'features/dataviews/dataviews.utils'
import { selectTimeRange } from 'features/app/app.selectors'
import { formatInfoField } from 'utils/info'
import { DEFAULT_VESSEL_DATAVIEW_ID } from 'data/workspaces'
import { selectDataviewById } from 'features/dataviews/dataviews.slice'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import useViewport from '../map-viewport.hooks'
import styles from './Popup.module.css'

const CVP_LINK = 'https://carrier-portal.dev.globalfishingwatch.org/carrier-portal'

type UserContextLayersProps = {
  features: TooltipEventFeature[]
}

function TileClusterTooltipRow({ features }: UserContextLayersProps) {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { apiEventStatus } = useClickedEventConnect()
  const defaultVesselDataview = useSelector(selectDataviewById(DEFAULT_VESSEL_DATAVIEW_ID))
  const { start, end } = useSelector(selectTimeRange)
  const { viewport } = useViewport()

  const onPinClick = (vessel: EventVessel, feature: TooltipEventFeature) => {
    // TODO: READ dataset from this dataview and obtain related datasets instead of using the default ones
    const trackDatasetId = defaultVesselDataview?.datasetsConfig?.find(
      (config) => config.endpoint === 'carriers-tracks'
    )?.datasetId

    const infoDatasetId = defaultVesselDataview?.datasetsConfig?.find(
      (config) => config.endpoint === 'carriers-vessel'
    )?.datasetId

    if (trackDatasetId && infoDatasetId) {
      const vesselDataviewInstance = getVesselDataviewInstance(
        { id: vessel.id },
        {
          trackDatasetId: trackDatasetId as string,
          infoDatasetId: infoDatasetId,
        }
      )
      upsertDataviewInstance(vesselDataviewInstance)
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
          start,
          end,
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
                    {feature.event?.vessel && (
                      <div className={styles.rowColum}>
                        <p className={styles.rowTitle}>{t('vessel.carrier', 'Carrier')}</p>
                        <div className={styles.centered}>
                          <span className={styles.rowText}>
                            {formatInfoField(feature.event?.vessel?.name, 'name')}
                          </span>
                          <IconButton
                            icon="pin"
                            size="small"
                            onClick={() =>
                              onPinClick(feature.event?.vessel as EventVessel, feature)
                            }
                          />
                        </div>
                      </div>
                    )}
                    {feature.event.encounter?.vessel && (
                      <div className={styles.row}>
                        <div className={styles.column}>
                          <span className={styles.rowTitle}>
                            {t('vessel.donor', 'Donor vessel')}
                          </span>
                          <div className={styles.centered}>
                            <span className={styles.rowText}>
                              {formatInfoField(feature.event.encounter?.vessel?.name, 'name')}
                            </span>
                            <IconButton
                              icon="pin"
                              size="small"
                              onClick={() =>
                                onPinClick(feature.event?.encounter?.vessel as EventVessel, feature)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className={styles.row}>
                      <Button href={urlLink} target="_blank">
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
