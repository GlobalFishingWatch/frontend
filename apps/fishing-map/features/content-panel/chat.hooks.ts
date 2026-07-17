import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useSetAtom } from 'jotai'

import { useLocalStorage } from '@globalfishingwatch/react-hooks'
import type { EncodeMapUrlResult } from '@globalfishingwatch/skills'

import { timerangeState } from 'features/timebar/timebar.hooks'

// Talks to the gfw-agent HTTP API (POST /api/chat). The endpoint is plain,
// non-streaming JSON with a custom tool-resume loop:
//   send:   { session_id?, message }        -> { status:'ok', reply } | { status:'pending_tools', tools }
//   resume: { session_id, tool_results }     -> same shapes, repeat until 'ok'
// The one client-side tool is `navigate`. Since the agent runs the repo's
// `encode-url` skill it hands back that skill's `navigation` config:
//   { navigation: { to, params, search } }
// We route with it — a TanStack Router config whose `to`/`params` are the app's
// own route ids, so this is an in-app nav and chat state survives.
//
// Conversations live in localStorage (the gfw-agent server is in-memory and
// ephemeral — it can't list or restore sessions). Each conversation's id doubles
// as the agent session_id (the server accepts any non-empty string).
// ponytail: if the agent server restarts it forgets that session_id and continues
// with a blank Agent — the client still shows the full transcript but the server
// loses prior context. Upgrade path if that bites: server-side session persistence.
const AGENT_URL = import.meta.env.VITE_GFW_AGENT_URL || 'http://localhost:8081'
const CONVERSATIONS_KEY = 'chatConversations'
const ACTIVE_KEY = 'chatActiveConversationId'
const MAX_CONVERSATIONS = 30
const TITLE_MAX = 60

export type ChatRole = 'user' | 'agent' | 'system'
export type ChatMessage = { role: ChatRole; text: string; error?: boolean }
export type StoredConversation = {
  id: string
  title: string
  messages: ChatMessage[]
  updatedAt: number
}

type NavigateInput = { navigation?: EncodeMapUrlResult['navigation'] }

type Tool = { tool_use_id: string; name: string; input: unknown }
type ChatResponse =
  | { session_id?: string; status: 'ok'; reply?: string }
  | { session_id?: string; status: 'pending_tools'; tools: Tool[] }
  | { error: string }

