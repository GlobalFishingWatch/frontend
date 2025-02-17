import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import parse from 'html-react-parser'

import type { DatasetsMigration } from '@globalfishingwatch/api-types'
import { DataviewType } from '@globalfishingwatch/api-types'
import { Button } from '@globalfishingwatch/ui-components'

import { LEGACY_TO_LATEST_DATAVIEWS } from 'data/dataviews'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectWorkspaceWithCurrentState } from 'features/app/selectors/app.workspace.selectors'
import { fetchDatasetsByIdsThunk, selectDeprecatedDatasets } from 'features/datasets/datasets.slice'
import {
  selectDeprecatedDataviewInstances,
  selectHasDeprecatedDataviewInstances,
} from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectIsReportOwner } from 'features/reports/report-area/area-reports.selectors'
import { selectCurrentReport } from 'features/reports/reports.selectors'
import { updateReportThunk } from 'features/reports/reports.slice'
import { getWorkspaceReport } from 'features/reports/shared/new-report-modal/NewAreaReportModal'
import { selectVesselDatasetId } from 'features/vessel/vessel.config.selectors'
import { fetchVesselInfoThunk } from 'features/vessel/vessel.slice'
import type { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'
import { useLocationConnect } from 'routes/routes.hook'
import {
  selectIsAnyAreaReportLocation,
  selectIsAnyVesselLocation,
  selectUrlDataviewInstances,
  selectVesselId,
} from 'routes/routes.selectors'

import { useDataviewInstancesConnect } from './workspace.hook'
import { selectIsWorkspaceOwner } from './workspace.selectors'
import { updatedCurrentWorkspaceThunk } from './workspace.slice'

import styles from './Workspace.module.css'

export const useMigrateWorkspace = () => {
  const deprecatedDataviewInstances = useSelector(selectDeprecatedDataviewInstances)
  const urlDataviewInstances = useSelector(selectUrlDataviewInstances)
  const workspace = useSelector(selectWorkspaceWithCurrentState)
  const vesselDatasetId = useSelector(selectVesselDatasetId)
  const isAnyVesselLocation = useSelector(selectIsAnyVesselLocation)
  const vesselId = useSelector(selectVesselId)
  const { dispatchQueryParams } = useLocationConnect()
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

          const datasetsConfigMigration = (dataviewInstance.datasetsConfig || [])?.reduce(
            (acc, datasetConfig) => {
              const latestDatasetId = deprecatedDatasets[datasetConfig.datasetId!]
              if (latestDatasetId) {
                acc[datasetConfig.datasetId] = latestDatasetId
              }
              return acc
            },
            {} as DatasetsMigration
          )
          const vesselInfo = dataviewInstance.config?.info
          if (vesselInfo && deprecatedDatasets[vesselInfo]) {
            datasetsConfigMigration[vesselInfo] = deprecatedDatasets[vesselInfo]
          }
          const vesselTrack = dataviewInstance.config?.info
          if (vesselTrack && deprecatedDatasets[vesselTrack]) {
            datasetsConfigMigration[vesselTrack] = deprecatedDatasets[vesselTrack]
          }
          const vesselEvents = dataviewInstance.config?.events
          if (vesselEvents?.length) {
            vesselEvents.forEach((event) => {
              if (deprecatedDatasets[event]) {
                datasetsConfigMigration[event] = deprecatedDatasets[event]
              }
            })
          }
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
      if (isAnyVesselLocation && deprecatedDatasets[vesselDatasetId]) {
        const newVesselDatasetId = deprecatedDatasets[vesselDatasetId]
        setTimeout(() => {
          dispatchQueryParams({ vesselDatasetId: newVesselDatasetId })
          dispatch(fetchVesselInfoThunk({ vesselId, datasetId: newVesselDatasetId }))
        }, 100)
      }
      const migratedWorkspace = {
        ...workspace,
        // This is needed to get the latest workspace state without waiting to resolve dataviewInstances
        dataviewInstances: workspace.dataviewInstances.map((dvi) => {
          const migratedDataviewInstance = dataviewInstancesToMigrate.find((d) => d.id === dvi.id)
          if (migratedDataviewInstance) {
            const { datasetsConfigMigration, ...rest } = migratedDataviewInstance
            const vesselInfo = dvi.config?.info
            const vesselTrack = dvi.config?.track
            const vesselEvents = dvi.config?.events
            return {
              ...dvi,
              ...rest,
              config: {
                ...dvi.config,
                ...rest?.config,
                ...(vesselInfo && {
                  info: datasetsConfigMigration?.[vesselInfo] || vesselInfo,
                }),
                ...(vesselTrack && {
                  track: datasetsConfigMigration?.[vesselTrack] || vesselTrack,
                }),
                ...(vesselEvents && {
                  events: vesselEvents.map((d) => datasetsConfigMigration?.[d!] || d),
                }),
              },
              datasetsConfig: dvi.datasetsConfig?.map((dc) => {
                const datasetId = datasetsConfigMigration?.[dc?.datasetId] || dc?.datasetId
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
    dispatchQueryParams,
    isAnyVesselLocation,
    upsertDataviewInstance,
    urlDataviewInstances,
    vesselDatasetId,
    vesselId,
    workspace,
  ])

  return migrateDataviewInstances
}

export const useMigrateWorkspaceToast = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const hasDeprecatedDataviews = useSelector(selectHasDeprecatedDataviewInstances)
  const isWorkspaceOwner = useSelector(selectIsWorkspaceOwner)
  const report = useSelector(selectCurrentReport)
  const isReportOwner = useSelector(selectIsReportOwner)
  const isAnyAreaReportLocation = useSelector(selectIsAnyAreaReportLocation)
  const migrateWorkspace = useMigrateWorkspace()
  const toastId = useRef<any>(undefined)

  const closeToast = () => {
    toast.dismiss(toastId.current)
  }

  // const dissmissToast = () => {
  //   trackEvent({
  //     category: TrackCategory.WorkspaceManagement,
  //     action: 'Skip workspace migration',
  //   })
  //   closeToast()
  // }

  const updateWorkspace = async () => {
    trackEvent({
      category: TrackCategory.WorkspaceManagement,
      action: 'Migrate workspace',
    })
    toast.update(toastId.current, {
      render: <ToastContent loading={true} />,
    })
    const { workspace } = await migrateWorkspace()

    if (isAnyAreaReportLocation) {
      if (workspace && report && isReportOwner) {
        const workspaceReport = getWorkspaceReport(workspace)
        await dispatch(updateReportThunk({ ...report, workspace: workspaceReport }))
      }
    } else if (workspace && isWorkspaceOwner) {
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
        {/* <Button onClick={dissmissToast} type="secondary" className={styles.updateBtn}>
          {t('workspace.migrationMaintain', 'Skip')}
        </Button> */}
        <Button
          loading={loading}
          testId="migrate-workspace-btn"
          onClick={updateWorkspace}
          className={styles.updateBtn}
        >
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
      return () => {
        closeToast()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasDeprecatedDataviews])
}
