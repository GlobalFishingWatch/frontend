import { useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { Checkbox } from '@globalfishingwatch/ui-components/checkbox'
import { Icon } from '@globalfishingwatch/ui-components/icon'

import { IS_CHATBOT_ENABLED } from 'data/map/config'
import ContentHeader from 'features/_map/content-panel/ContentHeader'
import { getWelcomeCards } from 'features/_map/content-panel/welcome/welcome-panel.config'
import {
  useWelcomeCardActions,
  useWelcomePanelDismissed,
} from 'features/_map/content-panel/welcome/welcome-panel.hooks'
import { selectIsGFWUser } from 'features/_user/selectors/user.selectors'

import panelStyles from '../ContentPanel.module.css'
import styles from './WelcomePanel.module.css'

function WelcomePanel() {
  const { t } = useTranslation()
  const isGFWUser = useSelector(selectIsGFWUser)
  const [dismissed, setDismissed] = useWelcomePanelDismissed()
  const onCardClick = useWelcomeCardActions()

  const cards = useMemo(
    () =>
      getWelcomeCards(t).filter(
        (card) => card.id !== 'assistant' || (IS_CHATBOT_ENABLED && Boolean(isGFWUser))
      ),
    [t, isGFWUser]
  )

  const [activeCardId, setActiveCardId] = useState(cards[0]!.id)

  return (
    <div className={cx(panelStyles.container, styles.container)}>
      <div className={panelStyles.header}>
        <ContentHeader title={t((t) => t.onboarding.header, { defaultValue: 'Welcome' })} />
      </div>
      <div className={cx(panelStyles.scrollContainer, styles.content)}>
        <h2 className={styles.title}>
          {t((t) => t.onboarding.title, { defaultValue: 'What would you like to do today?' })}
        </h2>
        <p className={styles.intro}>
          <Trans i18nKey={(t) => t.onboarding.intro}>
            We use satellite signals and machine learning to make activity at sea visible. Pick a
            way in or learn more{' '}
            <button type="button" className={styles.link} onClick={() => onCardClick('userGuide')}>
              here
            </button>
            .
          </Trans>
        </p>
        <ul className={styles.cards}>
          {cards.map((card) => {
            const isActive = card.id === activeCardId
            return (
              <li key={card.id}>
                <button
                  type="button"
                  className={cx('card', styles.card, { [styles.cardActive]: isActive })}
                  onClick={() => onCardClick(card.id)}
                  onMouseEnter={() => setActiveCardId(card.id)}
                  onFocus={() => setActiveCardId(card.id)}
                  data-testid={`onboarding-card-${card.id}`}
                >
                  {isActive && (
                    <span className={styles.imageSlot}>
                      {card.image && <img src={card.image} alt="" />}
                    </span>
                  )}
                  <span className={styles.cardBody}>
                    <span className={styles.cardTitle}>
                      <Icon icon={card.icon} />
                      {card.title}
                    </span>
                    <span className={styles.cardDescription}>{card.description}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        <div className={styles.dismiss}>
          <Checkbox
            active={dismissed}
            label={t((t) => t.common.welcomePopupDisable)}
            labelClassname={styles.dismissLabel}
            onClick={() => setDismissed(!dismissed)}
          />
        </div>
      </div>
    </div>
  )
}

export default WelcomePanel
