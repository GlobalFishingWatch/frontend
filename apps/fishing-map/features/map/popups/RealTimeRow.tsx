import React, { Fragment, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { stringify } from 'qs'
import { groupBy } from 'lodash'
import { Button, Icon, IconButton } from '@globalfishingwatch/ui-components'
import { ApiEvent, DatasetTypes, EventVessel } from '@globalfishingwatch/api-types'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { AsyncReducerStatus } from 'utils/async-slice'
import I18nDate from 'features/i18n/i18nDate'
import {
  ENCOUNTER_EVENTS_SOURCE_ID,
  getVesselDataviewInstance,
  getVesselInWorkspace,
} from 'features/dataviews/dataviews.utils'
import { formatInfoField } from 'utils/info'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { CARRIER_PORTAL_URL } from 'data/config'
import { useCarrierLatestConnect } from 'features/datasets/datasets.hook'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.slice'
import { getRelatedDatasetByType, getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import useViewport from '../map-viewport.hooks'
import { ExtendedEventVessel, ExtendedFeatureEvent } from '../map.slice'
import styles from './Popup.module.css'

type SkylightVessel = {
  vessel: string
  name: string
  mmsi: string
}

type SkylightTranshipment = 'low' | 'med' | 'high'

type SkylightEvent = {
  event_id: string
  start_time: string
  end_time: string
  event_type?: 'rendezvous'
  transhipment: SkylightTranshipment
  participants: SkylightVessel[]
}

const parseEvent = (properties: Record<string, string>): SkylightEvent => {
  try {
    const vessels = JSON.parse(properties.participants) as SkylightVessel[]
    const event: SkylightEvent = {
      event_id: properties.event_id,
      start_time: properties.start_time,
      end_time: properties.end_time,
      transhipment: properties.transhipment as SkylightTranshipment,
      participants: vessels,
    }
    return event
  } catch (e) {
    console.warn('Parcipants parse error')
  }
}

type EncountersLayerProps = {
  feature: TooltipEventFeature
  showFeaturesDetails: boolean
}

function SkylightEncounterTooltipRow({ feature, showFeaturesDetails }: EncountersLayerProps) {
  const { t } = useTranslation()
  const event = parseEvent(feature.properties)

  if (!showFeaturesDetails) return <div className={styles.row}>{event.start_time}</div>
  const vessel1 = event.participants?.[0]
  const vessel2 = event.participants?.[1]
  return (
    <div className={styles.row}>
      {event ? (
        <div className={styles.rowContainer}>
          <span className={styles.rowText}>
            <I18nDate date={event.start_time as string} />
            {' - '}
            <I18nDate date={event.end_time as string} />
          </span>
          <div className={styles.flex}>
            {vessel1 && (
              <div className={styles.rowColum}>
                <p className={styles.rowTitle}>{t('vessel.carrier', 'Carrier')}</p>
                <div className={styles.centered}>
                  <span className={styles.rowText}>
                    {vessel1?.name && vessel1?.name !== 'Unknown'
                      ? formatInfoField(vessel1.name, 'name')
                      : vessel1.mmsi}
                  </span>
                </div>
              </div>
            )}
            {vessel2 && (
              <div className={styles.row}>
                <div className={styles.rowColum}>
                  <span className={styles.rowTitle}>{t('vessel.donor', 'Donor vessel')}</span>
                  <div className={styles.centered}>
                    <span className={styles.rowText}>
                      {vessel2?.name && vessel2?.name !== 'Unknown'
                        ? formatInfoField(vessel2.name, 'name')
                        : vessel2.mmsi}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        t('event.noData', 'No data available')
      )}
    </div>
  )
}

type UserContextLayersProps = {
  features: TooltipEventFeature[]
  showFeaturesDetails: boolean
}

function RealTimeRow({ features, showFeaturesDetails }: UserContextLayersProps) {
  console.log(features)
  const featuresByType = groupBy(features, 'layerId')
  return (
    <Fragment>
      {Object.values(featuresByType).map((featuresByType) => {
        const { color, title } = featuresByType[0] || {}
        return (
          <Fragment>
            <div className={styles.popupSection}>
              <Icon icon="encounters" className={styles.layerIcon} style={{ color }} />
              <div className={styles.popupSectionContent}>
                {<h3 className={styles.popupSectionTitle}>{title}</h3>}
                {featuresByType.map((feature, index) => {
                  const key = `${feature.title}-${index}`
                  return (
                    <SkylightEncounterTooltipRow
                      key={key}
                      feature={feature}
                      showFeaturesDetails={showFeaturesDetails}
                    />
                  )
                })}
              </div>
            </div>
          </Fragment>
        )
      })}
    </Fragment>
  )
}

export default RealTimeRow
