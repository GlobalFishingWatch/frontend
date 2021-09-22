import React, { Fragment, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Sticky from 'react-sticky-el'
import Link from 'redux-first-router-link'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Logo, { SubBrands } from '@globalfishingwatch/ui-components/dist/logo'
import {
  selectLastVisitedWorkspace,
  selectWorkspace,
  selectWorkspaceCustomStatus,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { isWorkspaceLocation, selectLocationCategory } from 'routes/routes.selectors'
import { WorkspaceCategories } from 'data/workspaces'
import { selectReadOnly } from 'features/app/app.selectors'
import { isGuestUser } from 'features/user/user.selectors'
import { useLoginRedirect } from 'routes/routes.hook'
import NewWorkspaceModal from 'features/workspace/shared/NewWorkspaceModal'
import { useClipboardNotification } from './sidebar.hooks'
import styles from './SidebarHeader.module.css'

function SaveWorkspaceButton() {
  const [showLoginLink, setShowLoginLink] = useState(false)
  const [showWorkspaceCreateModal, setShowWorkspaceCreateModal] = useState(false)
  const { onLoginClick } = useLoginRedirect()
  const { t } = useTranslation()
  const guestUser = useSelector(isGuestUser)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const workspaceCustomStatus = useSelector(selectWorkspaceCustomStatus)
  const { showClipboardNotification, copyToClipboard } = useClipboardNotification()
  const workspace = useSelector(selectWorkspace)

  const onCloseCreateWorkspace = useCallback(() => {
    setShowWorkspaceCreateModal(false)
  }, [])

  const onSaveCreateWorkspace = useCallback(() => {
    copyToClipboard(window.location.href)
    onCloseCreateWorkspace()
  }, [copyToClipboard, onCloseCreateWorkspace])

  const onSaveClick = async () => {
    if (!showClipboardNotification) {
      setShowWorkspaceCreateModal(true)
    }
  }

  if (!workspace || workspaceStatus === AsyncReducerStatus.Loading) {
    return null
  }

  if (guestUser) {
    return (
      <IconButton
        icon={showLoginLink ? 'user' : 'save'}
        size="medium"
        disabled={!showLoginLink}
        tooltip={t('workspace.saveLogin', 'You need to login to save views')}
        tooltipPlacement="bottom"
        onClick={onLoginClick}
        onMouseEnter={() => {
          setShowLoginLink(true)
        }}
        onMouseLeave={() => {
          setShowLoginLink(false)
        }}
      />
    )
  }

  return (
    <Fragment>
      <IconButton
        icon={showClipboardNotification ? 'tick' : 'save'}
        size="medium"
        className="print-hidden"
        onClick={onSaveClick}
        loading={workspaceCustomStatus === AsyncReducerStatus.Loading}
        tooltip={
          showClipboardNotification
            ? t(
                'workspace.saved',
                "The workspace was saved and it's available in your user profile"
              )
            : t('workspace.save', 'Save this workspace')
        }
        tooltipPlacement="bottom"
      />
      {showWorkspaceCreateModal && (
        <NewWorkspaceModal
          isOpen={showWorkspaceCreateModal}
          onClose={onCloseCreateWorkspace}
          onFinish={onSaveCreateWorkspace}
        />
      )}
    </Fragment>
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
  const readOnly = useSelector(selectReadOnly)
  const locationCategory = useSelector(selectLocationCategory)
  const workspaceLocation = useSelector(isWorkspaceLocation)
  const lastVisitedWorkspace = useSelector(selectLastVisitedWorkspace)
  const showBackToWorkspaceButton = !workspaceLocation

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
        {workspaceLocation && !readOnly && (
          <Fragment>
            <SaveWorkspaceButton />
            <ShareWorkspaceButton />
          </Fragment>
        )}
        {showBackToWorkspaceButton && lastVisitedWorkspace && (
          <Link className={styles.workspaceLink} to={lastVisitedWorkspace}>
            <IconButton type="border" icon="close" />
          </Link>
        )}
      </div>
    </Sticky>
  )
}

export default SidebarHeader
