import React, { Fragment, useCallback, useState } from 'react'
import { useClipboardNotification } from 'app/clipboard.hooks'
import cx from 'classnames'
import { formatI18nDate } from 'lib/dates'

import type { UserApplication} from '@globalfishingwatch/api-types';
import { UserData } from '@globalfishingwatch/api-types'
import { IconButton, Spinner } from '@globalfishingwatch/ui-components'

import useUser from 'features/user/user'
import useUserApplications, {
  useDeleteUserApplication,
} from 'features/user-applications/user-applications'

import styles from './access-token-list.module.css'

/* eslint-disable-next-line */
export interface AccessTokenListProps {}

type ActionMessage = {
  type: 'error' | 'success' | 'info'
  message: string
}

export function AccessTokenList(props: AccessTokenListProps) {
  const { data: user } = useUser()
  const { isError, isLoading, data } = useUserApplications(user?.id)
  const deleteUserApplication = useDeleteUserApplication(user?.id)

  const isAllowed = true
  const [actionMessage, setActionMessage] = useState<ActionMessage>()
  const [tokenVisibility, setTokenVisibility] = useState<{ [id: string]: boolean }>({})

  const defaultTokenVisibility = false
  const toggleTokenVisibility = useCallback(
    (id: string) =>
      setTokenVisibility({
        ...tokenVisibility,
        [id]: !(tokenVisibility[id] || defaultTokenVisibility),
      }),
    [defaultTokenVisibility, tokenVisibility]
  )
  const { copyToClipboard, showClipboardNotification } = useClipboardNotification()

  const clearActionMessage = useCallback(() => {
    return setActionMessage(undefined)
  }, [])

  const onDeleteClick = useCallback(
    async ({ id }: UserApplication) => {
      if (
         
        !confirm(
          'Deleting an application token will cause any application or service using it ' +
            'to lose the connection with our API. \n' +
            'This action can not be undone. \n' +
            'Are you sure you want to delete this application token?'
        )
      )
        return

      try {
        await deleteUserApplication.mutate(id)
        setActionMessage({ type: 'success', message: 'Token deleted successfully.' })
        setTimeout(clearActionMessage, 5000)
      } catch (e) {
        setActionMessage({
          type: 'error',
          message: 'There was a problem deleting the token.',
        })
      }
    },
    [clearActionMessage, deleteUserApplication]
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
              data?.entries?.map((row, index) => (
                <tr key={`row-token-${index}`}>
                  <td data-aria-label="Application Name" className={styles.cellApplication}>
                    {row.name}
                  </td>
                  <td data-aria-label="Description" className={styles.cellDescription}>
                    {row.description}
                  </td>
                  <td data-aria-label="Token" className={styles.cellToken}>
                    <code className={tokenVisibility[`${row.id}`] ? '' : styles.blur}>
                      {tokenVisibility[`${row.id}`]
                        ? row.token
                        : row.token.substring(0, 100) + '...'}
                    </code>
                    <div>
                      <IconButton
                        type="default"
                        size="default"
                        icon={tokenVisibility[`${row.id}`] ? 'visibility-off' : 'visibility-on'}
                        onClick={() => toggleTokenVisibility(`${row.id}`)}
                        tooltip={tokenVisibility[`${row.id}`] ? 'Hide token' : 'Display token'}
                      />
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
                    </div>
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
            {!isLoading && data && data?.entries?.length === 0 && (
              <tr key={`row-token-info`}>
                <td className={cx([styles.cellNoData])} colSpan={5}>
                  <div className={styles.content}>There are no application tokens created yet.</div>
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
      {!!actionMessage && (
        <div className={cx([styles.actionMessage, styles[`${actionMessage.type}Message`]])}>
          <div className={styles.content}>{actionMessage.message}</div>
          <IconButton
            icon="close"
            onClick={clearActionMessage}
            className={styles.actionMessageClose}
            tooltip="Close"
            type={actionMessage?.type === 'error' ? 'warning' : 'default'}
          ></IconButton>
        </div>
      )}
    </Fragment>
  )
}

export default AccessTokenList
