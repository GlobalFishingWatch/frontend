import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
// import { UserPermission } from '@globalfishingwatch/api-types'
import { IconButton } from '@globalfishingwatch/ui-components'
import { checkUserApplicationPermission } from 'features/user/user.hooks'
import { selectUserData } from 'features/user/user.slice'
import styles from './AccessToken.module.css'

export function AccessTokenList() {
  const { permissions } = useSelector(selectUserData)
  // const permissions: UserPermission[] = [
  //   { type: 'entity', value: 'user-application', action: 'read' },
  // ]
  const isAllowed = checkUserApplicationPermission('read', permissions)
  const tokenList = [
    {
      name: 'Lorem',
      description:
        'Through our free and open data transparency platform, Global Fishing Watch enables research and innovation in support of ocean sustainability.',
      token:
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImtpZEtleSJ9.eyJkYXRhIjp7ImZpcnN0TmFtZSI6IlJvZHJpZ28iLCJsYXN0TmFtZSI6IkZ1ZW50ZXMiLCJlbWFpbCI6InJvZHJpZ28uZnVlbnRlc0BnbG9iYWxmaXNoaW5nd2F0Y2gub3JnIiwicGhvdG8iOiIiLCJsYW5ndWFnZSI6ImVuX1VTIiwiaWQiOjk1LCJ0eXBlIjoidXNlciJ9LCJpYXQiOjE2NDMxNDYyNjUsImV4cCI6MTY0MzE0ODA2NSwiYXVkIjoiZ2Z3IiwiaXNzIjoiZ2Z3In0',
      created: 'Feb 2 2022',
    },
    {
      name: 'Ipsum',
      description:
        'Through our free and open data transparency platform, Global Fishing Watch enables research and innovation in support of ocean sustainability.',
      token:
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImtpZEtleSJ9.eyJkYXRhIjp7ImZpcnN0TmFtZSI6IlJvZHJpZ28iLCJsYXN0TmFtZSI6IkZ1ZW50ZXMiLCJlbWFpbCI6InJvZHJpZ28uZnVlbnRlc0BnbG9iYWxmaXNoaW5nd2F0Y2gub3JnIiwicGhvdG8iOiIiLCJsYW5ndWFnZSI6ImVuX1VTIiwiaWQiOjg0OTMsInR5cGUiOiJ1c2VyIn0sImlhdCI6MTY0MzY2NDU0MiwiZXhwIjoxNjQzNjY2MzQyLCJhdWQiOiJnZnciLCJpc3MiOiJnZncifQ.',
      created: 'Feb 2 2022',
    },
  ]
  return (
    <Fragment>
      {isAllowed && (
        <table className={styles.list}>
          <thead>
            <tr>
              <th>Application Name</th>
              <th>Description</th>
              <th>Token</th>
              <th>Creation Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tokenList.map((row) => (
              <tr>
                <td data-aria-label="Application Name" className={styles.cellApplication}>
                  {row.name}
                </td>
                <td data-aria-label="Description" className={styles.cellDescription}>
                  {row.description}
                </td>
                <td data-aria-label="Token" className={styles.cellToken}>
                  <code>{row.token}</code>
                  <IconButton type="default" size="default" icon="share" />
                </td>
                <td data-aria-label="Creation Date" className={styles.cellCreation}>
                  {row.created}
                </td>
                <td>
                  <div className={styles.actions}>
                    <IconButton type="default" size="default" icon="delete" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Fragment>
  )
}

export default AccessTokenList
