import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useCallback, useMemo } from 'react'
import { uniqBy } from 'lodash'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  LabelList,
} from 'recharts'
import { Choice, ChoiceOption, Spinner, Tooltip } from '@globalfishingwatch/ui-components'
import { RegionType } from '@globalfishingwatch/api-types'
import {
  selectEventsGroupedByArea,
  selectVesselEventsLoading,
} from 'features/vessel/activity/vessels-activity.selectors'
import { selectVisibleEvents } from 'features/app/app.selectors'
import { VesselAreaSubsection } from 'types'
import { selectVesselAreaSubsection } from 'features/vessel/vessel.config.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { getEventsDatasetsInDataview } from 'features/datasets/datasets.utils'
import { selectVesselProfileDataview } from 'features/dataviews/dataviews.slice'
import { useRegionNamesByType } from 'features/regions/regions.hooks'
import { EVENTS_COLORS } from 'data/config'
import I18nNumber, { formatI18nNumber } from 'features/i18n/i18nNumber'
import styles from './VesselAreas.module.css'

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

const VesselAreas = () => {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const vesselArea = useSelector(selectVesselAreaSubsection)
  const visibleEvents = useSelector(selectVisibleEvents)
  const eventsGrouped = useSelector(selectEventsGroupedByArea)
  const eventsLoading = useSelector(selectVesselEventsLoading)
  const vesselDataview = useSelector(selectVesselProfileDataview)
  const eventDatasets =
    vesselDataview && uniqBy(getEventsDatasetsInDataview(vesselDataview), 'subcategory')

  const eventTypes = useMemo(
    () =>
      visibleEvents === 'all' || visibleEvents === 'none'
        ? eventDatasets?.map(({ subcategory }) => subcategory)
        : visibleEvents,
    [eventDatasets, visibleEvents]
  )

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

  const changeVesselArea = useCallback(
    (option: ChoiceOption<VesselAreaSubsection>) => {
      dispatchQueryParams({ vesselArea: option.id })
    },
    [dispatchQueryParams]
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
      </div>
      <div className={styles.areaList}>
        <div style={{ height: eventsGrouped.length * 40 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={eventsGrouped} margin={{ right: 20 }}>
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
              {eventTypes?.map(
                (eventType, index) =>
                  eventType && (
                    <Bar
                      key={eventType}
                      dataKey={eventType}
                      barSize={15}
                      stackId="a"
                      fill={
                        eventType === 'fishing'
                          ? vesselDataview?.config?.color
                          : EVENTS_COLORS[eventType]
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
                  )
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default VesselAreas
