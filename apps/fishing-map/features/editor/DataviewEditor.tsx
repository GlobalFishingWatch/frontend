import { Fragment, type JSX,useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { ApiAppName, Dataview, DataviewConfig } from '@globalfishingwatch/api-types'
import { DataviewCategory, DataviewType, EndpointId } from '@globalfishingwatch/api-types'
import { COLOR_RAMP_DEFAULT_NUM_STEPS } from '@globalfishingwatch/deck-layers'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import {
  Button,
  Choice,
  ColorBar,
  FillColorBarOptions,
  InputText,
  MultiSelect,
  Select,
  Spinner,
} from '@globalfishingwatch/ui-components'

import { APP_NAME } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectFourwingsDatasets } from 'features/datasets/datasets.selectors'
import { fetchAllDatasetsThunk, selectDatasetsStatus } from 'features/datasets/datasets.slice'
import { createDataviewThunk, updateDataviewThunk } from 'features/dataviews/dataviews.slice'
import { getDataviewInstanceFromDataview } from 'features/dataviews/dataviews.utils'
import { toggleEditorMenu } from 'features/editor/editor.slice'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import type { AsyncError } from 'utils/async-slice'
import { AsyncReducerStatus } from 'utils/async-slice'

import styles from './EditorMenu.module.css'

const UNKNOWN_CATEGORY = 'unknown' as DataviewCategory

const categoryOptions = [
  { id: DataviewCategory.Environment, label: 'Environment' },
  { id: DataviewCategory.Activity, label: 'Activity' },
  { id: DataviewCategory.Detections, label: 'Detections' },
  { id: UNKNOWN_CATEGORY, label: 'Unknown' },
]

const dynamicHeatmapOption: ChoiceOption = { id: 'dynamic', label: 'Dynamic' }
const staticHeatmapOption: ChoiceOption = { id: 'static', label: 'Static' }
const heatmapTypesOptions = [dynamicHeatmapOption, staticHeatmapOption]

type temporalResolutionOption = { id: FourwingsInterval; label: string }
const temporalResolutionOptions: temporalResolutionOption[] = [
  { id: 'MONTH', label: 'Month' },
  { id: 'DAY', label: 'Day' },
  { id: 'HOUR', label: 'Hour' },
]

type DataviewEditorProps = {
  editDataview?: Dataview
  onCancelClick: () => void
}

