import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from '@tanstack/react-router'
import { useSetAtom } from 'jotai'

import { AIS_DATAVIEW_INSTANCE_ID, VMS_DATAVIEW_INSTANCE_ID } from '@platform/config/map/dataviews'
import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from '@platform/config/map/workspaces'
import { ROUTE_PATHS } from '@platform/config/routes'

import {
  activeThreadAtom,
  newActiveThread,
  pendingPromptAtom,
} from 'features/_map/content-panel/chat/chat.atoms'
import { useSidePanel, withSidePanel } from 'features/_map/content-panel/contentPanel.hooks'
import { mergeDataviewIntancesToUpsert } from 'features/_map/workspace/workspace.hook'
import { selectWorkspace } from 'features/_map/workspace/workspace.selectors'
import { cleanReportPayload } from 'features/_map/workspace/workspace.utils'
import { useFitAreaInViewport } from 'features/_reports/report-area/area-reports.hooks'
import { ReportCategory } from 'features/_reports/reports.types'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import type { UserGuideSlug } from 'features/cms/user-guide.types'
import { findSectionForSlug } from 'features/help/userGuide.utils'
import { setHintToOpen } from 'features/hints/hints.slice'
import { setModalOpen } from 'features/modals/modals.slice'
import type { OnboardingCardId } from 'features/onboarding/onboarding.config'

const DEFAULT_ACTIVITY_INSTANCE_IDS = [AIS_DATAVIEW_INSTANCE_ID, VMS_DATAVIEW_INSTANCE_ID]

function getGuideTarget(slug: UserGuideSlug) {
  const match = findSectionForSlug(slug)
  return { id: match?.section, subcontentId: match?.subSection }
}

export function useOnboardingCardActions() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const workspace = useSelector(selectWorkspace)
  const { openSidePanel } = useSidePanel()
  const fitAreaInViewport = useFitAreaInViewport()

  const track = useCallback((action: string) => {
    trackEvent({ category: TrackCategory.HelpHints, action: `onboarding panel - ${action}` })
  }, [])

  const workspaceParams = useMemo(
    () => ({
      category: workspace?.category || DEFAULT_WORKSPACE_CATEGORY,
      workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
    }),
    [workspace]
  )

  const onSearchVesselClick = useCallback(() => {
    const { id, subcontentId } = getGuideTarget('vessel-search')
    router.navigate({
      to: ROUTE_PATHS.WORKSPACE_SEARCH,
      params: workspaceParams,
      search: (prev) => ({
        ...prev,
        ...withSidePanel(prev, { type: 'userGuide', id, subcontentId }),
      }),
    })
    track('search for a vessel')
  }, [router, workspaceParams, track])

  const onAreaReportClick = useCallback(() => {
    fitAreaInViewport()
    dispatch(setHintToOpen('reportAreaSearch'))
    const defaultActivityInstances = DEFAULT_ACTIVITY_INSTANCE_IDS.filter((id) =>
      workspace?.dataviewInstances?.some((instance) => instance.id === id)
    ).map((id) => ({ id, deleted: false, config: { visible: true } }))
    router.navigate({
      to: ROUTE_PATHS.WORKSPACE_REPORT,
      params: cleanReportPayload(workspaceParams),
      search: (prev) => ({
        ...prev,
        reportCategory: ReportCategory.Activity,
        latitude: 0,
        longitude: 0,
        zoom: 0,
        bivariateDataviews: null,
        dataviewInstances: mergeDataviewIntancesToUpsert(
          defaultActivityInstances,
          prev.dataviewInstances || []
        ),
      }),
    })
    track('run a report on an area')
  }, [dispatch, track, fitAreaInViewport, router, workspaceParams, workspace?.dataviewInstances])

  const onUserGuideClick = useCallback(() => {
    openSidePanel({ type: 'userGuide' })
    track('learn how to use the tools')
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
