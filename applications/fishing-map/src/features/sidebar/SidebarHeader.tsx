import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Sticky from 'react-sticky-el'
import { useTranslation } from 'react-i18next'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Logo from '@globalfishingwatch/ui-components/dist/logo'
import { SubBrands } from '@globalfishingwatch/ui-components/dist/logo/Logo'
import { saveCurrentWorkspaceThunk } from 'features/workspace/workspace.slice'
import {
  selectWorkspaceCustom,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import { AsyncReducerStatus } from 'types'
import copyToClipboard from 'utils/clipboard'
import { selectLocationCategory, selectWorkspaceId } from 'routes/routes.selectors'
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

  const onShareClick = useCallback(() => {
    dispatch(saveCurrentWorkspaceThunk())
  }, [dispatch])

  useEffect(() => {
    let id: any
    if (workspaceStatus === AsyncReducerStatus.Finished && workspaceCustom === true) {
      setFinished(true)
      copyToClipboard(`${window.location.origin}/${workspaceId}`)
      id = setTimeout(() => setFinished(false), 5000)
    }

    return () => {
      if (id) {
        clearTimeout(id)
      }
    }
  }, [workspaceCustom, workspaceId, workspaceStatus])

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
                  'The link to share this view has been copied to your clipboard'
                )
              : t('common.share', 'Click to share the current view')
          }
          tooltipPlacement="bottom"
        />
      </div>
    </Sticky>
  )
}

export default SidebarHeader
