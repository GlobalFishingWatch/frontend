import { useSelector } from 'react-redux'
import Link from 'redux-first-router-link'
import { useTranslation } from 'react-i18next'
import { Icon, Tooltip } from '@globalfishingwatch/ui-components'
import { isGuestUser, selectUserData } from 'features/user/user.slice'
import LocalStorageLoginLink from 'routes/LoginLink'
import { USER } from 'routes/routes'
import { DEFAULT_WORKSPACE_LIST_VIEWPORT } from 'features/sidebar/CategoryTabs'

const UserButton = ({ className = '', testId }: { className?: string; testId?: string }) => {
  const { t } = useTranslation()
  const guestUser = useSelector(isGuestUser)
  const userData = useSelector(selectUserData)
  const initials = userData
    ? `${userData?.firstName?.slice(0, 1)}${userData?.lastName?.slice(0, 1)}`
    : ''
  return (
    <div className={className}>
      {guestUser ? (
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
          data-test={testId}
        >
          {userData ? initials : <Icon icon="user" className="print-hidden" />}
        </Link>
      )}
    </div>
  )
}

export default UserButton
