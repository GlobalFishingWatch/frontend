import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, Tooltip as RechartsTooltip, XAxis, YAxis, LabelList } from 'recharts'
import { Choice, ChoiceOption, Spinner, Tooltip } from '@globalfishingwatch/ui-components'
import { RegionType } from '@globalfishingwatch/api-types'
import {
  selectVesselEventTypes,
  selectEventsGroupedByArea,
} from 'features/vessel/activity/vessels-activity.selectors'
import { VesselAreaSubsection } from 'types'
import { selectVesselAreaSubsection } from 'features/vessel/vessel.config.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { selectVesselProfileDataview } from 'features/dataviews/dataviews.slice'
import { useRegionNamesByType } from 'features/regions/regions.hooks'
import { EVENTS_COLORS } from 'data/config'
import I18nNumber, { formatI18nNumber } from 'features/i18n/i18nNumber'
import {
  selectVesselEventsFilteredByTimerange,
  selectVesselEventsResourcesLoading,
} from 'features/vessel/vessel.selectors'
import VesselActivityFilter from 'features/vessel/activity/VesselActivityFilter'
import styles from './VesselAreas.module.css'

type VesselAreasProps = {
  updateAreaLayersVisibility: (id: string) => void
}

const AreaTick = ({ y, payload }: any) => {
  const { getRegionNamesByType } = useRegionNamesByType()
  const vesselArea = useSelector(selectVesselAreaSubsection)
  const areaLabel = getRegionNamesByType(vesselArea as RegionType, [payload.value])[0]
  return (
    <foreignObject x={0} y={y - 12} className={styles.areaContainer}>
      <Tooltip content={areaLabel?.length > 20 && areaLabel}>
        <span className={styles.area}>{areaLabel || payload.value}</span>
      </Tooltip>
    </foreignObject>
  )
}

const AreaTooltip = ({ payload }: any) => {
  const { t } = useTranslation()
  return (
    <div className={styles.tooltipContainer}>
      <ul>
        {payload.map(({ value, color, name }) => {
          return value !== 0 ? (
            <li key={name} className={styles.tooltipValue}>
              <span className={styles.tooltipValueDot} style={{ color }} />
              <I18nNumber number={value} />{' '}
              {t(`event.${name}`, { defaultValue: name, count: value })}
            </li>
          ) : null
        })}
      </ul>
    </div>
  )
}

const VesselAreas = ({ updateAreaLayersVisibility }: VesselAreasProps) => {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const events = useSelector(selectVesselEventsFilteredByTimerange)
  const vesselArea = useSelector(selectVesselAreaSubsection)
  const eventsGrouped = useSelector(selectEventsGroupedByArea)
  const eventsLoading = useSelector(selectVesselEventsResourcesLoading)
  const vesselDataview = useSelector(selectVesselProfileDataview)
  const eventTypes = useSelector(selectVesselEventTypes)
  const [graphWidth, setGraphWidth] = useState(window.innerWidth / 2 - 52 - 40)

  const areaOptions: ChoiceOption<VesselAreaSubsection>[] = useMemo(
    () => [
      {
        id: 'eez',
        label: t('layer.areas.eez', 'EEZ'),
      },
      {
        id: 'fao',
        label: t('layer.areas.fao', 'FAO'),
      },
      {
        id: 'rfmo',
        label: t('layer.areas.rfmo', 'RFMO'),
      },
      {
        id: 'mpa',
        label: t('layer.areas.mpa', 'MPA'),
      },
    ],
    [t]
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

  const changeVesselArea = useCallback(
    (option: ChoiceOption<VesselAreaSubsection>) => {
      dispatchQueryParams({ vesselArea: option.id })
      updateAreaLayersVisibility(option.id)
    },
    [dispatchQueryParams, updateAreaLayersVisibility]
  )

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
        <label className={styles.title}>{t('vessel.areasTitle', 'Areas with more events')}</label>
        <Choice
          options={areaOptions}
          size="small"
          activeOption={vesselArea}
          onSelect={changeVesselArea}
        />
        <VesselActivityFilter />
      </div>
      <div className={styles.areaList}>
        {eventsGrouped.length > 0 ? (
          <BarChart
            width={graphWidth}
            height={eventsGrouped.length * 40}
            layout="vertical"
            data={eventsGrouped}
            margin={{ right: 40 }}
          >
            <YAxis
              interval={0}
              axisLine={false}
              tickLine={false}
              type="category"
              dataKey="region"
              width={200}
              tick={<AreaTick />}
            />
            <XAxis type="number" hide />
            <RechartsTooltip content={<AreaTooltip />} />
            {eventTypes?.map((eventType, index) => (
              <Bar
                key={eventType}
                dataKey={eventType}
                barSize={15}
                stackId="a"
                fill={
                  eventType === 'fishing' ? vesselDataview?.config?.color : EVENTS_COLORS[eventType]
                }
              >
                {index === eventTypes.length - 1 && (
                  <LabelList
                    position="right"
                    valueAccessor={(entry) => formatI18nNumber(entry.total)}
                    className={styles.count}
                  />
                )}
              </Bar>
            ))}
          </BarChart>
        ) : events.length === 0 ? (
          <span className={styles.enptyState}>
            {t(
              'vessel.noEventsinTimeRange',
              'There are no events fully contained in your timerange.'
            )}
          </span>
        ) : (
          <span className={styles.enptyState}>
            {t('vessel.noEventsIn', {
              defaultValue: 'No event in your timerange happened in any {{regionType}}',
              regionType: t(`layer.areas.${vesselArea}`, vesselArea),
            })}
          </span>
        )}
      </div>
    </div>
  )
}

export default VesselAreas
