import { useSelector } from 'react-redux'
import { useCallback, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { DatasetsMigration, DataviewType } from '@globalfishingwatch/api-types'
import { Button } from '@globalfishingwatch/ui-components'
import {
  selectDeprecatedDataviewInstances,
  selectHasDeprecatedDataviewInstances,
} from 'features/dataviews/selectors/dataviews.instances.selectors'
import { LEGACY_TO_LATEST_DATAVIEWS } from 'data/dataviews'
import { fetchDatasetsByIdsThunk, selectDeprecatedDatasets } from 'features/datasets/datasets.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectUrlDataviewInstances } from 'routes/routes.selectors'
import { useDataviewInstancesConnect } from './workspace.hook'
import styles from './Workspace.module.css'

export const useMigrateWorkspace = () => {
  const deprecatedDataviewInstances = useSelector(selectDeprecatedDataviewInstances)
  const urlDataviewInstances = useSelector(selectUrlDataviewInstances)
  const deprecatedDatasets = useSelector(selectDeprecatedDatasets)
  const dispatch = useAppDispatch()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const migrateDataviewInstances = useCallback(async () => {
    try {
      const dataviewInstancesToMigrate = (deprecatedDataviewInstances || []).flatMap(
        (dataviewInstance) => {
          const latestDataviewId = LEGACY_TO_LATEST_DATAVIEWS[dataviewInstance.dataviewId!]
          const heatmapSelectedDatasets =
            dataviewInstance.config?.type === DataviewType.HeatmapAnimated &&
            dataviewInstance.config?.datasets
              ? dataviewInstance.config?.datasets?.map((d) => deprecatedDatasets[d] || d)
              : []

          const datasetsConfigMigration = dataviewInstance.datasetsConfig?.reduce(
            (acc, datasetConfig) => {
              const latestDatasetId = deprecatedDatasets[datasetConfig.datasetId!]
              if (latestDatasetId) {
                acc[datasetConfig.datasetId] = latestDatasetId
              }
              return acc
            },
            {} as DatasetsMigration
          )
          const urlDataviewInstance = urlDataviewInstances?.find(
            (dvi) => dvi.id === dataviewInstance.id
          )
          return {
            id: dataviewInstance.id,
            ...(heatmapSelectedDatasets?.length && {
              config: {
                ...(urlDataviewInstance && { ...urlDataviewInstance.config }),
                datasets: heatmapSelectedDatasets,
              },
            }),
            dataviewId: latestDataviewId || dataviewInstance.dataviewId,
            datasetsConfigMigration,
          }
        }
      )
      await dispatch(fetchDatasetsByIdsThunk({ ids: Object.values(deprecatedDatasets) }))
      if (dataviewInstancesToMigrate.length) {
        upsertDataviewInstance(dataviewInstancesToMigrate)
      }
      return { migrated: true, error: '' }
    } catch (e: any) {
      console.error('Error migrating workspace', e)
      return { migrated: false, error: e.message }
    }
  }, [
    deprecatedDatasets,
    deprecatedDataviewInstances,
    dispatch,
    upsertDataviewInstance,
    urlDataviewInstances,
  ])

  return migrateDataviewInstances
}

export const useMigrateWorkspaceToast = () => {
  const { t } = useTranslation()
  const hasDeprecatedDataviews = useSelector(selectHasDeprecatedDataviewInstances)
  const migrateWorkspace = useMigrateWorkspace()
  const toastId = useRef<any>()

  const closeToast = () => {
    toast.dismiss(toastId.current)
  }
  const dissmissToast = () => {
    // TODO:deck decide if store the dismiss on the localStorage
    closeToast()
  }

  const updateWorkspace = async () => {
    toast.update(toastId.current, {
      render: <ToastContent loading={true} />,
    })
    const { migrated, error } = await migrateWorkspace()
    toast.update(toastId.current, {
      render: <ToastContent loading={false} done={migrated} error={error} />,
    })
    closeToast()
  }

  const ToastContent = ({
    loading = false,
    done = false,
    error = '',
  }: {
    loading?: boolean
    done?: boolean
    error?: string
  }) => (
    <div>
      {error
        ? error
        : t(
            'workspace.deprecatedDatasets',
            'Some of the datasets in this workspace are deprecated'
          )}
      <Button onClick={dissmissToast} type="secondary" className={styles.updateBtn}>
        {t('common.dismiss', 'Dismiss')}
      </Button>
      <Button loading={loading} onClick={updateWorkspace} className={styles.updateBtn}>
        {done ? t('common.done', 'Done') : t('common.update', 'Update')}
      </Button>
    </div>
  )

  useEffect(() => {
    if (hasDeprecatedDataviews) {
      toastId.current = toast(<ToastContent loading={false} />, {
        toastId: 'migrateWorkspace',
        autoClose: false,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasDeprecatedDataviews])
}
