import { useCallback, useState, Fragment } from 'react'
import {
  Button,
  Checkbox,
  InputText,
  Select,
  SelectOption,
  Spinner,
} from '@globalfishingwatch/ui-components'
import { useCreateUserApplications } from 'features/user-applications/user-applications.hooks'
import { UserApplicationCreateArguments } from 'features/user-applications/user-applications.slice'
import styles from './access-token-create.module.css'

/* eslint-disable-next-line */
export interface AccessTokenCreateProps {}

export function AccessTokenCreate(props: AccessTokenCreateProps) {
  const { isAllowed, dispatchCreate, isSaving, isError } = useCreateUserApplications()
  const [token, setToken] = useState<UserApplicationCreateArguments>()
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
      setToken({} as any)
    }
  }, [dispatchCreate, token])

  return (
    <div className={styles.container}>
      {isAllowed && (
        <Fragment>
          <h1>New Token</h1>
          <div className={styles.fieldsRow}>
            <div className={styles.field}>
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
              <Button onClick={() => setToken({ name: '', description: '' } as any)}>Clear</Button>
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
            <div className={styles.field}>
              <label className={styles.label} htmlFor="new-token-description">
                Description
              </label>
              <textarea
                id="new-token-description"
                value={token?.description}
                className={styles.editor}
                onChange={(e) => setToken({ ...token, description: e.target.value })}
              />
              <Button className={styles.createBtn} disabled={isSaving} onClick={create}>
                {isSaving ? <Spinner size="tiny"></Spinner> : 'Create New Token'}
              </Button>
            </div>
          </div>
          {isError && (
            <div>
              <td className={styles.cellNoData}>
                <div className={styles.content}>Ups, something went wrong. 🙈</div>
              </td>
            </div>
          )}
        </Fragment>
      )}
    </div>
  )
}

export default AccessTokenCreate
