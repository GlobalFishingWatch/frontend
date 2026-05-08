import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getTrackBackground, Range } from 'react-range'
import { useSelector } from 'react-redux'
import { useAtomValue } from 'jotai'

import { deckToHexColor } from '@globalfishingwatch/deck-layers'
import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Button, Choice, Icon, IconButton, Popover } from '@globalfishingwatch/ui-components'

import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import {
  useAddDataviewFromDatasetToWorkspace,
  useDatasetsAPI,
} from 'features/datasets/datasets.hook'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { HOTSPOT_COLOR } from 'features/map/map.config'
import {
  getDrawDatasetDefinition,
  getFileWithFeatures,
} from 'features/map/overlays/draw/draw.utils'
import { KILOMETERS, NAUTICAL_MILES } from 'features/reports/report-area/area-reports.config'
import { selectReportAreaName } from 'features/reports/report-area/area-reports.selectors'
import { selectReportActivitySubCategory } from 'features/reports/reports.selectors'
import { hotspotGeometryAtom, useHotspotSettings } from 'features/reports/reports-hotspot.hooks'
import { formatArea } from 'features/reports/reports-hotspot.utils'

import { getReportSubCategoryLabel } from './reports-activity.config'

import styles from './ReportHotspotControls.module.css'

const AREA_CONFIG = { min: 1000, max: 500000, step: 1000 }

export default function ReportHotspotControls() {
  const { t } = useTranslation()
  const { enabled, area, unit, toggle, setArea, setUnit } = useHotspotSettings()
  const hotspotGeometry = useAtomValue(hotspotGeometryAtom)
  const { dispatchUpsertDataset } = useDatasetsAPI()
  const { addDataviewFromDatasetToWorkspace } = useAddDataviewFromDatasetToWorkspace()
  const areaName = useSelector(selectReportAreaName)
  const activitySubCategory = useSelector(selectReportActivitySubCategory)
  const timeRange = useSelector(selectTimeRange)
  const rangeRef = useRef<HTMLDivElement>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [values, setValues] = useState([area])
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (panelOpen) rangeRef.current?.querySelector<HTMLDivElement>('[role="slider"]')?.focus()
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

  const { min, max, step } = AREA_CONFIG

  const unitLabel = unit === NAUTICAL_MILES ? 'nm²' : 'km²'

  const datasetName = useMemo(
    () =>
      t((t) => t.analysis.hotspot.datasetName, {
        areaSize: formatArea(Math.round(values[0])),
        unit: unitLabel,
        activitySubCategory: getReportSubCategoryLabel(activitySubCategory, t),
        areaName: areaName || '',
        start: formatI18nDate(timeRange?.start),
        end: formatI18nDate(timeRange?.end),
      }),
    [activitySubCategory, areaName, t, timeRange?.end, timeRange?.start, unitLabel, values]
  )
  console.log('🚀 ~ ReportHotspotControls ~ datasetName:', datasetName)

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
            <label className={styles.sliderLabel}>{t((t) => t.common.area_one)}</label>
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
          <Range
            values={values}
            step={step}
            min={min}
            max={max}
            onChange={setValues}
            onFinalChange={(vals) => setArea(vals[0])}
            renderTrack={({ props, children }) => (
              <div
                ref={rangeRef}
                style={{ ...props.style, height: '36px', display: 'flex', width: '100%' }}
              >
                <div
                  ref={props.ref}
                  style={{
                    height: '2px',
                    width: '100%',
                    borderRadius: '2px',
                    background: getTrackBackground({
                      values,
                      colors: [deckToHexColor(HOTSPOT_COLOR), 'var(--color-terthiary-blue)'],
                      min,
                      max,
                    }),
                    alignSelf: 'center',
                  }}
                >
                  {children}
                </div>
              </div>
            )}
            renderThumb={({ props }) => {
              const { key, ...rest } = props
              return (
                <div
                  key={key}
                  {...rest}
                  style={{
                    ...props.style,
                    height: '30px',
                    width: '30px',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: deckToHexColor(HOTSPOT_COLOR),
                    boxShadow: '0px 2px 6px #AAA',
                  }}
                >
                  {formatArea(values[0])}
                </div>
              )
            }}
          />
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

          <Icon icon="target" type="default" />
        </Button>
      </div>
    </Popover>
  )
}
