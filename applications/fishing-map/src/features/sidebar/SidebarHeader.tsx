import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Sticky from 'react-sticky-el'
import { useTranslation } from 'react-i18next'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Logo from '@globalfishingwatch/ui-components/dist/logo'
import { SubBrands } from '@globalfishingwatch/ui-components/dist/logo/Logo'
import { saveCurrentWorkspaceThunk } from 'features/workspace/workspace.slice'
import {
  isWorkspacePublic,
  selectWorkspaceCustom,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import { AsyncReducerStatus } from 'types'
import copyToClipboard from 'utils/clipboard'
import {
  isWorkspaceLocation,
  selectLocationCategory,
  selectWorkspaceId,
} from 'routes/routes.selectors'
import { WorkspaceCategories } from 'data/workspaces'
import styles from './SidebarHeader.module.css'

function SidebarHeader() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [finished, setFinished] = useState(false)
  const workspaceId = useSelector(selectWorkspaceId)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const workspaceCustom = useSelector(selectWorkspaceCustom)
  const locationCategory = useSelector(selectLocationCategory)
  const workspacePublic = useSelector(isWorkspacePublic)
  const showShareButton = useSelector(isWorkspaceLocation)
  const timeoutRef = useRef<any>()

  const onWorkspaceShareFinish = useCallback((stringToClipboard: string) => {
    setFinished(true)
    copyToClipboard(stringToClipboard)
    timeoutRef.current = setTimeout(() => setFinished(false), 6000)
  }, [])

  const onShareClick = useCallback(async () => {
    if (!workspacePublic) {
      await dispatch(saveCurrentWorkspaceThunk())
      onWorkspaceShareFinish(`${window.location.origin}/${workspaceId}`)
    } else {
      onWorkspaceShareFinish(window.location.href)
    }
  }, [dispatch, onWorkspaceShareFinish, workspaceId, workspacePublic])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const getSubBrand = useCallback((): SubBrands | undefined => {
    let subBrand: SubBrands | undefined
    if (locationCategory === WorkspaceCategories.MarineReserves) subBrand = 'Marine Reserves'
    if (locationCategory === WorkspaceCategories.CountryPortals) subBrand = 'Country Portal'
    return subBrand
  }, [locationCategory])

  return (
    <Sticky scrollElement=".scrollContainer">
      <div className={styles.sidebarHeader}>
        <Logo className={styles.logo} subBrand={getSubBrand()} />
        {showShareButton && (
          <IconButton
            icon={finished ? 'tick' : 'share'}
            size="medium"
            className="print-hidden"
            onClick={onShareClick}
            loading={workspaceStatus === AsyncReducerStatus.Loading && workspaceCustom === true}
            tooltip={
              finished
                ? t(
                    'common.copiedToClipboard',
                    'The link to share this view has been copied to your clipboard. You can find all your saved views in your user area.'
                  )
                : t('common.share', 'Click to share the current view')
            }
            tooltipPlacement="bottom"
          />
        )}
      </div>
    </Sticky>
  )
}

export default SidebarHeader
