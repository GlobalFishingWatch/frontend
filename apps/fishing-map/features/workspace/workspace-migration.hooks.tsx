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
import { selectWorkspaceWithCurrentState } from 'features/app/selectors/app.workspace.selectors'
import { selectDeprecatedDatasets } from 'features/datasets/datasets.slice'
import { useMigrateToLatestDataview } from 'features/dataviews/dataviews.hooks'
import { selectHasDeprecatedDataviewInstances } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectLocationCategory } from 'router/routes.selectors'
import { ROUTE_PATHS } from 'router/routes.utils'
import { htmlSafeParse } from 'utils/html-parser'

import { mergeDataviewIntancesToUpsert } from './workspace.hook'
import { selectIsWorkspaceOwner, selectIsWorkspaceOwnerOrDefault } from './workspace.selectors'
import { updateCurrentWorkspaceThunk } from './workspace.slice'

import styles from './Workspace.module.css'

let migrationToastDiscarded = false
export const useMigrateWorkspaceToast = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const hasDeprecatedDataviews = useSelector(selectHasDeprecatedDataviewInstances)
  const deprecatedDatasets = useSelector(selectDeprecatedDatasets)
  const isWorkspaceOwner = useSelector(selectIsWorkspaceOwner)
  const isWorkspaceOwnerOrDefault = useSelector(selectIsWorkspaceOwnerOrDefault)
  const workspace = useSelector(selectWorkspaceWithCurrentState)
  const locationCategory = useSelector(selectLocationCategory)
  const { migrateAllDataviewInstances } = useMigrateToLatestDataview()
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
    migrationToastDiscarded = true
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
    if (hasDeprecatedDataviews && isWorkspaceOwnerOrDefault && !migrationToastDiscarded) {
      toastId.current = toast(<ToastContent />, {
        toastId: 'migrateWorkspace',
        autoClose: 10000,
        closeButton: true,
        onClose: (reason) => {
          if (reason === true || reason === 'click') {
            migrationToastDiscarded = true
          }
        },
      })
      onDeprecatedDataviewsChange()
      return () => {
        closeToast()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasDeprecatedDataviews])
}
