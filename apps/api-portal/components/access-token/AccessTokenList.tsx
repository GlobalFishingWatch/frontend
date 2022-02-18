import React, { Fragment } from 'react'
import cx from 'classnames'
import { IconButton, Spinner } from '@globalfishingwatch/ui-components'
import { useGetUserApplications } from 'features/user-applications/user-applications.hooks'
import styles from './AccessToken.module.css'

export function AccessTokenList() {
  // const { permissions, id: userId } = useSelector(selectUserData)
  const response = useGetUserApplications()
  const { data, isError, isSuccess, isLoading, isAllowed } = response
  console.log(response)

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
            {isSuccess &&
              data.map((row, index) => (
                <tr key={`row-token-${index}`}>
                  <td data-aria-label="Application Name" className={styles.cellApplication}>
                    {row.name}
                  </td>
                  <td data-aria-label="Description" className={styles.cellDescription}>
                    {row.description}
                  </td>
                  <td data-aria-label="Token" className={styles.cellToken}>
                    <code>{row.token}</code>
                    <IconButton type="default" size="default" icon="copy" />
                  </td>
                  <td data-aria-label="Creation Date" className={styles.cellCreation}>
                    {row.createdAt}
                  </td>
                  <td data-aria-label="action" className={styles.cellActions}>
                    <div className={styles.content}>
                      <IconButton type="default" size="default" icon="delete" />
                    </div>
                  </td>
                </tr>
              ))}
            {isSuccess && data.length === 0 && (
              <tr key={`row-token-info`}>
                <td className={cx([styles.cellNoData])} colSpan={5}>
                  <div className={styles.content}>
                    There are still no application tokens created.
                  </div>
                </td>
              </tr>
            )}
            {isLoading && (
              <tr key={`row-token-info`}>
                <td className={cx([styles.cellNoData])} colSpan={5}>
                  <div className={styles.content}>
                    <Spinner></Spinner>
                  </div>
                </td>
              </tr>
            )}
            {isError && (
              <tr key={`row-token-info`}>
                <td className={cx([styles.cellNoData])} colSpan={5}>
                  <div className={styles.content}>Ups, something went wrong. 🙈</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </Fragment>
  )
}

export default AccessTokenList
