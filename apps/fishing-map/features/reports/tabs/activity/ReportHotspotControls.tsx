import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Slider, SliderThumb, SliderTrack } from 'react-aria-components/Slider'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { area as turfArea } from '@turf/turf'
import { useAtomValue } from 'jotai'

import { deckToHexColor } from '@globalfishingwatch/deck-layers'
import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import {
  Button,
  Choice,
  getSliderTrackBackground,
  Icon,
  IconButton,
  Popover,
} from '@globalfishingwatch/ui-components'

import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import {
  useAddDataviewFromDatasetToWorkspace,
  useDatasetsAPI,
} from 'features/datasets/datasets.hook'
import { formatI18nDate } from 'features/i18n/i18nDate.utils'
import { HOTSPOT_COLOR } from 'features/map/map.config'
import {
  getDrawDatasetDefinition,
  getFileWithFeatures,
} from 'features/map/overlays/draw/draw.utils'
import { KILOMETERS, NAUTICAL_MILES } from 'features/reports/report-area/area-reports.config'
import { selectReportArea } from 'features/reports/report-area/area-reports.selectors'
import { selectReportActivitySubCategory } from 'features/reports/reports.selectors'
import { hotspotGeometryAtom, useHotspotSettings } from 'features/reports/reports-hotspot.hooks'
import { formatArea, NM2_TO_KM2 } from 'features/reports/reports-hotspot.utils'

import { getReportSubCategoryLabel } from './reports-activity.utils'

import styles from './ReportHotspotControls.module.css'

