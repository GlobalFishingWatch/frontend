import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { WORKSPACE_PASSWORD_ACCESS } from '@globalfishingwatch/api-types'
import { IconButton, Popover, Tooltip } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { setModalOpen } from 'features/modals/modals.slice'
import {
  selectIsDefaultWorkspace,
  selectIsWorkspaceOwner,
  selectWorkspace,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import { isPrivateWorkspaceNotAllowed } from 'features/workspace/workspace.utils'
import LoginButtonWrapper from 'routes/LoginButtonWrapper'
import { AsyncReducerStatus } from 'utils/async-slice'

import styles from '../SidebarHeader.module.css'

function SaveWorkspaceButton() {
  const { t } = useTranslation()
  const workspace = useSelector(selectWorkspace)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const isDefaultWorkspace = useSelector(selectIsDefaultWorkspace)
  const isWorkspaceOwner = useSelector(selectIsWorkspaceOwner)

  const isPassWordEditAccess = workspace?.editAccess === WORKSPACE_PASSWORD_ACCESS
  const canEditWorkspace = isWorkspaceOwner || isPassWordEditAccess

  const dispatch = useAppDispatch()
  const [saveWorkspaceTooltipOpen, setSaveWorkspaceTooltipOpen] = useState(false)

  const onSaveClick = () => {
    if (canEditWorkspace) {
      dispatch(setModalOpen({ id: 'editWorkspace', open: true }))
      dispatch(setModalOpen({ id: 'createWorkspace', open: false }))
      setSaveWorkspaceTooltipOpen(false)
    }
  }

  const onSaveAsClick = () => {
    dispatch(setModalOpen({ id: 'editWorkspace', open: false }))
    dispatch(setModalOpen({ id: 'createWorkspace', open: true }))
    setSaveWorkspaceTooltipOpen(false)
  }

  const onOpenChange = (open: boolean) => {
    setSaveWorkspaceTooltipOpen(open)
    if (!open) {
      dispatch(setModalOpen({ id: 'editWorkspace', open: false }))
      dispatch(setModalOpen({ id: 'createWorkspace', open: false }))
    }
  }

  if (
    !workspace ||
    isPrivateWorkspaceNotAllowed(workspace) ||
    workspaceStatus === AsyncReducerStatus.Loading
  ) {
    return null
  }

  if (isDefaultWorkspace) {
    return (
      <LoginButtonWrapper tooltip={t('workspace.saveLogin')}>
        <IconButton
          icon="save"
          size="medium"
          className="print-hidden"
          onClick={onSaveAsClick}
          testId="save-workspace-button"
          tooltip={t('analysis.save')}
          tooltipPlacement="bottom"
        />
      </LoginButtonWrapper>
    )
  }

  return (
    <Fragment>
      <Popover
        open={saveWorkspaceTooltipOpen}
        onOpenChange={onOpenChange}
        placement="bottom"
        showArrow={false}
        content={
          <ul>
            <Tooltip
              content={canEditWorkspace ? t('workspace.save') : t('workspace.saveOwnerOnly')}
            >
              <li key="workspace-save">
                <button
                  className={cx(styles.groupOption, { [styles.disabled]: !canEditWorkspace })}
                  onClick={onSaveClick}
                >
                  {t('workspace.save')}
                </button>
              </li>
            </Tooltip>
            <li key="workspace-save-as">
              <button className={styles.groupOption} onClick={onSaveAsClick}>
                {t('workspace.saveAs')}
              </button>
            </li>
          </ul>
        }
      >
        <div>
          <LoginButtonWrapper tooltip={t('workspace.saveLogin')}>
            <IconButton
              icon="save"
              size="medium"
              className="print-hidden"
              onClick={() => setSaveWorkspaceTooltipOpen(true)}
              tooltip={t('analysis.save')}
              tooltipPlacement="bottom"
            />
          </LoginButtonWrapper>
        </div>
      </Popover>
    </Fragment>
  )
}

export default SaveWorkspaceButton
