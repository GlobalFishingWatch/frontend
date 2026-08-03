import type { FocusEvent } from 'react'
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button as AriaButton } from 'react-aria-components/Button'
import { Disclosure, DisclosurePanel } from 'react-aria-components/Disclosure'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { Icon } from '@globalfishingwatch/ui-components/icon'
import { Spinner } from '@globalfishingwatch/ui-components/spinner'

import { IS_CHATBOT_ENABLED } from 'data/map/config'
import { useSidePanel } from 'features/_map/content-panel/contentPanel.hooks'
import { selectWorkspaceCategory } from 'features/_map/workspace/workspace.selectors'
import { selectIsGFWUser } from 'features/_user/selectors/user.selectors'
import UserButton from 'features/_user/UserButton'
import { CROWDIN_IN_CONTEXT_LANG } from 'features/i18n/i18n.config'
import { useLanguageOptions } from 'features/i18n/language.hooks'
import { CrowdinScripts } from 'features/i18n/LanguageToggle'
import type { NavItem } from 'features/nav/nav.config'
import {
  getPlatformBottomSections,
  getPlatformNavSections,
  isRouted,
} from 'features/nav/nav.config'
import { useIsNavItemActive, useNavLinkContext, useOpenFeedbackModal } from 'features/nav/nav.hooks'
import { getNavLinkProps, NavLink } from 'features/nav/nav.links'
import { selectIsUserLocation, selectIsWorkspacesListLocation } from 'router/routes.selectors'

import styles from './PlatformNav.module.css'

const HOVER_INTENT_MS = 300

/**
 * The platform rail: a strip of icons that expands into a labelled flyout, with sections that hold
 * subsections. [[LegacyNav]] is the pre-platform nav — a flat icon rail with none of this.
 *
 * Two pieces of state, and only two:
 *  - `railExpanded` — is the flyout open. Owned here rather than by CSS `:hover`, so that everything
 *    derived from it (which panels are reachable, `aria-expanded`, the chevron) agrees with what is
 *    on screen. CSS reads the `.expanded` class.
 *  - `openSectionId` — which section is unfolded. `''` means the user closed everything; `null` means
 *    they have not chosen, so the section matching the current route unfolds.
 *
 * Panel visibility, focusability and height animation come from react-aria's Disclosure: it sets
 * `hidden="until-found"` when collapsed and publishes `--disclosure-panel-height` for the CSS
 * transition. Nothing here hand-rolls `inert` or `aria-expanded`.
 */
