import { useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts'
import type { CartesianLayout } from 'recharts/types/util/types'

import { Spinner } from '@globalfishingwatch/ui-components'

import { EVENTS_COLORS } from 'data/config'
import { selectVisibleEvents } from 'features/app/selectors/app.selectors'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { selectEventsGroupedByEncounteredVessel } from 'features/vessel/activity/vessels-activity.selectors'
import RelatedVessel from 'features/vessel/related-vessels/RelatedVessel'
import { getSidebarContentWidth } from 'features/vessel/vessel.utils'

import { DEFAULT_VESSEL_IDENTITY_ID } from '../vessel.config'
import { useVesselProfileEventsLoading } from '../vessel-events.hooks'

import styles from './RelatedVessels.module.css'

const VesselTick = ({ y, index }: any) => {
  const encountersByVessel = useSelector(selectEventsGroupedByEncounteredVessel)
  const vessel = encountersByVessel[index]
  if (!vessel) return null
  return (
    <foreignObject x={0} y={y - 20} width="200" height="40" className={styles.vesselContainer}>
      <RelatedVessel
        vesselToResolve={{ ...vessel, datasetId: vessel.dataset || DEFAULT_VESSEL_IDENTITY_ID }}
      />
    </foreignObject>
  )
}

const RelatedEncounterVessels = () => {
  const { t } = useTranslation()
  const visibleEvents = useSelector(selectVisibleEvents)
  const encountersByVessel = useSelector(selectEventsGroupedByEncounteredVessel)
  const eventsLoading = useVesselProfileEventsLoading()
  const [graphWidth, setGraphWidth] = useState(getSidebarContentWidth())

  useEffect(() => {
    const resizeGraph = () => {
      setGraphWidth(getSidebarContentWidth())
    }
    window.addEventListener('resize', resizeGraph)
    return () => {
      window.removeEventListener('resize', resizeGraph)
    }
  }, [])

  // TODO: remove this hack if recharts fixes the 3.0.0 vertical layout bug
  const [layout, setLayout] = useState<CartesianLayout>('horizontal')
  useEffect(() => {
    setLayout(encountersByVessel?.length ? 'vertical' : 'horizontal')
  }, [encountersByVessel])

  if (eventsLoading) {
    return (
      <div className={styles.placeholder}>
        <Spinner />
      </div>
    )
  }

  return (
    <div className={styles.vesselsList}>
      {encountersByVessel && encountersByVessel.length > 0 ? (
        <BarChart
          width={graphWidth}
          height={encountersByVessel.length * 40}
          layout={layout}
          data={encountersByVessel}
          margin={{ right: 20 }}
        >
          <YAxis
            interval={0}
            axisLine={false}
            tickLine={false}
            type="category"
            dataKey="id"
            width={250}
            tick={<VesselTick />}
          />
          <XAxis type="number" hide />
          <Bar dataKey="encounters" barSize={15} fill={EVENTS_COLORS.encounter}>
            <LabelList
              position="right"
              valueAccessor={(entry: any) => formatI18nNumber(entry.encounters)}
              className={styles.count}
            />
          </Bar>
        </BarChart>
      ) : (
        <span className={styles.enptyState}>
          {visibleEvents === 'all' || visibleEvents.includes('encounter')
            ? t('vessel.noEncountersInTimeRange')
            : t('vessel.noEncountersVisible')}
        </span>
      )}
    </div>
  )
}

export default RelatedEncounterVessels