async function postChat(payload: Record<string, unknown>): Promise<ChatResponse> {
  const res = await fetch(`${AGENT_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error((data as { error?: string }).error || `HTTP ${res.status}`)
  return data as ChatResponse
}

export function useChatAgent() {
  const navigate = useNavigate()
  const setTimerange = useSetAtom(timerangeState)
  const [conversations, setConversations] = useLocalStorage<StoredConversation[]>(
    CONVERSATIONS_KEY,
    []
  )
  const [activeId, setActiveId] = useLocalStorage<string | null>(ACTIVE_KEY, null)
  // Ephemeral: true while a turn is in flight. Not persisted — a turn interrupted
  // by unmount/reload just ends; the transcript is already saved.
  const [loading, setLoading] = useState(false)

  // Fresh browser session -> start on a clean conversation (history is kept and
  // still reachable via the history popover). A sessionStorage sentinel keeps
  // this to once per session, so toggling the panel doesn't reset the active one.
  useEffect(() => {
    if (!sessionStorage.getItem('chatSessionStarted')) {
      sessionStorage.setItem('chatSessionStarted', '1')
      setActiveId(null)
    }
  }, [setActiveId])

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId]
  )
  const messages = activeConversation?.messages ?? []

  // Appends messages to a conversation (creating it if new), keeping the list
  // sorted newest-first and capped. Functional update so concurrent turns don't
  // clobber each other.
  const appendTo = useCallback(
    (id: string, title: string, msgs: ChatMessage[]) => {
      setConversations((prev) => {
        const existing = prev.find((c) => c.id === id)
        const updated: StoredConversation = existing
          ? { ...existing, messages: [...existing.messages, ...msgs], updatedAt: Date.now() }
          : { id, title, messages: msgs, updatedAt: Date.now() }
        const rest = prev.filter((c) => c.id !== id)
        return [updated, ...rest].slice(0, MAX_CONVERSATIONS)
      })
    },
    [setConversations]
  )

  // Routes to what the agent produced via the encode-url skill's `navigation`
  // config (in-app router nav, keeps chat).
  const runNavigate = useCallback(
    (input: NavigateInput): { ok: boolean; detail: string } => {
      const { navigation } = input
      if (!navigation?.to) return { ok: false, detail: "navigate called without 'navigation'." }
      try {
        navigate({
          to: navigation.to,
          params: navigation.params ?? {},
          search: { ...navigation.search, sidePanelContent: 'chat' },
        } as unknown as Parameters<typeof navigate>[0])
        const { start, end } = (navigation.search ?? {}) as { start?: string; end?: string }
        if (start && end) setTimerange({ start, end })
        return { ok: true, detail: `Navigated to ${navigation.to}` }
      } catch (err) {
        return { ok: false, detail: `Invalid navigation: ${err}` }
      }
    },
    [navigate, setTimerange]
  )

  // Drives one turn to completion: resolves any client-side tools and resumes
  // until the agent returns 'ok' (or errors). Loop, not recursion, so the whole
  // pending_tools/resume cycle stays in one callback.
  const runTurn = useCallback(
    async (id: string, title: string, first: ChatResponse): Promise<void> => {
      let data = first
      for (;;) {
        if ('error' in data) {
          appendTo(id, title, [{ role: 'system', text: data.error, error: true }])
          return
        }
        if (data.status === 'ok') {
          if (data.reply) appendTo(id, title, [{ role: 'agent', text: data.reply }])
          return
        }

        // pending_tools: run each client tool, then resume the turn.
        const toolResults = (data.tools || []).map((tool) => {
          if (tool.name === 'navigate') {
            const input =
              tool.input && typeof tool.input === 'object' ? (tool.input as NavigateInput) : {}
            appendTo(id, title, [{ role: 'system', text: 'Changing view' }])
            const r = runNavigate(input)
            return { tool_use_id: tool.tool_use_id, result: r.detail, is_error: !r.ok }
          }
          return {
            tool_use_id: tool.tool_use_id,
            result: `Client tool '${tool.name}' is not supported.`,
            is_error: true,
          }
        })

        data = await postChat({ session_id: id, tool_results: toolResults })
      }
    },
    [appendTo, runNavigate]
  )

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || loading) return
      // Reuse the active conversation, or start a new one.
      const id = activeId && activeConversation ? activeId : crypto.randomUUID()
      const title = activeConversation?.title || trimmed.slice(0, TITLE_MAX)
      if (id !== activeId) setActiveId(id)

      appendTo(id, title, [{ role: 'user', text: trimmed }])
      setLoading(true)
      try {
        // Give the agent the current map URL as context to build on.
        const message = `${trimmed}\n\n[current map url: ${window.location.href}]`
        await runTurn(id, title, await postChat({ session_id: id, message }))
      } catch (err) {
        appendTo(id, title, [{ role: 'system', text: String(err), error: true }])
      } finally {
        setLoading(false)
      }
    },
    [activeConversation, activeId, appendTo, runTurn, loading, setActiveId, setLoading]
  )

  const newConversation = useCallback(() => setActiveId(null), [setActiveId])
  const selectConversation = useCallback((id: string) => setActiveId(id), [setActiveId])
  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id))
      if (id === activeId) setActiveId(null)
    },
    [activeId, setConversations, setActiveId]
  )

  return {
    messages,
    loading,
    conversations,
    activeId,
    send,
    newConversation,
    selectConversation,
    deleteConversation,
  }
}
