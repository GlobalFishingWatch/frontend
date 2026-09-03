import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from '@tanstack/react-router'
import { useSetAtom } from 'jotai'

import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from '@platform/config/map/workspaces'

import {
  activeThreadAtom,
  newActiveThread,
  pendingPromptAtom,
} from 'features/_map/content-panel/chat/chat.atoms'
import { useSidePanel } from 'features/_map/content-panel/contentPanel.hooks'
import { setMapSearchOpenRequested } from 'features/_map/map/controls/map-controls.slice'
import { selectWorkspace } from 'features/_map/workspace/workspace.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import type { UserGuideSlug } from 'features/cms/loaders/user-guide.types'
import { findSectionForSlug } from 'features/help/userGuide.utils'
import { setModalOpen } from 'features/modals/modals.slice'
import type { OnboardingCardId } from 'features/onboarding/onboarding.config'
import { ROUTE_PATHS } from 'router/routes.utils'
import type { QueryParams } from 'types'

/** Which user guide article a slug points at, in `openSidePanel` shape. */
function getGuideTarget(slug: UserGuideSlug) {
  const match = findSectionForSlug(slug)
  return { id: match?.section, subcontentId: match?.subSection }
}

/**
 * What each onboarding card does: close the modal, perform the action, and show the guide article
 * explaining it in the content side panel.
 */
export function useOnboardingCardActions() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const workspace = useSelector(selectWorkspace)
  const { openSidePanel } = useSidePanel()

  const track = useCallback((action: string) => {
    trackEvent({ category: TrackCategory.HelpHints, action: `onboarding panel - ${action}` })
  }, [])

  const navigateWithGuide = useCallback(
    (to: string, slug: UserGuideSlug) => {
      const { id, subcontentId } = getGuideTarget(slug)
      router.navigate({
        to,
        params: {
          category: workspace?.category || DEFAULT_WORKSPACE_CATEGORY,
          workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
        },
        search: (prev: QueryParams): QueryParams => ({
          ...prev,
          sidePanelContent: 'userGuide',
          sidePanelId: id,
          sidePanelSubcontentId: subcontentId,
        }),
      })
    },
    [router, workspace]
  )

  const onSearchVesselClick = useCallback(() => {
    track('search for a vessel')
    navigateWithGuide(ROUTE_PATHS.WORKSPACE_SEARCH, 'vessel-search')
  }, [navigateWithGuide, track])

  const onAreaReportClick = useCallback(() => {
    track('run a report on an area')
    dispatch(setMapSearchOpenRequested(true))
    navigateWithGuide(ROUTE_PATHS.WORKSPACE, 'analysis-and-dynamic-reports')
  }, [dispatch, navigateWithGuide, track])

  const onUserGuideClick = useCallback(() => {
    track('learn how to use the tools')
    openSidePanel({ type: 'userGuide' })
  }, [openSidePanel, track])

  return useCallback(
    (id: OnboardingCardId) => {
      dispatch(setModalOpen({ id: 'onboarding', open: false }))
      switch (id) {
        case 'searchVessel':
          onSearchVesselClick()
          return
        case 'areaReport':
          onAreaReportClick()
          return
        case 'userGuide':
          onUserGuideClick()
          return
      }
    },
    [dispatch, onSearchVesselClick, onAreaReportClick, onUserGuideClick]
  )
}

/**
 * Sends the question typed in the onboarding modal to the analysis copilot: the chat session picks
 * the pending prompt up when it mounts, so the user lands on an answer, not an empty input.
 */
export function useOnboardingCopilotPrompt() {
  const dispatch = useAppDispatch()
  const { openSidePanel } = useSidePanel()
  const setActiveThread = useSetAtom(activeThreadAtom)
  const setPendingPrompt = useSetAtom(pendingPromptAtom)

  return useCallback(
    (query: string) => {
      const trimmed = query.trim()
      if (!trimmed) return
      trackEvent({
        category: TrackCategory.HelpHints,
        action: 'onboarding panel - ask the analysis copilot',
      })
      dispatch(setModalOpen({ id: 'onboarding', open: false }))
      setActiveThread(newActiveThread())
      setPendingPrompt(trimmed)
      openSidePanel({ type: 'chat' })
    },
    [dispatch, openSidePanel, setActiveThread, setPendingPrompt]
  )
}

const TYPE_MS = 45
const DELETE_MS = 25
/** How long a finished sentence stays put before it is deleted again. */
const HOLD_MS = 5000
const GAP_MS = 500

function pickNext(phrases: string[], current: string) {
  const others = phrases.filter((phrase) => phrase !== current)
  return others[Math.floor(Math.random() * others.length)] ?? current
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  )
}

/**
 * Types one of `phrases` in, holds it, deletes it, then picks another at random. Returns the text
 * to use as a placeholder — an `<input>` cannot hold child nodes, so the animation has to be the
 * string itself rather than CSS.
 */
export function useTypewriterPlaceholder(phrases: string[], paused: boolean) {
  const [text, setText] = useState('')
  const reducedMotion = prefersReducedMotion()

  useEffect(() => {
    if (reducedMotion || paused || phrases.length === 0) return
    let timer: ReturnType<typeof setTimeout>
    let phrase = phrases[Math.floor(Math.random() * phrases.length)]!
    let chars = 0
    let deleting = false

    const tick = () => {
      chars += deleting ? -1 : 1
      setText(phrase.slice(0, chars))
      if (!deleting && chars === phrase.length) {
        deleting = true
        timer = setTimeout(tick, HOLD_MS)
        return
      }
      if (deleting && chars === 0) {
        deleting = false
        phrase = pickNext(phrases, phrase)
        timer = setTimeout(tick, GAP_MS)
        return
      }
      timer = setTimeout(tick, deleting ? DELETE_MS : TYPE_MS)
    }

    timer = setTimeout(tick, GAP_MS)
    return () => clearTimeout(timer)
  }, [phrases, paused, reducedMotion])

  // No animation to run: a single example still says what the input takes.
  return reducedMotion ? phrases[0] : text
}
