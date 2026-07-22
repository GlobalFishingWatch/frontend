import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useChat } from '@ai-sdk/react'
import { useNavigate } from '@tanstack/react-router'
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
  type UIMessage,
} from 'ai'
import { useSetAtom } from 'jotai'

import { useLocalStorage } from '@globalfishingwatch/react-hooks'

import {
  AGENT_BASE_URL,
  type AgentThread,
  authFetch,
  deleteThread,
  loadThreadMessages,
  loadThreads,
} from 'features/content-panel/chat-agent'
import { navigateToolInputSchema } from 'features/content-panel/navigate-tool'
import { timerangeState } from 'features/timebar/timebar.hooks'
import { selectUserId } from 'features/user/selectors/user.permissions.selectors'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'

const ACTIVE_KEY = 'chatActiveConversationId'

export function useChatConversations() {
  const userId = useSelector(selectUserId)
  const isGFWUser = useSelector(selectIsGFWUser)
  const canUseChat = isGFWUser
  const [activeId, setActiveId] = useLocalStorage<string | null>(ACTIVE_KEY, null)
  const [draftId, setDraftId] = useState(() => crypto.randomUUID())
  const [threads, setThreads] = useState<AgentThread[]>([])
  const [threadsError, setThreadsError] = useState<string | null>(null)
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

  const refreshThreads = useCallback(async () => {
    if (!canUseChat) return
    try {
      setThreads(await loadThreads(String(userId)))
      setThreadsError(null)
    } catch (err) {
      setThreadsError(err instanceof Error ? err.message : 'Failed to load conversations')
    }
  }, [canUseChat, userId])

  useEffect(() => {
    if (!canUseChat) return

    let cancelled = false
    ;(async () => {
      try {
        const next = await loadThreads(String(userId))
        if (cancelled) return
        setThreads(next)
        setThreadsError(null)
      } catch (err) {
        if (!cancelled) {
          setThreadsError(err instanceof Error ? err.message : 'Failed to load conversations')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [canUseChat, userId])

  const activate = useCallback(() => {
    if (activeId !== threadId) setActiveId(threadId)
  }, [activeId, threadId, setActiveId])

  const deleteConversation = useCallback(
    (id: string) => {
      if (!canUseChat) return
      setThreads((prev) => {
        const next = prev.filter((c) => c.id !== id)
        void (async () => {
          const ok = await deleteThread(id, String(userId))
          if (!ok) {
            setThreads(prev)
            toast.error('Could not delete conversation')
          }
        })()
        return next
      })
      if (id === activeId) setActiveId(null)
    },
    [activeId, canUseChat, userId, setActiveId]
  )

  const newConversation = useCallback(() => {
    setActiveId(null)
    setDraftId(crypto.randomUUID())
  }, [setActiveId])

  const activeConversation = useMemo(
    () => threads.find((c) => c.id === activeId) ?? null,
    [threads, activeId]
  )

  return {
    conversations: threads,
    threadsError,
    activeId,
    activeConversation,
    threadId,
    canUseChat,
    setActiveId,
    activate,
    deleteConversation,
    newConversation,
    refreshThreads,
  }
}

type ChatSessionArgs = {
  threadId: string
  activate: () => void
  refreshThreads: () => void
}

/** One AI SDK chat bound to a threadId. Remount via key={threadId}. */
export function useChatAgentSession({ threadId, activate, refreshThreads }: ChatSessionArgs) {
  const userId = useSelector(selectUserId)
  const isGFWUser = useSelector(selectIsGFWUser)
  const canUseChat = isGFWUser
  const routerNavigate = useNavigate()
  const setTimerange = useSetAtom(timerangeState)
  const [historyError, setHistoryError] = useState<string | null>(null)
  const statusRef = useRef<string>('ready')
  const prevStatusRef = useRef<string>('ready')

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${AGENT_BASE_URL}/chat`,
        fetch: authFetch,
        prepareSendMessagesRequest({ messages }) {
          return {
            body: {
              messages: [messages[messages.length - 1]],
              memory: { resource: String(userId), thread: threadId },
            },
          }
        },
      }),
    [threadId, userId]
  )

  const { messages, sendMessage, status, error, addToolOutput, setMessages } = useChat({
    transport,
    // When the last assistant message has ALL its tool-calls with a result
    // (e.g. after responding to `navigate` with addToolOutput), it automatically
    // resends to the agent so it CONTINUES the response.
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    // Client-side `navigate` tool: the model calls it, the server does NOT
    // run it (it has no execute) and the tool-call arrives here.
    async onToolCall({ toolCall }) {
      if (toolCall.toolName !== 'navigate') return
      const parsed = navigateToolInputSchema.safeParse(toolCall.input)
      if (!parsed.success) {
        addToolOutput({
          tool: 'navigate',
          toolCallId: toolCall.toolCallId,
          output: {
            ok: false,
            detail: `Invalid navigate input: ${parsed.error.issues.map((i) => i.message).join('; ')}`,
          },
        })
        return
      }
      const { navigation, path } = parsed.data
      try {
        await routerNavigate({
          to: navigation.to,
          params: navigation.params ?? {},
          search: { ...navigation.search, sidePanelContent: 'chat' },
        } as unknown as Parameters<typeof routerNavigate>[0])
        const { start, end } = (navigation.search ?? {}) as { start?: string; end?: string }
        if (start && end) setTimerange({ start, end })
        addToolOutput({
          tool: 'navigate',
          toolCallId: toolCall.toolCallId,
          output: {
            ok: true,
            detail: `Navigated via router to ${navigation.to}; path ${path ?? ''}`,
          },
        })
      } catch (err) {
        addToolOutput({
          tool: 'navigate',
          toolCallId: toolCall.toolCallId,
          output: { ok: false, detail: `TanStack Router navigate failed: ${String(err)}` },
        })
      }
    },
  })

  const loading = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    statusRef.current = status
  }, [status])

  // Load the persisted history for this thread from the server whenever it changes.
  useEffect(() => {
    if (!canUseChat) return
    let cancelled = false
    ;(async () => {
      try {
        const history = await loadThreadMessages(threadId, String(userId))
        if (cancelled) return
        // Don't clobber an in-flight turn that started while history was loading.
        if (statusRef.current !== 'ready') return
        setHistoryError(null)
        if (history.length > 0) setMessages(history as UIMessage[])
      } catch (err) {
        if (!cancelled) {
          setHistoryError(err instanceof Error ? err.message : 'Failed to load history')
        }
      }
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- thread-scoped load, re-run only when thread/user change
  }, [threadId, canUseChat, userId])

  // Refresh titles after a completed send/stream, not after history hydrate.
  useEffect(() => {
    const wasBusy = prevStatusRef.current === 'submitted' || prevStatusRef.current === 'streaming'
    prevStatusRef.current = status
    if (wasBusy && status === 'ready' && messages.length > 0) void refreshThreads()
  }, [status, messages.length, refreshThreads])

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || loading || !canUseChat) return false
      activate()
      const content = `${trimmed}\n\n[current map url: ${window.location.href}]`
      await sendMessage({ text: content })
      return true
    },
    [loading, canUseChat, activate, sendMessage]
  )

  return { messages, loading, error, historyError, send, canUseChat }
}
