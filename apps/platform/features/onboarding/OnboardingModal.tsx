import { useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { Button } from '@globalfishingwatch/ui-components/button'
import { Checkbox } from '@globalfishingwatch/ui-components/checkbox'
import { IconButton } from '@globalfishingwatch/ui-components/icon-button'
import { InputText } from '@globalfishingwatch/ui-components/input-text'
import { Logo } from '@globalfishingwatch/ui-components/logo'
import { Modal } from '@globalfishingwatch/ui-components/modal'

import { IS_CHATBOT_ENABLED } from 'data/map/config'
import LoginLink from 'features/_user/LoginLink'
import { selectIsGFWUser, selectIsGuestUser } from 'features/_user/selectors/user.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import LanguageToggle from 'features/i18n/LanguageToggle'
import { setModalOpen } from 'features/modals/modals.slice'
import { getCopilotExamples, getOnboardingCards } from 'features/onboarding/onboarding.config'
import {
  useOnboardingCardActions,
  useOnboardingCopilotPrompt,
  useOnboardingDismissed,
  useTypewriterPlaceholder,
} from 'features/onboarding/onboarding.hooks'
import { getIsBrowser } from 'utils/dom'

import styles from './OnboardingModal.module.css'

const ABOUT_THE_MAP_URL = 'https://globalfishingwatch.org/our-map/'

/** The public site pages have no Spanish route pattern — each has its own translated URL. */
function getTutorialsLink(language: string) {
  return language === 'es'
    ? 'https://globalfishingwatch.org/es/tutoriales/'
    : 'https://globalfishingwatch.org/tutorials'
}

function getFAQsLink(language: string) {
  return language === 'es'
    ? 'https://globalfishingwatch.org/es/ayuda-faqs/'
    : 'https://globalfishingwatch.org/help-faqs/'
}

function OnboardingModal() {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const isGFWUser = useSelector(selectIsGFWUser)
  const isGuestUser = useSelector(selectIsGuestUser)
  const [dismissed, setDismissed] = useOnboardingDismissed()
  const onCardClick = useOnboardingCardActions()
  const askCopilot = useOnboardingCopilotPrompt()
  const [query, setQuery] = useState('')
  const copilotExamples = useMemo(() => getCopilotExamples(t), [t])
  const copilotPlaceholder = useTypewriterPlaceholder(copilotExamples, Boolean(query))
  const copilotEnabled = IS_CHATBOT_ENABLED && Boolean(isGFWUser)

  const close = () => dispatch(setModalOpen({ id: 'onboarding', open: false }))

  return (
    <Modal
      isOpen
      shouldCloseOnEsc
      header={false}
      ariaLabel={t((t) => t.onboarding.header, { defaultValue: 'Welcome' })}
      className={styles.modal}
      contentClassName={styles.content}
      onClose={close}
    >
      <Logo className={styles.logo} />
      <h2 className={styles.title}>
        {t((t) => t.onboarding.title, { defaultValue: 'What would you like to do today?' })}
      </h2>
      <p className={styles.intro}>
        {/* `components` by index, not JSX children: the children's whitespace nodes shift the
            numbering the extractor wrote into the string, which silently drops the link. */}
        <Trans
          i18nKey={(t) => t.onboarding.intro}
          defaults="We use satellite signals and machine learning to make activity at sea visible. Pick a way in or <1>learn more</1>."
          components={{
            1: (
              // The text comes from the translation; this child only keeps the anchor accessible
              // when the string is missing.
              <a className={styles.link} href={ABOUT_THE_MAP_URL} target="_blank" rel="noreferrer">
                learn more
              </a>
            ),
          }}
        />
      </p>
      <ul className={styles.cards}>
        {getOnboardingCards(t).map((card) => (
          <li key={card.id}>
            <button
              type="button"
              className={cx('card', styles.card)}
              onClick={() => onCardClick(card.id)}
              data-testid={`onboarding-card-${card.id}`}
            >
              <span className={styles.cardImage}>
                <img src={card.image} alt="" />
              </span>
              <span className={styles.cardBody}>
                <span className={styles.cardTitle}>{card.title}</span>
                <span className={styles.cardDescription}>{card.description}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {copilotEnabled && (
        <form
          className={styles.copilot}
          onSubmit={(e) => {
            e.preventDefault()
            askCopilot(query)
          }}
        >
          <label className={styles.copilotLabel} htmlFor="onboarding-copilot-input">
            {t((t) => t.onboarding.copilotLabel, { defaultValue: 'What do you want to see?' })}
          </label>
          <div className={styles.copilotInput}>
            <InputText
              id="onboarding-copilot-input"
              testId="onboarding-copilot-input"
              value={query}
              placeholder={copilotPlaceholder}
              onChange={(e) => setQuery(e.target.value)}
            />
            {/* The only submit control: Enter, or a click on the icon inside the field. */}
            <IconButton
              icon="magic"
              htmlType="submit"
              size="small"
              className={styles.copilotSubmit}
              disabled={!query.trim()}
              testId="onboarding-copilot-submit"
            />
          </div>
        </form>
      )}
      {isGuestUser && (
        <div className={styles.loginBlock}>
          <p className={styles.intro}>
            {t((t) => t.onboarding.login, {
              defaultValue: 'Log in to get the most out of the platform (free, 2 minutes)',
            })}
          </p>
          <div className={styles.loginActions}>
            <Button asChild size="medium">
              <LoginLink loginSource="assistant">{t((t) => t.common.login)}</LoginLink>
            </Button>
            <a
              className={styles.link}
              href={GFWAPI.getRegisterUrl(getIsBrowser() ? window.location.toString() : '')}
            >
              {t((t) => t.onboarding.createAccount, { defaultValue: 'Create an account' })}
            </a>
          </div>
        </div>
      )}
      <footer className={styles.footer}>
        <ul className={styles.footerLinks}>
          <li>
            <a
              className={styles.link}
              href={getTutorialsLink(i18n.language)}
              target="_blank"
              rel="noreferrer"
            >
              {t((t) => t.common.tutorials)}
            </a>
          </li>
          <li>
            <a
              className={styles.link}
              href={getFAQsLink(i18n.language)}
              target="_blank"
              rel="noreferrer"
            >
              {t((t) => t.common.faq)}
            </a>
          </li>
        </ul>
        <div className={styles.footerActions}>
          <Checkbox
            active={dismissed}
            label={t((t) => t.common.welcomePopupDisable)}
            labelClassname={styles.dismissLabel}
            onClick={() => setDismissed(!dismissed)}
          />
          <LanguageToggle position="rightUp" />
        </div>
      </footer>
    </Modal>
  )
}

export default OnboardingModal