export default function ReportHotspotControls() {
  const { t } = useTranslation()
  const { enabled, area, unit, toggle, setArea, setUnit } = useHotspotSettings()
  const hotspotGeometry = useAtomValue(hotspotGeometryAtom)
  const { dispatchUpsertDataset } = useDatasetsAPI()
  const { addDataviewFromDatasetToWorkspace } = useAddDataviewFromDatasetToWorkspace()
  const reportArea = useSelector(selectReportArea)
  const activitySubCategory = useSelector(selectReportActivitySubCategory)
  const timeRange = useSelector(selectTimeRange)
  const rangeRef = useRef<HTMLDivElement>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [values, setValues] = useState([area])
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (panelOpen) rangeRef.current?.querySelector<HTMLInputElement>('input')?.focus()
  }, [panelOpen])

  const unitOptions = useMemo<ChoiceOption<string>[]>(
    () => [
      { id: KILOMETERS, label: `${t((t) => t.analysis.kilometers)}²` },
      { id: NAUTICAL_MILES, label: `${t((t) => t.analysis.nauticalmiles)}²` },
    ],
    [t]
  )

  const handleUnitChange = useCallback(
    (option: ChoiceOption<string>) => {
      setUnit(option.id as typeof KILOMETERS | typeof NAUTICAL_MILES)
    },
    [setUnit]
  )

  const { min, max, step } = useMemo(() => {
    const geometry = reportArea?.geometry
    if (!geometry) return { min: 1000, max: 500000, step: 1000 }
    const m2 = turfArea(geometry)
    const km2 = m2 / 1_000_000
    const totalArea = unit === NAUTICAL_MILES ? km2 / NM2_TO_KM2 : km2
    const step = Math.max(1, Math.pow(10, Math.floor(Math.log10(totalArea / 100))))
    const onePercent = Math.max(step, Math.ceil((totalArea * 0.01) / step) * step)
    const eightyPercent = Math.max(onePercent + step, Math.floor((totalArea * 0.8) / step) * step)
    return { min: onePercent, max: eightyPercent, step }
  }, [reportArea?.geometry, unit])

  const unitLabel = unit === NAUTICAL_MILES ? 'nm²' : 'km²'
  const displayValues = [Math.min(max, Math.max(min, values[0]))]

  const datasetName = useMemo(
    () =>
      t((t) => t.analysis.hotspot.datasetName, {
        areaSize: formatArea(Math.round(values[0])),
        unit: unitLabel,
        activitySubCategory: getReportSubCategoryLabel(activitySubCategory),
        areaName: reportArea?.name || '',
        start: formatI18nDate(timeRange?.start),
        end: formatI18nDate(timeRange?.end),
      }),
    [activitySubCategory, reportArea?.name, t, timeRange?.end, timeRange?.start, unitLabel, values]
  )

  const handleSave = useCallback(async () => {
    if (!hotspotGeometry) return
    setSaving(true)
    setSaveError('')
    const { payload, error } = await dispatchUpsertDataset({
      dataset: getDrawDatasetDefinition(datasetName, 'polygons'),
      file: getFileWithFeatures(datasetName, [hotspotGeometry]),
      createAsPublic: false,
    })
    if (error) {
      setSaveError(t((t) => t.errors.generic))
    } else if (payload) {
      addDataviewFromDatasetToWorkspace(payload)
      setPanelOpen(false)
    }
    setSaving(false)
  }, [hotspotGeometry, datasetName, dispatchUpsertDataset, addDataviewFromDatasetToWorkspace, t])

  const handleRemove = () => {
    toggle(false)
    setPanelOpen(false)
  }

  const togglePanelOpen = () => {
    if (!enabled) {
      toggle(true)
    }
    setPanelOpen((open) => !open)
  }

  const handleClickOutside = () => setPanelOpen(false)

  return (
    <Popover
      open={panelOpen}
      onClickOutside={handleClickOutside}
      placement="bottom"
      className={styles.popover}
      content={
        <div className={styles.popoverContent}>
          <div className={styles.popoverHeader}>
            <label className={styles.sliderLabel}>{t((t) => t.common.area, { count: 1 })}</label>
            {enabled && (
              <div className={styles.headerButtons}>
                <IconButton
                  icon={saveError ? 'warning' : 'save'}
                  size="small"
                  loading={saving}
                  disabled={!hotspotGeometry}
                  tooltip={
                    saveError ||
                    (!hotspotGeometry ? t((t) => t.common.loading) : t((t) => t.common.save))
                  }
                  onClick={handleSave}
                />
                <IconButton icon="delete" size="small" type="warning" onClick={handleRemove} />
              </div>
            )}
          </div>
          <Choice
            size="small"
            activeOption={unit}
            onSelect={handleUnitChange}
            options={unitOptions}
          />
          <div ref={rangeRef} style={{ height: '36px', display: 'flex', width: '100%' }}>
            <Slider
              aria-label={t((t) => t.common.area, { count: 1 })}
              value={displayValues}
              step={step}
              minValue={min}
              maxValue={max}
              onChange={(vals) => setValues(Array.isArray(vals) ? vals : [vals])}
              onChangeEnd={(vals) => setArea(Array.isArray(vals) ? vals[0] : vals)}
              style={{ width: '100%', alignSelf: 'center' }}
            >
              <SliderTrack
                style={{
                  position: 'relative',
                  height: '2px',
                  width: '100%',
                  borderRadius: '2px',
                  background: getSliderTrackBackground({
                    values: displayValues,
                    colors: [deckToHexColor(HOTSPOT_COLOR), 'var(--color-terthiary-blue)'],
                    min,
                    max,
                  }),
                }}
              >
                <SliderThumb index={0} className={styles.thumb}>
                  {formatArea(displayValues[0])}
                </SliderThumb>
              </SliderTrack>
            </Slider>
          </div>
        </div>
      }
    >
      <div>
        <Button
          onClick={togglePanelOpen}
          type="border-secondary"
          size="default"
          className={styles.actionButton}
        >
          {t((t) => t.analysis.hotspot.title)}

          <Icon
            icon="target"
            type="default"
            style={{ color: enabled ? deckToHexColor(HOTSPOT_COLOR) : undefined }}
          />
        </Button>
      </div>
    </Popover>
  )
}
