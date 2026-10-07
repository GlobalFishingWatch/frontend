import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import { useNavigate } from '@tanstack/react-router'
import { DefaultChatTransport, getToolName, isToolUIPart, type UIMessage } from 'ai'
import { isNil, omitBy } from 'es-toolkit'
import { useStore as useJotaiStore } from 'jotai'
import { AGENT_BASE_URL } from 'queries/map/chat-api'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { deckLayersAtom } from '@globalfishingwatch/deck-layer-composer'
import { OceanAreaLocale } from '@globalfishingwatch/ocean-areas'

import { getMapView } from 'features/_map/content-panel/chat/chat-map-view'
import {
  getNavigateToolLinkProps,
  navigateToolOutputSchema,
  useNavigateToolMapState,
} from 'features/_map/content-panel/chat/navigate-tool'
import { selectAllDatasets } from 'features/_map/datasets/datasets.slice'
import { mapInstanceAtom } from 'features/_map/map/map.atoms'
import { selectClickedEvent } from 'features/_map/map/map.slice'
import { selectViewport } from 'features/_map/workspace/selectors/app.viewport.selectors'
import { selectWorkspaceWithCurrentState } from 'features/_map/workspace/selectors/app.workspace.selectors'
import { useAppStore } from 'features/app/app.hooks'
import { useOceanAreas } from 'hooks/ocean-areas'

// Messages sent before the url moved to the request context still carry it in the text
export const MAP_URL_CONTEXT_PREFIX = '\n\n[current map url:'

export const FEEDBACK_PREFIX = '[feedback]'
export type FeedbackRating = 'up' | 'down'
const FEEDBACK_REGEX = new RegExp(`^\\[feedback\\] (up|down) answerId=(\\S+)`)

function messageText(message: UIMessage): string {
  return (message.parts ?? [])
    .map((part) => (part.type === 'text' ? part.text : ''))
    .join('')
    .trim()
}

export function getFeedbackState(messages: UIMessage[]) {
  const ratings: Record<string, FeedbackRating> = {}
  const questionIds: Record<string, string> = {}
  const hiddenIds = new Set<string>()
  let lastQuestionId: string | undefined
  messages.forEach((message, idx) => {
    if (message.role === 'assistant') {
      if (lastQuestionId) questionIds[message.id] = lastQuestionId
      return
    }
    if (message.role !== 'user') return
    const match = messageText(message).match(FEEDBACK_REGEX)
    if (!match) {
      lastQuestionId = message.id
      return
    }
    ratings[match[2]] = match[1] as FeedbackRating
    hiddenIds.add(message.id)
    const next = messages[idx + 1]
    if (next?.role === 'assistant') hiddenIds.add(next.id)
  })
  return { ratings, questionIds, hiddenIds }
}