const DataviewEditor = ({ editDataview, onCancelClick }: DataviewEditorProps) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [dataview, setDataview] = useState<Partial<Dataview>>(editDataview || ({} as Dataview))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [dataviewDatasets, setDataviewDatasets] = useState<
    { id: string; label: string | JSX.Element }[]
  >([])
  const datasets = useSelector(selectFourwingsDatasets)
  const datasetsStatus = useSelector(selectDatasetsStatus)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const { addNewDataviewInstances } = useDataviewInstancesConnect()

  const isEditingDataview = editDataview !== undefined

  const datasetsOptions = useMemo(() => {
    const filteredDatasets = (datasets || []).filter((dataset) => {
      if (!dataset.configuration || !Object.keys(dataset.configuration).length) return false
      if (dataview.category === UNKNOWN_CATEGORY) {
        return !dataset.category || !Object.keys(dataset.category).length
      }
      return dataview.category === dataset.category
    })
    return filteredDatasets.map((dataset) => ({ id: dataset.id, label: dataset.id }))
  }, [dataview.category, datasets])

  useEffect(() => {
    if (!isEditingDataview) {
      dispatch(fetchAllDatasetsThunk({ onlyUserDatasets: false }))
    }
  }, [dispatch, isEditingDataview])

  const onDataviewPropertyChange = (property: Partial<Dataview>) => {
    setDataview((dataview) => ({ ...dataview, ...property }))
  }

  const onDataviewConfigChange = (config: Partial<DataviewConfig>) => {
    setDataview((dataview) => ({
      ...dataview,
      config: { ...dataview.config, ...config },
    }))
  }

  const onSaveClick = async () => {
    setLoading(true)
    const dataviewDatasetsIds = dataviewDatasets.map(({ id }) => id)
    const newDataview = {
      ...dataview,
      description: '',
      app: APP_NAME as ApiAppName,
      config: {
        ...dataview.config,
        type: dataview.config?.static ? DataviewType.Heatmap : DataviewType.HeatmapAnimated,
        ...(dataview.category !== DataviewCategory.Environment && {
          datasets: dataviewDatasetsIds,
        }),
        ...(dataview.config?.breaks?.length && { breaks: dataview.config.breaks }),
      },
      datasetsConfig: isEditingDataview
        ? dataview.datasetsConfig
        : dataviewDatasetsIds.map((datasetId) => {
            return {
              params: [
                {
                  id: 'type',
                  value: 'heatmap',
                },
              ],
              endpoint: EndpointId.FourwingsTiles,
              datasetId,
            }
          }),
    }
    let action
    if (isEditingDataview) {
      action = await dispatch(updateDataviewThunk(newDataview))
    } else {
      action = await dispatch(createDataviewThunk(newDataview))
    }
    setLoading(false)
    if (
      updateDataviewThunk.fulfilled.match(action) ||
      createDataviewThunk.fulfilled.match(action)
    ) {
      if (!isEditingDataview) {
        const dataviewInstance = getDataviewInstanceFromDataview(action.payload as Dataview)
        addNewDataviewInstances([dataviewInstance])
      }
      dispatch(toggleEditorMenu())
    } else {
      setError((action.payload as AsyncError).message)
    }
  }

  if (
    datasetsStatus === AsyncReducerStatus.Idle ||
    datasetsStatus === AsyncReducerStatus.Loading ||
    workspaceStatus === AsyncReducerStatus.Loading
  ) {
    return <Spinner className={styles.loading} />
  }

  const validDataview =
    dataview.name !== undefined &&
    dataview.category !== undefined &&
    dataview.category !== UNKNOWN_CATEGORY &&
    dataview.config?.color !== undefined &&
    (dataview.category !== DataviewCategory.Environment ||
      (dataview.config.breaks && dataview.config.breaks?.length > 0)) &&
    (isEditingDataview || dataviewDatasets.length > 0)

  return (
    <div className={styles.container}>
      <InputText
        value={dataview.name}
        label={`${t('common.name', 'Name')} *`}
        className={styles.input}
        onChange={(e) => onDataviewPropertyChange({ name: e.target.value })}
      />
      <Select
        label={`${t('common.category', 'Category')} *`}
        placeholder={t('selects.placeholder', 'Select an option')}
        options={categoryOptions}
        className={styles.input}
        selectedOption={categoryOptions.find(({ id }) => id === dataview.category)}
        onSelect={(selected) => {
          setDataviewDatasets([])
          onDataviewPropertyChange({ category: selected.id })
          let breaks: number[] = []
          if (selected.id === DataviewCategory.Environment) {
            breaks = [...new Array(COLOR_RAMP_DEFAULT_NUM_STEPS)].map(
              (_, i) => i / COLOR_RAMP_DEFAULT_NUM_STEPS
            )
          }
          onDataviewConfigChange({ breaks })
        }}
        onRemove={() => {
          setDataviewDatasets([])
          onDataviewPropertyChange({ category: undefined })
          onDataviewConfigChange({ breaks: [] })
        }}
      />
      {!isEditingDataview && (
        <MultiSelect
          label={`${t('dataset.title_other', 'Datasets')} *`}
          placeholder={
            dataviewDatasets.length > 0
              ? dataviewDatasets.map(({ id }) => id).join(', ')
              : t('selects.placeholder', 'Select an option')
          }
          options={datasetsOptions}
          selectedOptions={dataviewDatasets}
          className={styles.input}
          onSelect={(filter) => {
            setDataviewDatasets([...(dataviewDatasets || []), filter])
          }}
          onRemove={(filter, rest) => {
            setDataviewDatasets(rest)
          }}
          onCleanClick={() => {
            setDataviewDatasets([])
          }}
        />
      )}
      <div className={styles.row}>
        <div className={styles.input2Columns}>
          <label>Color *</label>
          <ColorBar
            colorBarOptions={FillColorBarOptions}
            selectedColor={dataview.config?.color}
            onColorClick={(color) => {
              onDataviewConfigChange({
                color: color.value,
                colorRamp: color.id,
              })
            }}
          />
        </div>
        <div className={styles.input2Columns}>
          <label>Max zoom level *</label>
          <InputText
            type="number"
            step="1"
            defaultValue={8}
            value={dataview.config?.maxZoom}
            onChange={(e) => {
              onDataviewConfigChange({ maxZoom: parseInt(e.target.value) })
            }}
          />
        </div>
      </div>
      {dataview.category === DataviewCategory.Environment &&
        (isEditingDataview || dataviewDatasets.length > 0) && (
          <Fragment>
            <div className={styles.row}>
              <div className={styles.rowContent}>
                <label>Breaks *</label>
                <div className={styles.rangeContainer}>
                  {[...new Array(COLOR_RAMP_DEFAULT_NUM_STEPS)].map((_, i) => (
                    <InputText
                      type="number"
                      step="0.1"
                      key={i}
                      placeholder={(i / COLOR_RAMP_DEFAULT_NUM_STEPS).toString()}
                      value={dataview.config?.breaks?.[i]}
                      className={styles.stepInput}
                      onChange={(e) => {
                        const breaks = dataview.config?.breaks
                          ? [...dataview.config.breaks]
                          : [...new Array(COLOR_RAMP_DEFAULT_NUM_STEPS).fill(0)]
                        breaks[i] = parseFloat(e.target.value)
                        onDataviewConfigChange({ breaks })
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.input2Columns}>
                <label>Heatmap type</label>
                <Choice
                  options={heatmapTypesOptions}
                  activeOption={
                    dataview.config?.static ? staticHeatmapOption.id : dynamicHeatmapOption.id
                  }
                  onSelect={(option) => {
                    onDataviewConfigChange({ static: option.id === staticHeatmapOption.id })
                  }}
                  size="small"
                />
              </div>
              {!dataview.config?.static && (
                <Select
                  label="Temporal resolution"
                  placeholder={t('selects.placeholder', 'Select an option')}
                  options={temporalResolutionOptions}
                  containerClassName={styles.input2Columns}
                  direction="top"
                  selectedOption={temporalResolutionOptions.find(({ id }) =>
                    dataview.config?.intervals?.includes(id)
                  )}
                  onSelect={(selected) => {
                    onDataviewConfigChange({ interval: selected.id })
                  }}
                  onRemove={() => {
                    onDataviewConfigChange({ interval: undefined })
                  }}
                />
              )}
            </div>
          </Fragment>
        )}
      <div className={styles.footer}>
        <p className={styles.error}>
          {dataview.category === UNKNOWN_CATEGORY && dataviewDatasets.length > 0 && (
            <span>Contact the dataset creator to assing a category</span>
          )}
          {error && <span>{error}</span>}
        </p>
        <div>
          <Button className={styles.cancelButton} type="secondary" onClick={onCancelClick}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button
            loading={loading}
            disabled={!validDataview || error !== undefined}
            tooltip={validDataview ? '' : 'Complete all fields'}
            tooltipPlacement="top"
            onClick={onSaveClick}
          >
            {t('common.save', 'Save')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DataviewEditor
