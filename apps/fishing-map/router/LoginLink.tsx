import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { getLoginUrl, useLoginRedirect } from '@globalfishingwatch/react-hooks'
import { Tooltip } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectWorkspaceHistoryNavigation } from 'features/workspace/workspace.selectors'
import { setWorkspaceSuggestSave } from 'features/workspace/workspace.slice'

type LocalStorageLoginLinkProps = {
  children: React.ReactNode
  className?: string
}

function LocalStorageLoginLink({ children, className = '' }: LocalStorageLoginLinkProps, ref: any) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { saveRedirectUrl, saveHistoryNavigation } = useLoginRedirect()
  const workspaceHistoryNavigation = useSelector(selectWorkspaceHistoryNavigation)

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(setWorkspaceSuggestSave(false))
    saveRedirectUrl()
    saveHistoryNavigation(workspaceHistoryNavigation)

    const width = 500
    const height = 750
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    // This works because we have useLoginMessage hook initialized in the app listening to messages
    window.open(
      getLoginUrl(undefined, { isPopup: 'true' }),
      'SSO Login',
      `width=${width},height=${height},left=${left},top=${top}`
    )
  }

  return (
    <Tooltip content={t((t) => t.common.login)}>
      <span
        ref={ref}
        role="button"
        tabIndex={0}
        onClick={onClick}
        className={className}
        data-testid="login-link"
      >
        {children}
      </span>
    </Tooltip>
  )
}

export default forwardRef(LocalStorageLoginLink)
