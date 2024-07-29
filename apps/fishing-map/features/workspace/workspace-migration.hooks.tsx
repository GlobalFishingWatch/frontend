import { useSelector } from 'react-redux'
import { useCallback, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import parse from 'html-react-parser'
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
import { selectWorkspaceWithCurrentState } from 'features/app/selectors/app.workspace.selectors'
import { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'
import { useDataviewInstancesConnect } from './workspace.hook'
import styles from './Workspace.module.css'
import { selectIsWorkspaceOwner } from './workspace.selectors'
import { updatedCurrentWorkspaceThunk } from './workspace.slice'

export const useMigrateWorkspace = () => {
  const deprecatedDataviewInstances = useSelector(selectDeprecatedDataviewInstances)
  const urlDataviewInstances = useSelector(selectUrlDataviewInstances)
  const workspace = useSelector(selectWorkspaceWithCurrentState)
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
            config: {
              ...(urlDataviewInstance && { ...urlDataviewInstance.config }),
              ...(heatmapSelectedDatasets?.length && {
                datasets: heatmapSelectedDatasets,
              }),
            },
            dataviewId: latestDataviewId || dataviewInstance.dataviewId,
            datasetsConfigMigration,
          }
        }
      )
      await dispatch(fetchDatasetsByIdsThunk({ ids: Object.values(deprecatedDatasets) }))
      if (dataviewInstancesToMigrate.length) {
        upsertDataviewInstance(dataviewInstancesToMigrate)
      }
      const migratedWorkspace = {
        ...workspace,
        // This is needed to get the latest workspace state without waiting to resolve dataviewInstances
        dataviewInstances: workspace.dataviewInstances.map((dvi) => {
          const migratedDataviewInstance = dataviewInstancesToMigrate.find((d) => d.id === dvi.id)
          if (migratedDataviewInstance) {
            const { datasetsConfigMigration, ...rest } = migratedDataviewInstance
            return {
              ...dvi,
              ...rest,
              config: {
                ...dvi.config,
                ...rest?.config,
              },
              datasetsConfig: dvi.datasetsConfig?.map((dc) => {
                const datasetId = datasetsConfigMigration?.[dc?.datasetId!] || dc?.datasetId
                return { ...dc, datasetId }
              }),
            }
          }
          return dvi
        }),
      } as AppWorkspace
      return { migrated: true, error: '', workspace: migratedWorkspace }
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
    workspace,
  ])

  return migrateDataviewInstances
}

export const useMigrateWorkspaceToast = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const hasDeprecatedDataviews = useSelector(selectHasDeprecatedDataviewInstances)
  const isWorkspaceOwner = useSelector(selectIsWorkspaceOwner)
  const migrateWorkspace = useMigrateWorkspace()
  const toastId = useRef<any>()

  const closeToast = () => {
    toast.dismiss(toastId.current)
  }
  const dissmissToast = () => {
    closeToast()
  }

  const updateWorkspace = async () => {
    toast.update(toastId.current, {
      render: <ToastContent loading={true} />,
    })
    const { workspace } = await migrateWorkspace()
    if (workspace && isWorkspaceOwner) {
      await dispatch(updatedCurrentWorkspaceThunk(workspace))
    }
    closeToast()
  }

  const ToastContent = ({ loading = false }: { loading?: boolean }) => (
    <div className={styles.disclaimer}>
      <p>
        {t(
          'workspace.migrationDisclaimer',
          'Update your workspace to view the latest AIS data and features.'
        )}
      </p>
      <p className={styles.secondary}>
        {parse(
          t(
            'workspace.migrationDisclaimerNote',
            "Note, some vessel identity and activity information may change. <a target='_blank' href='https://globalfishingwatch.org/faqs/2024-aug-new-release-in-our-ais-data-pipeline-version-3'> Learn more.</a>"
          )
        )}
      </p>
      <div className={styles.disclaimerFooter}>
        <Button onClick={dissmissToast} type="secondary" className={styles.updateBtn}>
          {t('workspace.migrationMaintain', 'Skip')}
        </Button>
        <Button loading={loading} onClick={updateWorkspace} className={styles.updateBtn}>
          {t('workspace.migrationUpdate', 'Update')}
        </Button>
      </div>
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
