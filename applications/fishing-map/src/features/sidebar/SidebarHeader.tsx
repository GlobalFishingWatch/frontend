import React, { Fragment, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Sticky from 'react-sticky-el'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Logo, { SubBrands } from '@globalfishingwatch/ui-components/dist/logo'
import { getOceanAreaName, OceanAreaLocale } from '@globalfishingwatch/ocean-areas'
import GFWAPI from '@globalfishingwatch/api-client'
import {
  saveCurrentWorkspaceThunk,
  updatedCurrentWorkspaceThunk,
} from 'features/workspace/workspace.slice'
import {
  selectWorkspace,
  selectWorkspaceCustomStatus,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { isWorkspaceLocation, selectLocationCategory } from 'routes/routes.selectors'
import { DEFAULT_WORKSPACE_ID, WorkspaceCategories } from 'data/workspaces'
import { useAppDispatch } from 'features/app/app.hooks'
import { pickDateFormatByRange } from 'features/map/controls/MapInfo'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { selectTimeRange, selectViewport } from 'features/app/app.selectors'
import { selectUserData } from 'features/user/user.slice'
import { isGuestUser } from 'features/user/user.selectors'
import styles from './SidebarHeader.module.css'
import { useClipboardNotification } from './sidebar.hooks'

function SaveWorkspaceButton() {
  const [loginLink, setLoginLink] = useState('')
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const guestUser = useSelector(isGuestUser)
  const viewport = useSelector(selectViewport)
  const timerange = useSelector(selectTimeRange)
  const userData = useSelector(selectUserData)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const workspaceCustomStatus = useSelector(selectWorkspaceCustomStatus)
  const { showClipboardNotification, copyToClipboard } = useClipboardNotification()
  const workspace = useSelector(selectWorkspace)

  const isOwnerWorkspace = workspace?.ownerId === userData?.id
  const isDefaultWorkspace = workspace?.id === DEFAULT_WORKSPACE_ID

  const onSaveClick = async () => {
    if (!showClipboardNotification) {
      let dispatchedAction
      if (workspace && isOwnerWorkspace) {
        dispatchedAction = await dispatch(updatedCurrentWorkspaceThunk(workspace.id))
      } else {
        const areaName = getOceanAreaName(viewport, { locale: i18n.language as OceanAreaLocale })
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

        const defaultName = isDefaultWorkspace
          ? `From ${start} to ${end} ${areaName ? `near ${areaName}` : ''}`
          : workspace?.name
        const name = prompt(t('workspace.nameInput', 'Workspace name'), defaultName)
        if (name) {
          dispatchedAction = await dispatch(saveCurrentWorkspaceThunk(name))
        }
      }
      if (dispatchedAction) {
        if (
          saveCurrentWorkspaceThunk.fulfilled.match(dispatchedAction) ||
          updatedCurrentWorkspaceThunk.fulfilled.match(dispatchedAction)
        ) {
          copyToClipboard(window.location.href)
        } else {
          console.warn('Error saving workspace', dispatchedAction.payload)
        }
      }
    }
  }

  if (!workspace || workspaceStatus === AsyncReducerStatus.Loading) {
    return null
  }

  if (guestUser) {
    return (
      <IconButton
        icon={loginLink ? 'user' : 'save'}
        size="medium"
        disabled={!loginLink}
        tooltip={t('workspace.saveLogin', 'You need to login to save views')}
        tooltipPlacement="bottom"
        onClick={() => {
          window.location.href = loginLink
        }}
        onMouseEnter={() => {
          setLoginLink(GFWAPI.getLoginUrl(window.location.toString()))
        }}
        onMouseLeave={() => {
          setLoginLink('')
        }}
      />
    )
  }

  return (
    <IconButton
      icon={showClipboardNotification ? 'tick' : 'save'}
      size="medium"
      className="print-hidden"
      onClick={onSaveClick}
      loading={workspaceCustomStatus === AsyncReducerStatus.Loading}
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

  const getSubBrand = useCallback((): SubBrands | undefined => {
    let subBrand: SubBrands | undefined
    if (locationCategory === WorkspaceCategories.MarineManager) subBrand = SubBrands.MarineManager
    return subBrand
  }, [locationCategory])

  return (
    <Sticky scrollElement=".scrollContainer">
      <div className={styles.sidebarHeader}>
        <a href="https://globalfishingwatch.org" className={styles.logoLink}>
          <Logo className={styles.logo} subBrand={getSubBrand()} />
        </a>
        {showInteractionButtons && (
          <Fragment>
            <SaveWorkspaceButton />
            <ShareWorkspaceButton />
          </Fragment>
        )}
      </div>
    </Sticky>
  )
}

export default SidebarHeader
