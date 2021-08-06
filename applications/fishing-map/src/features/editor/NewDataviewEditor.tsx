import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  ApiAppName,
  Dataview,
  DataviewCategory,
  EndpointId,
} from '@globalfishingwatch/api-types/dist'
import Button from '@globalfishingwatch/ui-components/dist/button'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import Select from '@globalfishingwatch/ui-components/dist/select'
import MultiSelect from '@globalfishingwatch/ui-components/dist/multi-select'
import {
  GeneratorType,
  COLOR_RAMP_DEFAULT_NUM_STEPS,
} from '@globalfishingwatch/layer-composer/dist/generators'
import ColorBar, { FillColorBarOptions } from '@globalfishingwatch/ui-components/dist/color-bar'
import { fetchAllDatasetsThunk, selectDatasetsStatus } from 'features/datasets/datasets.slice'
import { createDataviewThunk, updateDataviewThunk } from 'features/dataviews/dataviews.slice'
import { selectFourwingsDatasets } from 'features/datasets/datasets.selectors'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useAppDispatch } from 'features/app/app.hooks'
import { AsyncError, AsyncReducerStatus } from 'utils/async-slice'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { APP_NAME } from 'data/config'
import styles from './EditorMenu.module.css'
import { getDataviewInstanceFromDataview } from './editor.utils'
import useEditorMenu from './editor.hooks'

const UNKNOWN_CATEGORY = 'unknown' as DataviewCategory

type NewDataviewEditorProps = {
  editDataview?: Dataview
  onCancelClick: () => void
}

const NewDataviewEditor = ({ editDataview, onCancelClick }: NewDataviewEditorProps) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [dataview, setDataview] = useState<Partial<Dataview>>(editDataview || ({} as Dataview))
  const [error, setError] = useState<string>()
  const [dataviewDatasets, setDataviewDatasets] = useState<{ id: string; label: string }[]>([])
  const datasets = useSelector(selectFourwingsDatasets)
  const datasetsStatus = useSelector(selectDatasetsStatus)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const { addNewDataviewInstances } = useDataviewInstancesConnect()
  const { dispatchToggleEditorMenu } = useEditorMenu()

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

  const categoryOptions = [
    { id: DataviewCategory.Environment, label: 'Environment' },
    { id: DataviewCategory.Fishing, label: 'Fishing' },
    { id: DataviewCategory.Presence, label: 'Presence' },
    { id: UNKNOWN_CATEGORY, label: 'Unknown' },
  ]

  useEffect(() => {
    if (!isEditingDataview) {
      dispatch(fetchAllDatasetsThunk())
    }
  }, [dispatch, isEditingDataview])

  const onDataviewPropertyChange = (property: Partial<Dataview>) => {
    setDataview((dataview) => ({ ...dataview, ...property }))
  }

  const onSaveClick = async () => {
    const dataviewDatasetsIds = dataviewDatasets.map(({ id }) => id)
    const newDataview = {
      ...dataview,
      app: APP_NAME as ApiAppName,
      config: {
        ...dataview.config,
        type: GeneratorType.HeatmapAnimated,
        ...(dataview.category !== DataviewCategory.Environment && {
          datasets: dataviewDatasetsIds,
        }),
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
    if (createDataviewThunk.fulfilled.match(action)) {
      if (!isEditingDataview) {
        const dataviewInstance = getDataviewInstanceFromDataview(action.payload as Dataview)
        addNewDataviewInstances([dataviewInstance])
      }
      dispatchToggleEditorMenu()
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
    dataview.description !== undefined &&
    dataview.category !== undefined &&
    dataview.category !== UNKNOWN_CATEGORY &&
    dataview.config !== undefined &&
    (isEditingDataview || dataviewDatasets.length > 0)

  return (
    <div className={styles.container}>
      <InputText
        inputSize="small"
        value={dataview.name}
        label={t('common.name', 'Name')}
        className={styles.input}
        onChange={(e) => onDataviewPropertyChange({ name: e.target.value })}
      />
      <InputText
        inputSize="small"
        value={dataview.description}
        label={t('common.description', 'Description')}
        className={styles.input}
        onChange={(e) => onDataviewPropertyChange({ description: e.target.value })}
      />
      <Select
        label={t('common.category', 'Category')}
        placeholder={t('selects.placeholder', 'Select an option')}
        options={categoryOptions}
        className={styles.input}
        selectedOption={categoryOptions.find(({ id }) => id === dataview.category)}
        onSelect={(selected) => {
          onDataviewPropertyChange({ category: selected.id })
        }}
        onRemove={() => {
          onDataviewPropertyChange({ category: undefined })
        }}
      />
      {!isEditingDataview && (
        <MultiSelect
          label={t('dataset.title_plural', 'Datasets')}
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
      <div className={styles.input}>
        <label>Color</label>
        <ColorBar
          colorBarOptions={FillColorBarOptions}
          selectedColor={dataview.config?.color}
          onColorClick={(color) => {
            onDataviewPropertyChange({ config: { color: color.value, colorRamp: color.id } })
          }}
        />
      </div>
      {dataview.category === DataviewCategory.Environment &&
        (isEditingDataview || dataviewDatasets.length > 0) && (
          <Fragment>
            <label>Breaks</label>
            <div className={styles.rangeContainer}>
              {[...new Array(COLOR_RAMP_DEFAULT_NUM_STEPS)].map((_, i) => (
                <InputText
                  inputSize="small"
                  type="number"
                  step="0.1"
                  key={i}
                  value={dataview.config?.breaks?.[i]}
                  className={styles.stepInput}
                  onChange={(e) => {
                    const breaks = dataview.config?.breaks
                      ? [...dataview.config.breaks]
                      : [...new Array(COLOR_RAMP_DEFAULT_NUM_STEPS).fill(0)]
                    breaks[i] = parseFloat(e.target.value)
                    onDataviewPropertyChange({
                      config: {
                        ...dataview.config,
                        breaks,
                      },
                    })
                  }}
                />
              ))}
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

export default NewDataviewEditor
