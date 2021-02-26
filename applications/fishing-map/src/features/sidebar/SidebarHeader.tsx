import React, { Fragment, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Sticky from 'react-sticky-el'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Logo, { SubBrands } from '@globalfishingwatch/ui-components/dist/logo'
import { getOceanAreaName } from '@globalfishingwatch/ocean-areas'
import { saveCurrentWorkspaceThunk } from 'features/workspace/workspace.slice'
import {
  selectWorkspace,
  selectWorkspaceCustom,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import {
  isWorkspaceLocation,
  selectLocationCategory,
  selectUrlDataviewInstances,
} from 'routes/routes.selectors'
import { DEFAULT_WORKSPACE_ID, WorkspaceCategories } from 'data/workspaces'
import { useAppDispatch } from 'features/app/app.hooks'
import { pickDateFormatByRange } from 'features/map/controls/MapInfo'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { selectTimeRange, selectViewport } from 'features/app/app.selectors'
import styles from './SidebarHeader.module.css'
import { useClipboardNotification } from './sidebar.hooks'

function SaveWorkspaceButton() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const viewport = useSelector(selectViewport)
  const timerange = useSelector(selectTimeRange)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const workspaceCustom = useSelector(selectWorkspaceCustom)
  const { showClipboardNotification, copyToClipboard } = useClipboardNotification()
  const workspace = useSelector(selectWorkspace)

  const onSaveClick = async () => {
    const isDefaultWorkspace = workspace?.id === DEFAULT_WORKSPACE_ID
    let defaultName = workspace?.name
    if (isDefaultWorkspace) {
      const areaName = getOceanAreaName(viewport)
      const dateFormat = pickDateFormatByRange(timerange.start as string, timerange.end as string)
      const start = formatI18nDate(timerange.start as string, {
        format: dateFormat,
      })
        .replace(',', '')
        .replace('.', '')
      const end = formatI18nDate(timerange.end as string, {
        format: dateFormat,
      })
        .replace(',', '')
        .replace('.', '')

      defaultName = `From ${start} to ${end} near ${areaName}`
    }
    const name = prompt(t('workspace.nameInput', 'Workspace name'), defaultName)
    if (name) {
      const action = await dispatch(saveCurrentWorkspaceThunk(name))
      if (saveCurrentWorkspaceThunk.fulfilled.match(action)) {
        const workspaceId = action.payload?.id
        if (workspaceId) {
          copyToClipboard(`${window.location.origin}/${workspaceId}`)
        }
      } else {
        console.warn('Error saving workspace', action.payload)
      }
    }
  }

  return (
    <IconButton
      icon={showClipboardNotification ? 'tick' : 'save'}
      size="medium"
      className="print-hidden"
      onClick={onSaveClick}
      loading={workspaceStatus === AsyncReducerStatus.Loading && workspaceCustom === true}
      tooltip={
        showClipboardNotification
          ? t('workspace.saved', "The workspace was saved and it's available in your user profile")
          : t('workspace.save', 'Save this workspace')
      }
      tooltipPlacement="bottom"
    />
  )
}

function ShareWorkspaceButton() {
  const { t } = useTranslation()

  const { showClipboardNotification, copyToClipboard } = useClipboardNotification()

  const onShareClick = useCallback(() => {
    copyToClipboard(window.location.href)
  }, [copyToClipboard])

  return (
    <IconButton
      icon={showClipboardNotification ? 'tick' : 'share'}
      size="medium"
      className="print-hidden"
      onClick={onShareClick}
      tooltip={
        showClipboardNotification
          ? t(
              'common.copiedToClipboard',
              'The link to share this view has been copied to your clipboard'
            )
          : t('common.share', 'Share the current view')
      }
      tooltipPlacement="bottom"
    />
  )
}

function SidebarHeader() {
  const locationCategory = useSelector(selectLocationCategory)
  const showInteractionButtons = useSelector(isWorkspaceLocation)
  const urlDataviewInstances = useSelector(selectUrlDataviewInstances)
  const showSaveButton = urlDataviewInstances?.length > 0

  const getSubBrand = useCallback((): SubBrands | undefined => {
    let subBrand: SubBrands | undefined
    if (locationCategory === WorkspaceCategories.MarineReserves) subBrand = SubBrands.MarinReserves
    if (locationCategory === WorkspaceCategories.CountryPortals) subBrand = SubBrands.CountryPortal
    return subBrand
  }, [locationCategory])

  return (
    <Sticky scrollElement=".scrollContainer">
      <div className={styles.sidebarHeader}>
        <Logo className={styles.logo} subBrand={getSubBrand()} />
        {showInteractionButtons && (
          <Fragment>
            {showSaveButton && <SaveWorkspaceButton />}
            <ShareWorkspaceButton />
          </Fragment>
        )}
      </div>
    </Sticky>
  )
}

export default SidebarHeader
