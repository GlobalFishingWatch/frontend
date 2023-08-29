import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, XAxis, YAxis, LabelList } from 'recharts'
import { Choice, ChoiceOption, Spinner, Tooltip } from '@globalfishingwatch/ui-components'
import { Dataset } from '@globalfishingwatch/api-types'
import { selectEventsGroupedByEncounteredVessel } from 'features/vessel/activity/vessels-activity.selectors'
import { VesselRelatedSubsection } from 'types'
import { selectVesselRelatedSubsection } from 'features/vessel/vessel.config.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { EVENTS_COLORS } from 'data/config'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { formatInfoField } from 'utils/info'
import VesselLink from 'features/vessel/VesselLink'
import {
  selectVesselDataset,
  selectVesselEventsResourcesLoading,
} from 'features/vessel/vessel.selectors'
import styles from './RelatedVessels.module.css'

const VesselTick = ({ y, index }: any) => {
  const encountersByVessel = useSelector(selectEventsGroupedByEncounteredVessel)
  const vesselDataset = useSelector(selectVesselDataset) as Dataset
  const { id, name, flag } = encountersByVessel[index] as any
  const nameLabel = formatInfoField(name, 'name')
  const flagLabel = formatInfoField(flag, 'flag')
  const fullLabel = `${nameLabel} (${flagLabel})`
  return (
    <foreignObject x={0} y={y - 12} className={styles.vesselContainer}>
      <Tooltip content={fullLabel.length > 30 && fullLabel}>
        <span>
          <VesselLink vessel={{ id, dataset: vesselDataset }}>{nameLabel}</VesselLink> ({flagLabel})
        </span>
      </Tooltip>
    </foreignObject>
  )
}

const RelatedVessels = () => {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const encountersByVessel = useSelector(selectEventsGroupedByEncounteredVessel)
  const vesselRelatedSubsection = useSelector(selectVesselRelatedSubsection)
  const eventsLoading = useSelector(selectVesselEventsResourcesLoading)
  const [graphWidth, setGraphWidth] = useState(window.innerWidth / 2 - 52 - 40)

  const relatedOptions: ChoiceOption<VesselRelatedSubsection>[] = useMemo(
    () => [
      {
        id: 'encounters',
        label: t('event.encounter_other', 'Encounter events'),
      },
      {
        id: 'owner',
        label: t('vessel.owner', 'Owner'),
        tooltip: t('common.comingSoon', 'Coming soon'),
        tooltipPlacement: 'top',
        disabled: true,
      },
    ],
    [t]
  )

  const changeVesselRelatedSubsection = useCallback(
    (option: ChoiceOption<VesselRelatedSubsection>) => {
      dispatchQueryParams({ vesselRelated: option.id })
    },
    [dispatchQueryParams]
  )

  useEffect(() => {
    const resizeGraph = () => {
      setGraphWidth(window.innerWidth / 2 - 52 - 40)
    }
    window.addEventListener('resize', resizeGraph)
    return () => {
      window.removeEventListener('resize', resizeGraph)
    }
  }, [])

  if (eventsLoading) {
    return (
      <div className={styles.placeholder}>
        <Spinner />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <label className={styles.title}>{t('vessel.relatedVessels', 'Related vessels')}</label>
        <Choice
          options={relatedOptions}
          size="small"
          activeOption={vesselRelatedSubsection}
          onSelect={changeVesselRelatedSubsection}
        />
      </div>
      <div className={styles.vesselsList}>
        {vesselRelatedSubsection === 'encounters' && encountersByVessel?.length > 0 && (
          <BarChart
            width={graphWidth}
            height={encountersByVessel.length * 40}
            layout="vertical"
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
            <Bar
              dataKey="encounters"
              barSize={15}
              fill={EVENTS_COLORS.encounter}
              isAnimationActive={false}
            >
              <LabelList
                position="right"
                valueAccessor={(entry) => formatI18nNumber(entry.encounters)}
                className={styles.count}
              />
            </Bar>
          </BarChart>
        )}
        {vesselRelatedSubsection === 'encounters' &&
          (!encountersByVessel || encountersByVessel.length === 0) && (
            <span className={styles.enptyState}>
              {t(
                'vessel.noEncountersInTimeRange',
                'There are no encounters fully contained in your timerange.'
              )}
            </span>
          )}
      </div>
    </div>
  )
}

export default RelatedVessels
