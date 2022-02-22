import { useCallback, useState, Fragment } from 'react'
import cx from 'classnames'
import {
  Button,
  Checkbox,
  InputText,
  Select,
  SelectOption,
} from '@globalfishingwatch/ui-components'
import { useCreateUserApplications } from 'features/user-applications/user-applications.hooks'
import { UserApplicationCreateArguments } from 'features/user-applications/user-applications.slice'
import styles from './access-token-create.module.css'

/* eslint-disable-next-line */
export interface AccessTokenCreateProps {}

const emptyToken: UserApplicationCreateArguments = {
  description: '',
  intendedUse: 'non-commercial',
  name: '',
  termsAccepted: false,
  userId: null,
}

export function AccessTokenCreate(props: AccessTokenCreateProps) {
  const { isAllowed, dispatchCreate, isSaving, isError } = useCreateUserApplications()

  const [token, setToken] = useState<UserApplicationCreateArguments>(emptyToken)
  const displayIntendedUse = false
  const displayAcceptTerms = false

  const intendedUseOptions: SelectOption[] = [
    {
      id: 'commercial',
      label: 'Commercial',
    },
    {
      id: 'non-commercial',
      label: 'Non Commercial',
    },
  ]

  const create = useCallback(async () => {
    const response = await dispatchCreate({
      ...token,
      termsAccepted: true,
      intendedUse: 'non-commercial',
    })
    if (response.error) {
      console.error(response.error)
    } else {
      setToken(emptyToken)
    }
  }, [dispatchCreate, token])

  return (
    <div className={styles.container}>
      {isAllowed && (
        <Fragment>
          <h1>New Token</h1>
          <div className={styles.fieldsRow}>
            <div className={cx([styles.field, styles.applicationName])}>
              <InputText
                id="application_name"
                label="Application Name"
                type={'text'}
                maxLength={100}
                inputSize={'small'}
                value={token?.name}
                className={styles.input}
                onChange={(e) => setToken({ ...token, name: e.target.value })}
              />
            </div>
            {displayIntendedUse && (
              <div className={styles.field}>
                <Select
                  label={'Intended Use'}
                  placeholder={'Select an option'}
                  options={intendedUseOptions}
                  className={styles.select}
                  containerClassName={styles.selectContainer}
                  selectedOption={intendedUseOptions.find(
                    (option) => option.id === token?.intendedUse
                  )}
                  onSelect={(selected) => {
                    setToken({ ...token, intendedUse: selected.id })
                  }}
                  onRemove={() => {
                    setToken({ ...token, intendedUse: null })
                  }}
                />
              </div>
            )}
            {displayAcceptTerms && (
              <div className={styles.fieldsRow}>
                <div className={styles.field}>
                  <Checkbox
                    label="I agree to the Global Fishing Watch API Terms of Use and Attribution. If I am
                registering for use by an organization, I represent that I have the authority to
                bind that organization to these terms."
                    active={!!token?.termsAccepted}
                    onClick={() =>
                      setToken({
                        ...token,
                        termsAccepted: !token?.termsAccepted,
                      })
                    }
                  />
                </div>
              </div>
            )}
            <div className={cx([styles.field, styles.fieldsColumn])}>
              <label className={styles.label} htmlFor="new-token-description">
                Description
              </label>
              <textarea
                id="new-token-description"
                value={token?.description}
                className={styles.editor}
                onChange={(e) => setToken({ ...token, description: e.target.value })}
              />
              <Button
                className={styles.createBtn}
                disabled={!isAllowed}
                onClick={create}
                loading={isSaving}
                tooltip={
                  isAllowed ? 'Create New Token' : 'Tokens creation is not allowed at this moment'
                }
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
