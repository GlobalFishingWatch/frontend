import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ToolCallPart } from '@tanstack/ai'
import { toolDefinition } from '@tanstack/ai/client'
import {
  createChatClientOptions,
  fetchServerSentEvents,
  type UIMessage,
  useChat,
} from '@tanstack/ai-react'
import { useNavigate } from '@tanstack/react-router'
import { useSetAtom } from 'jotai'

import { useLocalStorage } from '@globalfishingwatch/react-hooks'
import { navigateDef } from '@globalfishingwatch/skills/encode-url/defs/navigate-defs'

import { timerangeState } from 'features/timebar/timebar.hooks'

export const navigateDefTool = toolDefinition(navigateDef)

// TanStack AI SSE chat against gfw-agent (POST /api/chat). Client tool `navigate`
// applies encode-url's `{ to, params, search }` via the app's TanStack Router.
// Conversations live in localStorage; each id is the AG-UI threadId.
// ponytail: if the agent server restarts it forgets that threadId — the client
// still shows the transcript but the server loses prior context.

const AGENT_URL = (import.meta.env.VITE_GFW_AGENT_URL || 'http://localhost:8081').replace(
  /\/+$/,
  ''
)
const CONVERSATIONS_KEY = 'chatConversations'
const ACTIVE_KEY = 'chatActiveConversationId'
const MAX_CONVERSATIONS = 30
const TITLE_MAX = 60

export type StoredConversation = {
  id: string
  title: string
  messages: UIMessage[]
  updatedAt: number
}

// Only this module writes CONVERSATIONS_KEY, so the stored shape is already
// StoredConversation[] — the one thing worth guarding is the key being absent
// (fresh install) or not yet an array.
function coerceConversations(raw: unknown): StoredConversation[] {
  return Array.isArray(raw) ? (raw as StoredConversation[]) : []
}

function titleFromMessages(messages: UIMessage[], fallback: string): string {
  if (fallback) return fallback.slice(0, TITLE_MAX)
  const firstUser = messages.find((m) => m.role === 'user')
  const textPart = firstUser?.parts?.find((p) => p.type === 'text')
  const raw = textPart?.content ?? ''
  const display = raw.replace(/\n\n\[current map url: [^\]]+\]$/, '').trim()
  return (display || 'Chat').slice(0, TITLE_MAX)
}

async function resetAgentThread(threadId: string) {
  try {
    await fetch(`${AGENT_URL}/api/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId }),
    })
  } catch {
    // best-effort — server may be down
  }
}

export function useChatConversations() {
  const [rawConversations, setRawConversations] = useLocalStorage<unknown>(CONVERSATIONS_KEY, [])
  const [activeId, setActiveId] = useLocalStorage<string | null>(ACTIVE_KEY, null)
  const [draftId, setDraftId] = useState(() => crypto.randomUUID())
  const conversations = useMemo(() => coerceConversations(rawConversations), [rawConversations])
  const threadId = activeId ?? draftId

  // Fresh browser session -> start on a clean conversation (history is kept and
  // still reachable via the history popover). A sessionStorage sentinel keeps
  // this to once per session, so toggling the panel doesn't reset the active one.
  useEffect(() => {
    if (!sessionStorage.getItem('chatSessionStarted')) {
      sessionStorage.setItem('chatSessionStarted', '1')
      setActiveId(null)
    }
  }, [setActiveId])

  const persistConversation = useCallback(
    (messages: UIMessage[], title: string) => {
      setRawConversations((prev: unknown) => {
        const list = coerceConversations(prev)
        const existing = list.find((c) => c.id === threadId)
        const updated: StoredConversation = {
          id: threadId,
          title: existing?.title || title,
          messages,
          updatedAt: Date.now(),
        }
        const rest = list.filter((c) => c.id !== threadId)
        return [updated, ...rest].slice(0, MAX_CONVERSATIONS)
      })
    },
    [setRawConversations, threadId]
  )

  const activate = useCallback(() => {
    if (activeId !== threadId) setActiveId(threadId)
  }, [activeId, threadId, setActiveId])

  const deleteConversation = useCallback(
    (id: string) => {
      setRawConversations((prev: unknown) => coerceConversations(prev).filter((c) => c.id !== id))
      void resetAgentThread(id)
      if (id === activeId) setActiveId(null)
    },
    [activeId, setRawConversations, setActiveId]
  )

  const newConversation = useCallback(() => {
    if (activeId) void resetAgentThread(activeId)
    setActiveId(null)
    setDraftId(crypto.randomUUID())
  }, [activeId, setActiveId])

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId]
  )

  return {
    conversations,
    activeId,
    activeConversation,
    threadId,
    setActiveId,
    persistConversation,
    activate,
    deleteConversation,
    newConversation,
  }
}

type ChatSessionArgs = {
  threadId: string
  initialMessages: UIMessage[]
  titleSeed: string
  persistConversation: (messages: UIMessage[], title: string) => void
  activate: () => void
}

/** One TanStack AI chat bound to a threadId. Remount via key={threadId}. */
export function useChatAgentSession({
  threadId,
  initialMessages,
  titleSeed,
  persistConversation,
  activate,
}: ChatSessionArgs) {
  const routerNavigate = useNavigate()
  const setTimerange = useSetAtom(timerangeState)

  const navigate = useMemo(
    () =>
      navigateDefTool.client(async ({ navigation, path }) => {
        if (!navigation?.to) {
          return { ok: false, detail: "navigate called without 'navigation'." }
        }
        try {
          await routerNavigate({
            to: navigation.to,
            params: navigation.params ?? {},
            search: { ...navigation.search, sidePanelContent: 'chat' },
          } as unknown as Parameters<typeof routerNavigate>[0])
          const { start, end } = (navigation.search ?? {}) as {
            start?: string
            end?: string
          }
          if (start && end) setTimerange({ start, end })
          return {
            ok: true,
            detail: `Navigated via router to ${navigation.to}; path ${path}`,
          }
        } catch (err) {
          return { ok: false, detail: `TanStack Router navigate failed: ${String(err)}` }
        }
      }),
    [routerNavigate, setTimerange]
  )

  const chatOptions = useMemo(
    () =>
      createChatClientOptions({
        connection: fetchServerSentEvents(() => `${AGENT_URL}/api/chat`),
        tools: [navigate],
        threadId,
        id: threadId,
        initialMessages,
      }),
    // Remount parent with key={threadId} when switching threads — do not recreate
    // mid-session from initialMessages changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: thread-scoped
    [navigate, threadId]
  )

  const { messages, sendMessage, isLoading, error, clear, addToolApprovalResponse } =
    useChat(chatOptions)

  // Persist transcript whenever useChat updates messages.
  useEffect(() => {
    if (messages.length === 0) return
    persistConversation(messages, titleFromMessages(messages, titleSeed))
  }, [messages, persistConversation, titleSeed])

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isLoading) return
      activate()
      const content = `${trimmed}\n\n[current map url: ${window.location.href}]`
      await sendMessage(content)
    },
    [isLoading, activate, sendMessage]
  )

  const pendingApprovals = useMemo(
    () =>
      messages.flatMap((m) =>
        m.parts.filter(
          (p): p is ToolCallPart & { approval: NonNullable<ToolCallPart['approval']> } =>
            p.type === 'tool-call' && p.state === 'approval-requested' && !!p.approval
        )
      ),
    [messages]
  )

  return {
    messages,
    loading: isLoading,
    error,
    send,
    clear,
    addToolApprovalResponse,
    pendingApprovals,
  }
}

export { TITLE_MAX, resetAgentThread }
