import type { MouseEvent, ReactNode } from 'react'
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { Icon } from '@globalfishingwatch/ui-components/icon'
import { IconButton } from '@globalfishingwatch/ui-components/icon-button'
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

import styles from './MainNav.module.css'

const HOVER_INTENT_MS = 300

/**
 * The platform rail: a collapsed strip of icons that expands into a labelled flyout on hover or
 * keyboard focus, with sections that can hold subsections. The pre-platform nav is a separate
 * component ([[LegacyNav]]) — it is a flat icon rail with none of this machinery.
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

  // '' is "the user closed everything"; null is "nothing chosen yet", which falls back to the
  // section matching the current route. They are not interchangeable — see `expandedSectionId`.
  const [openSectionId, setOpenSectionId] = useState<string | null>(null)
  // Suppresses the flyout after a click, until the pointer leaves the rail.
  const [hoverExpandDisabled, setHoverExpandDisabled] = useState(false)
  // Capture phase, so it runs before the row's own handler. Rows that only expand a section are
  // exempt: collapsing the flyout on the very click meant to open it would swallow the toggle.
  const onNavClickCapture = useCallback((event: MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest(`.${styles.sectionToggle}, [data-nav-toggle]`)) return
    setHoverExpandDisabled(true)
    setOpenSectionId('')
  }, [])
  const allowHoverExpand = useCallback(() => setHoverExpandDisabled(false), [])

  const hoverOpenTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)
  const cancelHoverOpen = useCallback(() => clearTimeout(hoverOpenTimeout.current), [])
  const openSectionOnHover = useCallback((id: string) => {
    clearTimeout(hoverOpenTimeout.current)
    hoverOpenTimeout.current = setTimeout(() => setOpenSectionId(id), HOVER_INTENT_MS)
  }, [])
  useEffect(() => () => clearTimeout(hoverOpenTimeout.current), [])

  const onRailLeave = useCallback(() => {
    cancelHoverOpen()
    setOpenSectionId(null)
    allowHoverExpand()
  }, [cancelHoverOpen, allowHoverExpand])

  const bottomSections = useMemo(
    () =>
      getPlatformBottomSections(t, {
        onAssistantClick: () => openSidePanel({ type: 'chat' }),
        onLogIssueClick: openFeedbackModal,
      }),
    [t, openSidePanel, openFeedbackModal]
  )

  const languageSection: NavItem = useMemo(
    () => ({
      id: 'language',
      icon: 'language',
      label:
        languageOptions.find(({ id }) => id === currentLanguage)?.label ?? t((t) => t.nav.language),
      loading: isLanguageLoading,
      subsections: languageOptions
        .filter(({ id }) => id !== currentLanguage)
        .map(({ id, label, testId }) => ({
          id: `language-${id}`,
          label,
          testId,
          onClick: () => !isLanguageLoading && toggleLanguage(id),
        })),
    }),
    [languageOptions, currentLanguage, isLanguageLoading, toggleLanguage, t]
  )

  // Only a section whose *subsection* matches the current route opens on its own.
  const activeSectionId = navSections.find((section) =>
    section.subsections?.some((subsection) =>
      subsection.params?.category
        ? isWorkspacesListLocation && locationCategory === subsection.params.category
        : isItemActive(subsection)
    )
  )?.id
  const expandedSectionId = openSectionId ?? activeSectionId

  const renderItemContent = (item: NavItem) => {
    const content = (
      <Fragment>
        {item.icon && (
          <span data-nav-icon>
            {item.loading ? <Spinner size="small" inline /> : <Icon icon={item.icon} />}
          </span>
        )}
        <span data-nav-label>{item.label}</span>
      </Fragment>
    )

    if (item.href) {
      return (
        <a
          className={styles.tabContent}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          data-testid={item.testId}
        >
          {content}
        </a>
      )
    }

    if (item.onClick) {
      return (
        <button
          type="button"
          className={styles.tabContent}
          onClick={item.onClick}
          data-testid={item.testId}
        >
          {content}
        </button>
      )
    }

    if (item.subsections && !isRouted(item)) {
      const expanded = expandedSectionId === item.id && !hoverExpandDisabled
      return (
        <button
          type="button"
          data-nav-toggle
          aria-expanded={expanded}
          className={styles.tabContent}
          onClick={() => {
            setOpenSectionId(expanded ? '' : item.id)
            allowHoverExpand()
          }}
        >
          {content}
        </button>
      )
    }

    // `plannedTo` rows: the label documents where the section will go once its route exists.
    if (!isRouted(item)) {
      return (
        <span className={cx(styles.tabContent, styles.disabled)} aria-disabled>
          {content}
        </span>
      )
    }

    return (
      <NavLink className={styles.tabContent} {...getNavLinkProps(item, navLinkContext)}>
        {content}
      </NavLink>
    )
  }

  const renderRow = (
    item: NavItem,
    { toggle, isSubsection }: { toggle?: ReactNode; isSubsection?: boolean } = {}
  ) => (
    <div
      data-testid={`link-${item.id}`}
      className={cx(styles.tab, {
        [styles.subsectionTab]: isSubsection,
        [styles.current]: isItemActive(item),
      })}
    >
      {renderItemContent(item)}
      {toggle}
    </div>
  )

  const renderSection = (section: NavItem) => {
    const expanded = expandedSectionId === section.id
    return (
      <li
        key={section.id}
        className={styles.section}
        onMouseEnter={() => openSectionOnHover(section.id)}
        onMouseLeave={cancelHoverOpen}
      >
        {renderRow(section, {
          toggle: section.subsections && (
            <IconButton
              className={cx(styles.sectionToggle, {
                [styles.sectionToggleOpen]: expanded,
              })}
              icon={expanded ? 'arrow-top' : 'arrow-down'}
              size="small"
              testId={`toggle-${section.id}`}
              onClick={() => {
                setOpenSectionId(expanded ? '' : section.id)
                allowHoverExpand()
              }}
            />
          ),
        })}
        {section.subsections && (
          <div
            className={cx(styles.subsectionsWrapper, {
              [styles.subsectionsOpen]: expanded,
            })}
            // Visibility is CSS (`:not(.hoverExpandDisabled):hover`), so `expanded` alone would leave
            // links tabbable while the flyout is shut. Both conditions, or keyboard lands on nothing.
            inert={!expanded || hoverExpandDisabled}
          >
            <ul className={styles.subsections}>
              {section.subsections.map((subsection) => (
                <li key={subsection.id}>{renderRow(subsection, { isSubsection: true })}</li>
              ))}
            </ul>
          </div>
        )}
      </li>
    )
  }

  return (
    <nav
      className={cx('print-hidden', styles.MainNav, styles.platform, {
        [styles.hoverExpandDisabled]: hoverExpandDisabled,
      })}
      onClickCapture={onNavClickCapture}
      onMouseLeave={onRailLeave}
      onFocus={allowHoverExpand}
    >
      <div className={styles.panel}>
        <ul className={styles.sections}>{navSections.map(renderSection)}</ul>
        <ul className={styles.bottom}>
          {IS_CHATBOT_ENABLED && isGFWUser && renderSection(bottomSections.assistant)}
          {renderSection(bottomSections.feedback)}
          {renderSection(languageSection)}
          <CrowdinScripts enabled={currentLanguage === CROWDIN_IN_CONTEXT_LANG} />
          {renderSection(bottomSections.settings)}
          <li className={cx(styles.tab, styles.user, { [styles.current]: isUserLocation })}>
            <UserButton className={styles.tabContent} withLabel />
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default PlatformNav
