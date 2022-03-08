import { useCallback, useMemo } from 'react'
import { AsyncReducerStatus } from 'lib/async-slice'
import {
  Button,
  Checkbox,
  InputText,
  Select,
  SelectOption,
} from '@globalfishingwatch/ui-components'
import { useUserAdditionalInformation } from 'features/user/user.hooks'
import styles from './user-additional-fields.module.css'

/* eslint-disable-next-line */
export interface UserAdditionalFieldsProps {}

export function UserAdditionalFields(props: UserAdditionalFieldsProps) {
  const { setUserAdditionalInformation, status, update, userAdditionalInformation } =
    useUserAdditionalInformation()

  const INTENDED_USE_OPTIONS: SelectOption[] = useMemo(
    () => [
      {
        id: 'commercial',
        label: 'Commercial',
      },
      {
        id: 'non-commercial',
        label: 'Non Commercial',
      },
    ],
    []
  )

  const selectedIntendedUse = useMemo(
    () => INTENDED_USE_OPTIONS.find(({ id }) => userAdditionalInformation.intendedUse === id),
    [INTENDED_USE_OPTIONS, userAdditionalInformation.intendedUse]
  )

  const onSelectIntendedUse = useCallback(
    (option: SelectOption) => {
      setUserAdditionalInformation({ ...userAdditionalInformation, intendedUse: option.id })
    },
    [setUserAdditionalInformation, userAdditionalInformation]
  )
  const onRemoveIntendedUse = useCallback(
    (option: SelectOption) => {
      setUserAdditionalInformation({ ...userAdditionalInformation, intendedUse: null })
    },
    [setUserAdditionalInformation, userAdditionalInformation]
  )

  const termsAccepted = useMemo(
    () => !!userAdditionalInformation?.apiTerms,
    [userAdditionalInformation?.apiTerms]
  )
  return (
    <div className={styles.fieldsWrapper}>
      <div className={styles.field}>
        <Select
          label="Intended use (*) (*)"
          options={INTENDED_USE_OPTIONS}
          onSelect={onSelectIntendedUse}
          onRemove={onRemoveIntendedUse}
          className={styles.select}
          selectedOption={selectedIntendedUse}
        />
      </div>
      <div className={styles.field}>
        <InputText
          id="whoEndUsers"
          label="Who are your end users? (*)"
          type={'text'}
          maxLength={500}
          value={userAdditionalInformation.whoEndUsers}
          className={styles.input}
          onChange={(e) =>
            setUserAdditionalInformation({
              ...userAdditionalInformation,
              whoEndUsers: e.target.value,
            })
          }
        />
      </div>
      <div className={styles.field}>
        <InputText
          id="problemToResolve"
          label="What problem are you trying to solve? (*)"
          type={'text'}
          maxLength={500}
          value={userAdditionalInformation.problemToResolve}
          className={styles.input}
          onChange={(e) =>
            setUserAdditionalInformation({
              ...userAdditionalInformation,
              problemToResolve: e.target.value,
            })
          }
        />
      </div>
      <div className={styles.field}>
        <InputText
          id="pullingDataOtherAPIS"
          label="Are you pulling data from APIs from other organizations?"
          type={'text'}
          maxLength={500}
          value={userAdditionalInformation.pullingDataOtherAPIS}
          className={styles.input}
          onChange={(e) =>
            setUserAdditionalInformation({
              ...userAdditionalInformation,
              pullingDataOtherAPIS: e.target.value,
            })
          }
        />
      </div>
      <div className={styles.field}>
        <Checkbox
          label="I agree to the Global Fishing Watch API Terms of Use and Attribution. If I am
                registering for use by an organization, I represent that I have the authority to
                bind that organization to these terms."
          labelClassname={styles.label}
          className={styles.checkbox}
          containerClassName={styles.checkboxContainer}
          active={termsAccepted}
          onClick={() =>
            setUserAdditionalInformation({
              ...userAdditionalInformation,
              apiTerms: termsAccepted ? null : new Date().toISOString(),
            })
          }
        />
      </div>
      <div className={styles.field}>
        <Button
          onClick={update}
          loading={status === AsyncReducerStatus.LoadingUpdate}
          className={styles.button}
          disabled={!termsAccepted}
          tooltip={termsAccepted ? '' : 'You must accept the terms to use our APIs'}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}

export default UserAdditionalFields
