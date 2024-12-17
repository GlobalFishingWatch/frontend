import { useSelector } from 'react-redux'
import Link from 'redux-first-router-link'
import { useTranslation } from 'react-i18next'
import { Icon, Tooltip } from '@globalfishingwatch/ui-components'
import LocalStorageLoginLink from 'routes/LoginLink'
import { USER } from 'routes/routes'
import { DEFAULT_WORKSPACE_LIST_VIEWPORT } from 'data/config'
import {
  selectIsGuestUser,
  selectIsUserExpired,
  selectUserData,
} from 'features/user/selectors/user.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import { setWorkspaceSuggestSave } from 'features/workspace/workspace.slice'

const UserButton = ({ className = '', testId }: { className?: string; testId?: string }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const guestUser = useSelector(selectIsGuestUser)
  const isUserExpired = useSelector(selectIsUserExpired)
  const userData = useSelector(selectUserData)
  const initials = userData?.firstName
    ? `${userData?.firstName?.slice(0, 1)}${userData?.lastName?.slice(0, 1)}`
    : ''

  const onLinkClick = () => {
    dispatch(setWorkspaceSuggestSave(false))
  }

  return (
    <div className={className}>
      {guestUser || isUserExpired ? (
        <Tooltip content={t('common.login', 'Log in')}>
          <LocalStorageLoginLink>
            <Icon icon="user" testId={testId} />
          </LocalStorageLoginLink>
        </Tooltip>
      ) : (
        <Link
          to={{
            type: USER,
            payload: {},
            query: { ...DEFAULT_WORKSPACE_LIST_VIEWPORT },
            replaceQuery: true,
          }}
          onClick={onLinkClick}
          data-test={testId}
        >
          {userData ? initials : <Icon icon="user" className="print-hidden" />}
        </Link>
      )}
    </div>
  )
}

export default UserButton
