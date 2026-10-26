import { Fragment, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { startCase } from 'es-toolkit'

import type { UserApiAdditionalInformation } from '@globalfishingwatch/api-types'
import { USER_APPLICATION_INTENDED_USES } from '@globalfishingwatch/api-types'
import { Button } from '@globalfishingwatch/ui-components/button'
import { Checkbox } from '@globalfishingwatch/ui-components/checkbox'
import { InputText } from '@globalfishingwatch/ui-components/input-text'
import type { SelectOption } from '@globalfishingwatch/ui-components/select'
import { Select } from '@globalfishingwatch/ui-components/select'

import { selectUserData } from 'features/_user/selectors/user.selectors'
import { updateUserApiAdditionalInfoThunk } from 'features/_user/user.slice'
import { useAppDispatch } from 'features/app/app.hooks'

import ApiTokensHeader from './ApiTokensHeader'

import styles from './ApiTokensSignup.module.css'

const TERMS_OF_USE_URL = 'https://globalfishingwatch.org/our-apis/documentation#terms-of-use'

const INTENDED_USE_OPTIONS: SelectOption[] = USER_APPLICATION_INTENDED_USES.map((id) => ({
  id,
  label: startCase(id),
}))

type TextField = 'whoEndUsers' | 'problemToResolve' | 'pullingDataOtherAPIS'

function ApiTokensSignup() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const user = useSelector(selectUserData)
  const [info, setInfo] = useState<UserApiAdditionalInformation>({
    apiTerms: user?.apiTerms,
    intendedUse: user?.intendedUse,
    problemToResolve: user?.problemToResolve,
    pullingDataOtherAPIS: user?.pullingDataOtherAPIS,
    whoEndUsers: user?.whoEndUsers,
  })
  const [termsOfUseOpened, setTermsOfUseOpened] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle')

  const isCommercial = info.intendedUse === 'commercial'
  const valid =
    !!info.intendedUse &&
    !isCommercial &&
    !!info.whoEndUsers &&
    !!info.problemToResolve &&
    !!info.apiTerms

  const selectedIntendedUse = INTENDED_USE_OPTIONS.find(({ id }) => id === info.intendedUse)

  const onToggleAcceptTOU = (event: React.MouseEvent) => {
    if (!termsOfUseOpened) {
      window.alert(t((t) => t.apiTokens.openTermsFirst))
      event.preventDefault()
      return
    }
    setInfo({ ...info, apiTerms: info.apiTerms ? undefined : new Date().toISOString() })
  }

  const onSubmit = async () => {
    setStatus('saving')
    try {
      // Refreshes the store user, which makes the gate render the page instead of this form
      await dispatch(updateUserApiAdditionalInfoThunk(info)).unwrap()
    } catch {
      setStatus('error')
    }
  }

  const renderTextField = (field: TextField, label: string) => (
    <InputText
      id={field}
      label={label}
      maxLength={500}
      value={info[field] ?? ''}
      className={styles.field}
      onChange={(e) => setInfo({ ...info, [field]: e.target.value })}
    />
  )

  const commercialMessage = (
    <Trans i18nKey={(t) => t.apiTokens.commercialNotAllowed}>
      {
        'For the moment we only allow API for non commercial purposes, if you are interested in a commercial option please contact us at '
      }
      <a href="mailto:apis@globalfishingwatch.org">apis@globalfishingwatch.org</a>
    </Trans>
  )

  return (
    <Fragment>
      <ApiTokensHeader description={t((t) => t.apiTokens.signupDescription)} />
      <div className={styles.fieldsWrapper}>
        <div className={styles.field}>
          <Select
            label={`${t((t) => t.apiTokens.intendedUse)} (*)`}
            options={INTENDED_USE_OPTIONS}
            selectedOption={selectedIntendedUse}
            onSelect={(option) => setInfo({ ...info, intendedUse: option.id })}
            onRemove={() => setInfo({ ...info, intendedUse: undefined })}
          />
          {isCommercial && <p className={styles.validationErrorMessage}>{commercialMessage}</p>}
        </div>
        {renderTextField('whoEndUsers', `${t((t) => t.apiTokens.whoEndUsers)} (*)`)}
        {renderTextField('problemToResolve', `${t((t) => t.apiTokens.problemToResolve)} (*)`)}
        {renderTextField(
          'pullingDataOtherAPIS',
          t((t) => t.apiTokens.pullingDataOtherAPIS)
        )}
        <div className={styles.fieldCheckbox}>
          <Checkbox
            containerClassName={styles.checkboxContainer}
            active={!!info.apiTerms}
            onClick={onToggleAcceptTOU}
          />
          <span>
            <Trans i18nKey={(t) => t.apiTokens.acceptTerms}>
              {'I agree to the Global Fishing Watch API '}
              <a
                href={TERMS_OF_USE_URL}
                onClick={() => setTermsOfUseOpened(true)}
                target="_blank"
                rel="noreferrer"
              >
                Terms of Use and Attribution
              </a>
              {
                '. If I am registering for use by an organization, I represent that I have the authority to bind that organization to these terms.'
              }
            </Trans>
          </span>
        </div>
        <div className={styles.field}>
          <Button
            onClick={onSubmit}
            loading={status === 'saving'}
            className={styles.button}
            disabled={!valid}
            tooltip={
              valid
                ? undefined
                : isCommercial
                  ? commercialMessage
                  : t((t) => t.apiTokens.completeRequiredFields)
            }
          >
            {t((t) => t.common.continue)}
          </Button>
          {status === 'error' && <p className={styles.error}>{t((t) => t.errors.genericShort)}</p>}
        </div>
      </div>
    </Fragment>
  )
}

export default ApiTokensSignup
