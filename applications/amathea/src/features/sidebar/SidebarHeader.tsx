import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Logo from '@globalfishingwatch/ui-components/dist/logo'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { selectUserData } from 'features/user/user.slice'
import styles from './SidebarHeader.module.css'

function SidebarHeader(): React.ReactElement {
  const userData = useSelector(selectUserData)
  const initials = `${userData?.firstName?.slice(0, 1)}${userData?.lastName?.slice(0, 1)}`

  return (
    <header className={styles.container}>
      <IconButton icon="menu" />
      <Logo subBrand="Marine Reserves" />

      <div className={styles.righSide}>
        {userData && (
          <Fragment>
            <IconButton icon="logout" tooltip="Log out" tooltipPlacement="left" />
            <Button
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
            </Button>
          </Fragment>
        )}
      </div>
    </header>
  )
}

export default SidebarHeader