function PlatformNav() {
  const { t } = useTranslation()
  const navSections = useMemo(() => getPlatformNavSections(t), [t])
  const navLinkContext = useNavLinkContext()
  const isItemActive = useIsNavItemActive()
  const locationCategory = useSelector(selectWorkspaceCategory)
  const isWorkspacesListLocation = useSelector(selectIsWorkspacesListLocation)
  const isUserLocation = useSelector(selectIsUserLocation)
  const isGFWUser = useSelector(selectIsGFWUser)
  const { openSidePanel } = useSidePanel()
  const openFeedbackModal = useOpenFeedbackModal()
  const {
    options: languageOptions,
    toggleLanguage,
    currentLanguage,
    isLoading: isLanguageLoading,
  } = useLanguageOptions()

  const [railExpanded, setRailExpanded] = useState(false)
  const [openSectionId, setOpenSectionId] = useState<string | null>(null)

  const hoverOpenTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)
  const cancelHoverOpen = useCallback(() => clearTimeout(hoverOpenTimeout.current), [])
  const openSectionOnHover = useCallback((id: string) => {
    clearTimeout(hoverOpenTimeout.current)
    hoverOpenTimeout.current = setTimeout(() => setOpenSectionId(id), HOVER_INTENT_MS)
  }, [])
  useEffect(() => () => clearTimeout(hoverOpenTimeout.current), [])

  // ponytail: no pointerType filter, so a touch tap expands the rail and it stays expanded until the
  // next tap outside — matching what sticky `:hover` did before. Gate on 'mouse' once touch gets a
  // deliberate design.
  const expandRail = useCallback(() => setRailExpanded(true), [])

  const collapseRail = useCallback(() => {
    cancelHoverOpen()
    setRailExpanded(false)
    setOpenSectionId(null)
  }, [cancelHoverOpen])

  // Only collapse when focus actually leaves the rail, not when it moves between rows inside it.
  const onBlur = useCallback(
    (event: FocusEvent<HTMLElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget)) {
        collapseRail()
      }
    },
    [collapseRail]
  )

  /** Navigating or acting closes the flyout; toggling a section must not. */
  const onNavigate = useCallback(() => {
    cancelHoverOpen()
    setRailExpanded(false)
    setOpenSectionId('')
  }, [cancelHoverOpen])

  const bottomSections = useMemo(() => {
    const sections = getPlatformBottomSections(t, {
      onAssistantClick: () => openSidePanel({ type: 'chat' }),
      onLogIssueClick: openFeedbackModal,
      language: {
        options: languageOptions,
        currentLanguage,
        isLoading: isLanguageLoading,
        toggleLanguage,
      },
    })
    return [
      ...(IS_CHATBOT_ENABLED && isGFWUser ? [sections.assistant] : []),
      sections.feedback,
      sections.language,
      sections.settings,
    ]
  }, [
    isGFWUser,
    languageOptions,
    currentLanguage,
    isLanguageLoading,
    toggleLanguage,
    openFeedbackModal,
    openSidePanel,
    t,
  ])

  // Only a section whose *subsection* matches the current route unfolds on its own.
  const routeSectionId = [...navSections, ...bottomSections].find((section) =>
    section.subsections?.some((subsection) =>
      subsection.params?.category
        ? isWorkspacesListLocation && locationCategory === subsection.params.category
        : isItemActive(subsection)
    )
  )?.id
  const isSectionExpanded = (id: string) => railExpanded && (openSectionId ?? routeSectionId) === id

  const renderIconAndLabel = (item: NavItem) => (
    <Fragment>
      {item.icon && (
        <span data-nav-icon>
          {item.loading ? <Spinner size="small" inline /> : <Icon icon={item.icon} />}
        </span>
      )}
      <span data-nav-label>{item.label}</span>
    </Fragment>
  )

  const renderItemContent = (item: NavItem) => {
    if (item.href) {
      return (
        <a
          className={styles.tabContent}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          onClick={onNavigate}
          data-testid={item.testId}
        >
          {renderIconAndLabel(item)}
        </a>
      )
    }

    if (item.onClick) {
      return (
        <button
          type="button"
          className={styles.tabContent}
          onClick={() => {
            item.onClick?.()
            onNavigate()
          }}
          data-testid={item.testId}
        >
          {renderIconAndLabel(item)}
        </button>
      )
    }

    // `plannedTo` rows: the label documents where the section will go once its route exists.
    if (!isRouted(item)) {
      return (
        <span className={cx(styles.tabContent, styles.disabled)} aria-disabled>
          {renderIconAndLabel(item)}
        </span>
      )
    }

    const { onClick, ...linkProps } = getNavLinkProps(item, navLinkContext)
    return (
      <NavLink
        className={styles.tabContent}
        {...linkProps}
        onClick={() => {
          onClick?.()
          onNavigate()
        }}
      >
        {renderIconAndLabel(item)}
      </NavLink>
    )
  }

  const renderRow = (item: NavItem, { isSubsection = false } = {}) => (
    <div
      data-testid={`link-${item.id}`}
      className={cx(styles.tab, {
        [styles.subsectionTab]: isSubsection,
        [styles.current]: isItemActive(item),
      })}
    >
      {renderItemContent(item)}
    </div>
  )

  const renderSection = (section: NavItem) => {
    if (!section.subsections) {
      return (
        <li key={section.id} className={styles.section}>
          {renderRow(section)}
        </li>
      )
    }

    const expanded = isSectionExpanded(section.id)
    const chevron = <Icon icon={expanded ? 'arrow-top' : 'arrow-down'} />
    return (
      <li
        key={section.id}
        className={styles.section}
        onMouseEnter={() => openSectionOnHover(section.id)}
        onMouseLeave={cancelHoverOpen}
      >
        <Disclosure
          isExpanded={expanded}
          onExpandedChange={(isOpen) => {
            setOpenSectionId(isOpen ? section.id : '')
            expandRail()
          }}
        >
          <div
            className={cx(styles.tab, { [styles.current]: isItemActive(section) })}
            data-testid={`link-${section.id}`}
          >
            {isRouted(section) ? (
              <Fragment>
                {renderItemContent(section)}
                <AriaButton
                  slot="trigger"
                  className={styles.sectionToggle}
                  data-testid={`toggle-${section.id}`}
                >
                  {chevron}
                </AriaButton>
              </Fragment>
            ) : (
              <AriaButton slot="trigger" className={styles.tabContent}>
                {renderIconAndLabel(section)}
                <span className={styles.sectionToggle} data-testid={`toggle-${section.id}`}>
                  {chevron}
                </span>
              </AriaButton>
            )}
          </div>
          <DisclosurePanel className={styles.subsectionsWrapper}>
            <ul className={styles.subsections}>
              {section.subsections.map((subsection) => (
                <li key={subsection.id}>{renderRow(subsection, { isSubsection: true })}</li>
              ))}
            </ul>
          </DisclosurePanel>
        </Disclosure>
      </li>
    )
  }

  return (
    <nav
      className={cx('print-hidden', styles.PlatformNav, { [styles.expanded]: railExpanded })}
      onPointerEnter={expandRail}
      onPointerLeave={collapseRail}
      onFocus={expandRail}
      onBlur={onBlur}
    >
      <div className={styles.panel}>
        <ul className={styles.sections}>{navSections.map(renderSection)}</ul>
        <ul className={styles.bottom}>
          {bottomSections.map(renderSection)}
          <li className={cx(styles.tab, styles.user, { [styles.current]: isUserLocation })}>
            <UserButton className={styles.tabContent} withLabel />
          </li>
        </ul>
      </div>
      <CrowdinScripts enabled={currentLanguage === CROWDIN_IN_CONTEXT_LANG} />
    </nav>
  )
}

export default PlatformNav
