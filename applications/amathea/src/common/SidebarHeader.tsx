import React, { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Link from 'redux-first-router-link'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Logo from '@globalfishingwatch/ui-components/dist/logo'
import { selectUserData, logoutUserThunk } from 'features/user/user.slice'
import { toggleMenu } from 'features/app/app.slice'
import { isWorkspaceEditorPage } from 'routes/routes.selectors'
import { WORKSPACES } from 'routes/routes'
import styles from './SidebarHeader.module.css'

function SidebarHeader(): React.ReactElement {
  const dispatch = useDispatch()
  const userData = useSelector(selectUserData)
  const isWorkspaceEditor = useSelector(isWorkspaceEditorPage)
  const initials = `${userData?.firstName?.slice(0, 1)}${userData?.lastName?.slice(0, 1)}`

  return (
    <header className={styles.container}>
      {isWorkspaceEditor ? (
        <Link to={{ type: WORKSPACES }}>
          <IconButton icon="home" />
        </Link>
      ) : (
        <IconButton icon="menu" onClick={() => dispatch(toggleMenu())} />
      )}
      <Logo subBrand="Marine Reserves" />

      <div className={styles.righSide}>
        {userData && (
          <Fragment>
            <IconButton
              icon="logout"
              tooltip="Log out"
              tooltipPlacement="left"
              onClick={() => dispatch(logoutUserThunk())}
            />
            <IconButton
              tooltip={
                <span>
                  {`${userData.firstName} ${userData.lastName}`}
                  <br />
                  {userData.email}
                </span>
              }
              tooltipPlacement="left"
              className={styles.userBtn}
            >
              {initials}
            </IconButton>
          </Fragment>
        )}
      </div>
    </header>
  )
}

export default SidebarHeader
