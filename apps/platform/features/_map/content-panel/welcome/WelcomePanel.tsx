import { useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { Checkbox } from '@globalfishingwatch/ui-components/checkbox'
import type { IconType } from '@globalfishingwatch/ui-components/icon'
import { Icon } from '@globalfishingwatch/ui-components/icon'

import { IS_CHATBOT_ENABLED, PATH_BASENAME } from 'data/map/config'
import ContentHeader from 'features/_map/content-panel/ContentHeader'
import {
  useWelcomeCardActions,
  useWelcomePanelDismissed,
} from 'features/_map/content-panel/welcome/welcome-panel.hooks'
import { selectIsGFWUser } from 'features/_user/selectors/user.selectors'

import panelStyles from '../ContentPanel.module.css'
import styles from './WelcomePanel.module.css'

type WelcomeCard = {
  id: string
  icon: IconType
  title: string
  description: string
  /**
   * Shown while the card is the active one. Served from `public/images/welcome-panel/`, so it needs
   * the router basename. Cards without one yet keep the empty slot.
   */
  image?: string
  onClick: () => void
}

function WelcomePanel() {
  const { t } = useTranslation()
  const isGFWUser = useSelector(selectIsGFWUser)
  const [dismissed, setDismissed] = useWelcomePanelDismissed()
  const { onSearchVesselClick, onAreaReportClick, onUserGuideClick, onAssistantClick } =
    useWelcomeCardActions()

  const cards: WelcomeCard[] = useMemo(
    () => [
      {
        id: 'searchVessel',
        icon: 'vessel-section',
        title: t((t) => t.onboarding.searchVessel.title, { defaultValue: 'Search for a vessel' }),
        description: t((t) => t.onboarding.searchVessel.description, {
          defaultValue:
            "Find one of 400,000+ vessels by name, MMSI, IMO, or callsign. See where it's been, when, and with whom.",
        }),
        image: `${PATH_BASENAME}/images/welcome-panel/vessel-search.jpg`,
        onClick: onSearchVesselClick,
      },
      {
        id: 'areaReport',
        icon: 'areas',
        title: t((t) => t.onboarding.areaReport.title, { defaultValue: 'Run a report on an area' }),
        description: t((t) => t.onboarding.areaReport.description, {
          defaultValue:
            'Pick an MPA, EEZ, or draw your own region. Get a report on vessels present, encounters, port visits, and downloadable activity data.',
        }),
        image: `${PATH_BASENAME}/images/welcome-panel/area-report.jpg`,
        onClick: onAreaReportClick,
      },
      {
        id: 'userGuide',
        icon: 'help',
        title: t((t) => t.onboarding.userGuide.title, {
          defaultValue: 'Learn how to use the tools',
        }),
        description: t((t) => t.onboarding.userGuide.description, {
          defaultValue:
            'We support the understanding, visualization and analysis needs of governments, researchers, NGOs, journalists and more.',
        }),
        image: `${PATH_BASENAME}/images/welcome-panel/user-guide.jpg`,
        onClick: onUserGuideClick,
      },
      // The chat panel itself is behind IS_CHATBOT_ENABLED, so the card follows it — same gate as
      // HelpHub and the platform nav assistant row.
      ...(IS_CHATBOT_ENABLED && isGFWUser
        ? [
            {
              id: 'assistant',
              icon: 'magic' as IconType,
              title: t((t) => t.onboarding.assistant.title, {
                defaultValue: 'Chat with the analysis copilot',
              }),
              description: t((t) => t.onboarding.assistant.description, {
                defaultValue:
                  'Tell the GFW AI agent what you would like to analyse and it will customise the view for your needs.',
              }),
              image: `${PATH_BASENAME}/images/welcome-panel/chat.jpg`,
              onClick: onAssistantClick,
            },
          ]
        : []),
    ],
    [t, isGFWUser, onSearchVesselClick, onAreaReportClick, onUserGuideClick, onAssistantClick]
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
            <button type="button" className={styles.link} onClick={onUserGuideClick}>
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
                  onClick={card.onClick}
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
