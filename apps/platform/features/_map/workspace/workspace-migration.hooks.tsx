import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useRouter } from '@tanstack/react-router'
import { uniqBy } from 'es-toolkit'

import type { DataviewInstance } from '@globalfishingwatch/api-types'
import { LEGACY_DATASETS_TO_LATEST_VMS } from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { Button, IconButton } from '@globalfishingwatch/ui-components'
import { ROUTE_PATHS } from '@platform/config/routes'

import { selectDeprecatedDatasets } from 'features/_map/datasets/datasets.slice'
import {
  MIGRATION_EXCLUDED_CATEGORIES,
  useMigrateToLatestDataview,
} from 'features/_map/dataviews/dataviews.hooks'
import { getIsVesselGroupDataviewOutdated } from 'features/_map/dataviews/dataviews.utils'
import { selectDeprecatedDataviewInstances } from 'features/_map/dataviews/selectors/dataviews.instances.selectors'
import { selectWorkspaceWithCurrentState } from 'features/_map/workspace/selectors/app.workspace.selectors'
import { selectUserData } from 'features/_user/selectors/user.selectors'
import { useMigrateToLatestVesselGroup } from 'features/_user/vessel-groups/vessel-groups-migration.hooks'
import { getIsVesselDataviewOutdated } from 'features/_vessels/vessel/vessel.utils'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectLocationCategory } from 'router/routes.selectors'
import { htmlSafeParse } from 'utils/html-parser'

import { mergeDataviewIntancesToUpsert } from './workspace.hook'
import { selectIsWorkspaceOwner, selectIsWorkspaceOwnerOrDefault } from './workspace.selectors'
import { updateCurrentWorkspaceThunk } from './workspace.slice'

import styles from './Workspace.module.css'

const migrationToastDiscardedWorkspaceIds = new Set<string>()
export const useMigrateWorkspaceToast = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const deprecatedDataviews = useSelector(selectDeprecatedDataviewInstances)
  const userData = useSelector(selectUserData)
  const deprecatedDatasets = useSelector(selectDeprecatedDatasets)
  const outdatedVesselGroups = uniqBy(
    (deprecatedDataviews || []).flatMap((dataview) =>
      dataview.vesselGroup &&
      dataview.vesselGroup.ownerId === userData?.id &&
      getIsVesselGroupDataviewOutdated(dataview, deprecatedDatasets)
        ? [dataview.vesselGroup]
        : []
    ),
    (vesselGroup) => vesselGroup.id
  )
  const hasDeprecatedDataviewsToMigrate =
    outdatedVesselGroups.length > 0 ||
    (deprecatedDataviews || []).some(
      (dataview) =>
        !MIGRATION_EXCLUDED_CATEGORIES.includes(dataview.category!) ||
        getIsVesselDataviewOutdated(dataview, deprecatedDatasets)
    )
  const isWorkspaceOwner = useSelector(selectIsWorkspaceOwner)
  const isWorkspaceOwnerOrDefault = useSelector(selectIsWorkspaceOwnerOrDefault)
  const workspace = useSelector(selectWorkspaceWithCurrentState)
  const locationCategory = useSelector(selectLocationCategory)
  const { migrateAllDataviewInstances } = useMigrateToLatestDataview()
  const { switchVesselGroupToLatest } = useMigrateToLatestVesselGroup()
  const workspaceId = workspace?.id || ''
  const toastId = useRef<any>(undefined)

  const closeToast = () => {
    toast.dismiss(toastId.current)
  }

  const onMigrateAllClick = async () => {
    const [migratedDataviewInstances, vesselGroupsResults] = await Promise.all([
      migrateAllDataviewInstances(),
      Promise.allSettled(outdatedVesselGroups.map(switchVesselGroupToLatest)),
    ])
    // Rejected or needing the modal flow (ie: v3 vessels), they keep their layer panel warning
    const failedVesselGroups = outdatedVesselGroups.filter((_, index) => {
      const result = vesselGroupsResults[index]
      return result.status === 'rejected' || !result.value
    })
    if (isWorkspaceOwner && workspace?.id && migratedDataviewInstances.length) {
      const dataviewInstances = mergeDataviewIntancesToUpsert(
        migratedDataviewInstances,
        workspace.dataviewInstances as UrlDataviewInstance[]
      )
      const dispatchedAction = await dispatch(
        updateCurrentWorkspaceThunk({
          ...workspace,
          dataviewInstances: dataviewInstances as DataviewInstance[],
        })
      )
      if (updateCurrentWorkspaceThunk.fulfilled.match(dispatchedAction)) {
        router.navigate({
          to: ROUTE_PATHS.WORKSPACE,
          params: { category: locationCategory, workspaceId: dispatchedAction.payload.id },
          search: {},
          replace: true,
        })
      }
    }
    if (failedVesselGroups.length) {
      console.warn('Vessel groups not migrated', vesselGroupsResults)
      toast.error(
        t((t) => t.workspace.migrationVesselGroupsError, {
          names: failedVesselGroups.map((vesselGroup) => vesselGroup.name).join(', '),
        })
      )
    } else {
      migrationToastDiscardedWorkspaceIds.add(workspaceId)
    }
    closeToast()
  }

  const onMigrateAllClickRef = useRef(onMigrateAllClick)
  useEffect(() => {
    onMigrateAllClickRef.current = onMigrateAllClick
  })

  const ToastContent = () => {
    const [loading, setLoading] = useState(false)
    return (
      <div className={styles.disclaimerButton}>
        <div className={styles.disclaimer}>
          <IconButton icon="update-required" type="update-required" size="small" />
          <div>
            <p>{t((t) => t.workspace.migrationDisclaimer)}</p>
            <p className={styles.secondary}>
              {htmlSafeParse(t((t) => t.workspace.migrationDisclaimerNote))}
            </p>
          </div>
        </div>
        <Button
          size="small"
          loading={loading}
          disabled={loading}
          onClick={async () => {
            setLoading(true)
            toast.update(toastId.current, { autoClose: false })
            await onMigrateAllClickRef.current()
            setLoading(false)
          }}
        >
          {t((t) => t.workspace.migrationMigrateAll)}
        </Button>
      </div>
    )
  }

  const onDeprecatedDataviewsChange = useEffectEvent(() => {
    console.warn('Deprecated datasets:')
    const newDeprecatedDatasets = Object.fromEntries(
      Object.entries(deprecatedDatasets).filter(([id]) => !(id in LEGACY_DATASETS_TO_LATEST_VMS))
    )
    console.log(newDeprecatedDatasets)
  })

  useEffect(() => {
    if (
      hasDeprecatedDataviewsToMigrate &&
      isWorkspaceOwnerOrDefault &&
      !migrationToastDiscardedWorkspaceIds.has(workspaceId)
    ) {
      toastId.current = toast(<ToastContent />, {
        toastId: 'migrateWorkspace',
        closeButton: true,
        autoClose: false,
        onClose: (reason) => {
          if (reason === true || reason === 'click') {
            migrationToastDiscardedWorkspaceIds.add(workspaceId)
          }
        },
      })
      onDeprecatedDataviewsChange()
      return () => {
        closeToast()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasDeprecatedDataviewsToMigrate, workspaceId])
}
