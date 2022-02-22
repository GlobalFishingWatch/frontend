import React, { Fragment, useCallback } from 'react'
import cx from 'classnames'
import { formatI18nDate } from 'lib/dates'
import { useClipboardNotification } from 'app/clipboard.hooks'
import { UserApplication } from '@globalfishingwatch/api-types'
import { IconButton, Spinner } from '@globalfishingwatch/ui-components'
import { useGetUserApplications } from 'features/user-applications/user-applications.hooks'
import styles from './access-token-list.module.css'

/* eslint-disable-next-line */
export interface AccessTokenListProps {}

export function AccessTokenList(props: AccessTokenListProps) {
  const response = useGetUserApplications()
  const { data, isError, isLoading, isAllowed, dispatchDelete } = response

  const { copyToClipboard, showClipboardNotification } = useClipboardNotification()

  const onDeleteClick = useCallback(
    async ({ id }: UserApplication) => {
      const response = await dispatchDelete({ id })
      if (response.payload?.error) {
        console.error(response.payload?.error)
      } else {
        console.log(`user application ${id} was removed succesfully`)
      }
    },
    [dispatchDelete]
  )

  const onCopyClipboardClick = useCallback(
    (tokenText) => {
      copyToClipboard(tokenText)
    },
    [copyToClipboard]
  )

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
            {!isLoading &&
              data.map((row, index) => (
                <tr key={`row-token-${index}`}>
                  <td data-aria-label="Application Name" className={styles.cellApplication}>
                    {row.name}
                  </td>
                  <td data-aria-label="Description" className={styles.cellDescription}>
                    {row.description}
                  </td>
                  <td data-aria-label="Token" className={styles.cellToken}>
                    <code>{row.token.substring(0, 250) + '...'}</code>
                    <IconButton
                      type="default"
                      size="default"
                      icon={showClipboardNotification(row.token) ? 'tick' : 'copy'}
                      onClick={(e) => onCopyClipboardClick(row.token)}
                      tooltip={
                        showClipboardNotification(row.token)
                          ? 'The token was copied to the clipboard'
                          : 'Copy to clipboard'
                      }
                    />
                  </td>
                  <td data-aria-label="Creation Date" className={styles.cellCreation}>
                    {formatI18nDate(row.createdAt)}
                  </td>
                  <td data-aria-label="action" className={styles.cellActions}>
                    <div className={styles.content}>
                      <IconButton
                        key={`delete-token-${index}`}
                        type="warning"
                        size="default"
                        icon="delete"
                        className={styles.delete}
                        onClick={(e) => onDeleteClick(row)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            {!isLoading && data.length === 0 && (
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