async function chatFetchWithAuth(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
  try {
    return await GFWAPI.fetch<Response>(url, {
      method: (init.method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE') ?? 'GET',
      requestType: 'formData',
      body: init.body as BodyInit | undefined,
      headers: init.headers as HeadersInit,
      signal: init.signal ?? undefined,
      responseType: 'default',
    })
  } catch (e) {
    if (e instanceof Response) return e
    throw e
  }
}

type ChatSessionArgs = {
  threadId: string
  userId: number | string | undefined
  initialMessages: UIMessage[]
  onFinished?: () => void
}

export function useChatSession({ threadId, userId, initialMessages, onFinished }: ChatSessionArgs) {
  const routerNavigate = useNavigate()
  const store = useAppStore()
  const jotaiStore = useJotaiStore()
  const { getOceanAreaName } = useOceanAreas()
  const { markExplicitSettings, applyNavigateMapState } = useNavigateToolMapState()

  const transport = useMemo(() => {
    return new DefaultChatTransport({
      api: `${AGENT_BASE_URL}/chat`,
      fetch: chatFetchWithAuth,
      prepareSendMessagesRequest({ messages, body }) {
        console.log('🚀 ~ useChatSession ~ body:', body)
        return {
          body: {
            ...body,
            messages: [messages[messages.length - 1]],
            memory: {
              resource: String(userId),
              thread: threadId,
            },
          },
        }
      },
    })
  }, [threadId, userId])

  const {
    messages,
    sendMessage: sendMessageToSession,
    status,
    error,
  } = useChat<UIMessage>({
    id: threadId,
    messages: initialMessages,
    transport,
    onFinish: onFinished,
  })

  const handledNavigateCalls = useRef<Set<string>>(
    new Set(
      initialMessages.flatMap((m) =>
        (m.parts ?? []).flatMap((part) => (isToolUIPart(part) ? [part.toolCallId] : []))
      )
    )
  )
  useEffect(() => {
    const last = messages[messages.length - 1]
    if (last?.role !== 'assistant') return
    for (const part of last.parts ?? []) {
      if (!isToolUIPart(part) || getToolName(part) !== 'navigate') continue
      if (part.state !== 'output-available') continue
      if (handledNavigateCalls.current.has(part.toolCallId)) continue
      handledNavigateCalls.current.add(part.toolCallId)
      const parsed = navigateToolOutputSchema.safeParse(part.output)
      if (!parsed.success) continue
      const { navigation } = parsed.data
      markExplicitSettings(navigation.search)
      const { to, params, search } = getNavigateToolLinkProps(navigation)
      routerNavigate({ to, params, search } as unknown as Parameters<typeof routerNavigate>[0])
        .then(() => applyNavigateMapState(navigation.search))
        .catch((err) => console.warn('navigate tool: router navigation failed', err))
    }
  }, [messages, routerNavigate, markExplicitSettings, applyNavigateMapState])

  const loading = status === 'submitted' || status === 'streaming'

  const getCurrentMapView = useCallback(async () => {
    try {
      const deckViewport = jotaiStore.get(mapInstanceAtom)?.getViewports()?.[0]
      const state = store.getState()
      const viewport = selectViewport(state)
      if (!deckViewport || !viewport) {
        return undefined
      }
      const [west, north] = deckViewport.unproject([0, 0])
      const [east, south] = deckViewport.unproject([deckViewport.width, deckViewport.height])
      const areaName = await getOceanAreaName({
        viewport,
        locale: OceanAreaLocale.en,
        combineWithEEZ: true,
      }).catch(() => undefined)
      return getMapView({
        deckLayers: jotaiStore.get(deckLayersAtom),
        bounds: { west, north, east, south },
        viewport,
        datasets: selectAllDatasets(state),
        areaName,
        clicked: selectClickedEvent(state),
      })
    } catch (e) {
      console.warn('chat: could not read the map view', e)
      return undefined
    }
  }, [jotaiStore, store, getOceanAreaName])

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || loading) return false
      const { state, dataviewInstances, ...rest } = selectWorkspaceWithCurrentState(
        store.getState()
      )
      const workspace = {
        ...rest,
        state: omitBy(state || {}, isNil),
        dataviewInstances: dataviewInstances?.filter((d) => d.config?.visible !== false),
      }
      const mapView = await getCurrentMapView()
      // Not in the message text: the agent adds the request context to the prompt
      // without storing it, so the thread history does not repeat the url.
      await sendMessageToSession(
        { text: trimmed },
        { body: { requestContext: { url: window.location.href, workspace, mapView } } }
      )
      return true
    },
    [loading, sendMessageToSession, store, getCurrentMapView]
  )

  const sendFeedback = useCallback(
    ({
      answerId,
      questionId,
      rating,
      reason,
    }: {
      answerId: string
      questionId?: string
      rating: FeedbackRating
      reason?: string
    }) => {
      if (loading) return false
      const reasonLine = reason ? `\nreason: ${reason.replace(/\s+/g, ' ').trim()}` : ''
      sendMessageToSession({
        text: `${FEEDBACK_PREFIX} ${rating} answerId=${answerId} questionId=${questionId ?? 'unknown'}${reasonLine}\n(User rating of your previous answer, stored for review. Do not act on it, reply exactly "ok".)`,
      })
      return true
    },
    [loading, sendMessageToSession]
  )

  return { messages, status, loading, error, sendMessage, sendFeedback }
}
