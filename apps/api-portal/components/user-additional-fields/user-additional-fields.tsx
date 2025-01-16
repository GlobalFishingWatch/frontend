import type { MouseEventHandler } from 'react';
import { Fragment, useCallback, useEffect,useMemo, useState } from 'react'
import type { FieldValidationError } from 'lib/types'
import _ from 'lodash'
import Link from 'next/link'

import type {
  UserApiAdditionalInformation} from '@globalfishingwatch/api-types';
import {
  USER_APPLICATION_INTENDED_USES,
} from '@globalfishingwatch/api-types'
import type {
  SelectOption} from '@globalfishingwatch/ui-components';
import {
  Button,
  Checkbox,
  InputText,
  Select,
  Spinner,
} from '@globalfishingwatch/ui-components'

import useUser, { useUpdateUserAdditionalInformation } from 'features/user/user'

import styles from './user-additional-fields.module.css'

/* eslint-disable-next-line */
export interface UserAdditionalFieldsProps {}

export function UserAdditionalFields(props: UserAdditionalFieldsProps) {
  const { data: user, isLoading } = useUser()
  const { mutate, isLoading: isUpdating, isSuccess, isError } = useUpdateUserAdditionalInformation()

  const defaultUserAdditionalInformation: UserApiAdditionalInformation = {
    apiTerms: user?.apiTerms,
    intendedUse: user?.intendedUse,
    problemToResolve: user?.problemToResolve,
    pullingDataOtherAPIS: user?.pullingDataOtherAPIS,
    whoEndUsers: user?.whoEndUsers,
  }

  const [userAdditionalInformation, setUserAdditionalInformation] =
    useState<UserApiAdditionalInformation | null>(defaultUserAdditionalInformation)

  const [termsOfUseOpened, setTermsOfUseOpened] = useState(false)
  const onTermsOfUseClick: MouseEventHandler = useCallback((event) => {
    setTermsOfUseOpened(true)
  }, [])
  const error = useMemo(() => {
    const errors: FieldValidationError<UserApiAdditionalInformation> = {}
    const { apiTerms, intendedUse, problemToResolve, whoEndUsers } =
      userAdditionalInformation || ({} as UserApiAdditionalInformation)

    if (!intendedUse || !USER_APPLICATION_INTENDED_USES.includes(intendedUse as any)) {
      errors.intendedUse = 'Intended Use is required'
    }
    if (intendedUse === 'commercial') {
      errors.intendedUse = (
        <Fragment>
          For the moment we only allow API for non commercial purposes, if you are interested in a
          commercial option please contact us at{' '}
          <Link href={`mailto:apis@globalfishingwatch.org`}>apis@globalfishingwatch.org</Link>.
        </Fragment>
      )
    }
    if (!whoEndUsers) {
      errors.whoEndUsers = 'Who are your end users is required'
    }
    if (!problemToResolve) {
      errors.problemToResolve = 'Problems to solve is required'
    }
    if (!apiTerms) {
      errors.apiTerms = 'API terms of use and attribution must be accepted.'
    }
    return errors
  }, [userAdditionalInformation])

  const valid = useMemo(() => Object.keys(error).length === 0, [error])

  const INTENDED_USE_OPTIONS: SelectOption[] = useMemo(
    () =>
      USER_APPLICATION_INTENDED_USES.map((item) => ({
        id: item,
        label: _.startCase(item),
      })),
    []
  )

  const selectedIntendedUse = useMemo(
    () => INTENDED_USE_OPTIONS.find(({ id }) => userAdditionalInformation?.intendedUse === id),
    [INTENDED_USE_OPTIONS, userAdditionalInformation?.intendedUse]
  )

  const onSelectIntendedUse = useCallback(
    (option: SelectOption) => {
      setUserAdditionalInformation({ ...userAdditionalInformation, intendedUse: option.id })
    },
    [setUserAdditionalInformation, userAdditionalInformation]
  )
  const onRemoveIntendedUse = useCallback(
    (option: SelectOption) => {
      setUserAdditionalInformation({ ...userAdditionalInformation, intendedUse: undefined })
    },
    [setUserAdditionalInformation, userAdditionalInformation]
  )

  const termsAccepted = useMemo(
    () => !!userAdditionalInformation?.apiTerms,
    [userAdditionalInformation?.apiTerms]
  )

  const onToggleAcceptTOU: MouseEventHandler = useCallback(
    (event) => {
      if (!termsOfUseOpened) {
        window.alert('Please open the Terms of Use and Attribution first')
        event.preventDefault()
      } else {
        setUserAdditionalInformation({
          ...userAdditionalInformation,
          apiTerms: termsAccepted ? undefined : new Date().toISOString(),
        })
      }
    },
    [termsAccepted, termsOfUseOpened, userAdditionalInformation]
  )

  if (isLoading) return <Spinner></Spinner>

  return (
    <div className={styles.fieldsWrapper}>
      <div className={styles.field}>
        <Select
          label="Intended use (*)"
          options={INTENDED_USE_OPTIONS}
          onSelect={onSelectIntendedUse}
          onRemove={onRemoveIntendedUse}
          className={styles.select}
          selectedOption={selectedIntendedUse}
        />
        {!!selectedIntendedUse && !!error.intendedUse && (
          <div className={styles.validationErrorMessage}>{error.intendedUse}</div>
        )}
      </div>
      <div className={styles.field}>
        <InputText
          id="whoEndUsers"
          label="Who are your end users? (*)"
          type={'text'}
          maxLength={500}
          value={userAdditionalInformation?.whoEndUsers ?? ''}
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
          value={userAdditionalInformation?.problemToResolve ?? ''}
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
          value={userAdditionalInformation?.pullingDataOtherAPIS ?? ''}
          className={styles.input}
          onChange={(e) =>
            setUserAdditionalInformation({
              ...userAdditionalInformation,
              pullingDataOtherAPIS: e.target.value,
            })
          }
        />
      </div>
      <div className={styles.fieldCheckbox}>
        <Checkbox
          labelClassname={styles.label}
          className={styles.checkbox}
          containerClassName={styles.checkboxContainer}
          active={termsAccepted}
          onClick={onToggleAcceptTOU}
        />
        <div className={styles.span}>
          I agree to the Global Fishing Watch API{' '}
          <a
            href="https://globalfishingwatch.org/our-apis/documentation#terms-of-use"
            onClick={onTermsOfUseClick}
            target={'_blank'}
            rel="noreferrer"
          >
            Terms of Use and Attribution
          </a>
          . If I am registering for use by an organization, I represent that I have the authority to
          bind that organization to these terms.
        </div>
      </div>
      <div className={styles.field}>
        <Button
          onClick={() => {
            if (userAdditionalInformation) {
              mutate(userAdditionalInformation)
            }
          }}
          loading={isUpdating}
          className={styles.button}
          disabled={!valid}
          tooltip={
            valid
              ? ''
              : !!selectedIntendedUse && !!error.intendedUse
              ? error.intendedUse
              : 'Complete the required fields (*) and accept the terms to Continue'
          }
        >
          Continue
        </Button>
        {isError && (
          <div className={styles.error}>Ups, something went wrong. 🙈. Please try again later.</div>
        )}
      </div>
    </div>
  )
}

export default UserAdditionalFields
