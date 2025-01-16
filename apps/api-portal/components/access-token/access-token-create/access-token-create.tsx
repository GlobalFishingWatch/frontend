import { Fragment, useCallback, useEffect,useMemo, useRef } from 'react'
import cx from 'classnames'

import { Button, InputText } from '@globalfishingwatch/ui-components'

import { useCreateUserApplication } from 'features/user-applications/user-applications'

import styles from './access-token-create.module.css'

/* eslint-disable-next-line */
export interface AccessTokenCreateProps {}

export function AccessTokenCreate(props: AccessTokenCreateProps) {
  const {
    mutate,
    error,
    isAllowed,
    isLoading: isSaving,
    isError,
    token,
    setToken,
    valid,
  } = useCreateUserApplication()

  const nameRef = useRef<HTMLInputElement>(undefined)
  const create = useCallback(async () => {
    await mutate({
      ...token,
    })
    if (nameRef.current) {
      nameRef.current.focus()
    }
  }, [mutate, token])

  const validationMessage = useMemo(
    () => error && Object.values(error).map((e, index) => <p key={`msg-${index}`}>{e}</p>),
    [error]
  )
  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus()
    }
  }, [])
  return (
    <div className={styles.container}>
      {isAllowed && (
        <Fragment>
          <h1>New Token</h1>
          <div className={styles.fieldsRow}>
            <div className={cx([styles.field, styles.applicationName])}>
              <InputText
                id="application_name"
                label="Application Name (*)"
                type={'text'}
                maxLength={100}
                inputSize={'small'}
                value={token?.name}
                className={styles.input}
                onChange={(e) => setToken({ ...token, name: e.target.value })}
                ref={nameRef as any}
              />
            </div>
            <div className={cx([styles.field, styles.fieldsColumn])}>
              <label className={styles.label} htmlFor="new-token-description">
                Description (*)
              </label>
              <textarea
                id="new-token-description"
                value={token?.description}
                className={styles.editor}
                onChange={(e) => setToken({ ...token, description: e.target.value })}
              />
              <Button
                className={styles.createBtn}
                disabled={!valid}
                onClick={create}
                loading={isSaving}
                tooltip={valid ? 'Create New Token' : (validationMessage as string)}
              >
                Create New Token
              </Button>
            </div>
          </div>
          {isError && (
            <div className={styles.cellNoData}>
              <div className={styles.content}>Ups, something went wrong. 🙈</div>
            </div>
          )}
        </Fragment>
      )}
    </div>
  )
}

export default AccessTokenCreate
