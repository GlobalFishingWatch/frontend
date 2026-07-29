import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useRouter } from '@tanstack/react-router'

import type { DataviewInstance } from '@globalfishingwatch/api-types'
import { LEGACY_DATASETS_TO_LATEST_VMS } from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { Button, IconButton } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectDeprecatedDatasets } from 'features/map/datasets/datasets.slice'
import {
  MIGRATION_EXCLUDED_CATEGORIES,
  useMigrateToLatestDataview,
} from 'features/map/dataviews/dataviews.hooks'
import { selectDeprecatedDataviewInstances } from 'features/map/dataviews/selectors/dataviews.instances.selectors'
import { selectWorkspaceWithCurrentState } from 'features/map/workspace/selectors/app.workspace.selectors'
import { selectLocationCategory } from 'router/routes.selectors'
import { ROUTE_PATHS } from 'router/routes.utils'
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
  const hasDeprecatedDataviewsToMigrate = (deprecatedDataviews || []).some(
    (dataview) => !MIGRATION_EXCLUDED_CATEGORIES.includes(dataview.category!)
  )
  const deprecatedDatasets = useSelector(selectDeprecatedDatasets)
  const isWorkspaceOwner = useSelector(selectIsWorkspaceOwner)
  const isWorkspaceOwnerOrDefault = useSelector(selectIsWorkspaceOwnerOrDefault)
  const workspace = useSelector(selectWorkspaceWithCurrentState)
  const locationCategory = useSelector(selectLocationCategory)
  const { migrateAllDataviewInstances } = useMigrateToLatestDataview()
  const workspaceId = workspace?.id || ''
  const toastId = useRef<any>(undefined)

  const closeToast = () => {
    toast.dismiss(toastId.current)
  }

  const onMigrateAllClick = async () => {
    const migratedDataviewInstances = await migrateAllDataviewInstances()
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
    migrationToastDiscardedWorkspaceIds.add(workspaceId)
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
          <IconButton icon="warning" type="warning-invert" size="small" />
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
        autoClose: 10000,
        closeButton: true,
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
