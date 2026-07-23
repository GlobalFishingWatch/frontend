import { API_GATEWAY, API_VERSION, GFWAPI } from '@globalfishingwatch/api-client'

export const AGENT_ID = 'main-agent'
export const AGENT_BASE_URL = `${API_GATEWAY}/${API_VERSION}/agent/workspace-navigator-agent`

export async function authFetch(
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

export type AgentThread = {
  id: string
  title: string
  updatedAt: string
}

interface StoredMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content?: { parts?: any[] }
}

function toUIPart(p: any): Record<string, unknown> | null {
  switch (p?.type) {
    case 'text':
      return { type: 'text', text: p.text ?? '' }
    case 'reasoning':
      return { type: 'reasoning', text: p.reasoning ?? p.text ?? '', state: 'done' }
    case 'tool-invocation': {
      const ti = p.toolInvocation ?? {}
      const hasResult = ti.state === 'result' || ti.result !== undefined
      return {
        type: `tool-${ti.toolName}`,
        toolCallId: ti.toolCallId,
        input: ti.args,
        state: hasResult ? 'output-available' : 'input-available',
        output: ti.result,
      }
    }
    case 'step-start':
      return { type: 'step-start' }
    default:
      return null
  }
}

/** Converts a Mastra format-2 stored message into an AI SDK UI v5 UIMessage. */
export function toUIMessage(m: StoredMessage) {
  const parts = (m.content?.parts ?? []).map(toUIPart).filter((p) => p != null)
  return { id: m.id, role: m.role, parts }
}

/** Fetches the persisted history of a thread. Returns [] if it doesn't exist yet (404). */
export async function loadThreadMessages(threadId: string, resourceId: string) {
  const url =
    `${AGENT_BASE_URL}/threads/${encodeURIComponent(threadId)}/messages` +
    `?agentId=${encodeURIComponent(AGENT_ID)}&resourceId=${encodeURIComponent(resourceId)}`
  const res = await authFetch(url)
  if (res.status === 404) return []
  if (!res.ok) throw new Error(`history ${res.status}`)
  const data = (await res.json()) as { messages?: StoredMessage[] }
  return (data.messages ?? []).map(toUIMessage)
}

/** Lists the resource's conversations (title/updatedAt generated server-side). */
export async function loadThreads(resourceId: string): Promise<AgentThread[]> {
  const url = `${AGENT_BASE_URL}/threads?agentId=${encodeURIComponent(AGENT_ID)}&resourceId=${encodeURIComponent(resourceId)}`
  const res = await authFetch(url)
  if (!res.ok) {
    throw new Error(`threads ${res.status}`)
  }
  const data = (await res.json()) as { threads?: AgentThread[] } | AgentThread[]
  return Array.isArray(data) ? data : (data.threads ?? [])
}

/** Deletes a thread. Returns true on success or 404 (already gone). */
export async function deleteThread(threadId: string, resourceId: string): Promise<boolean> {
  try {
    const res = await authFetch(
      `${AGENT_BASE_URL}/threads/${encodeURIComponent(threadId)}?agentId=${encodeURIComponent(AGENT_ID)}&resourceId=${encodeURIComponent(resourceId)}`,
      { method: 'DELETE' }
    )
    return res.ok || res.status === 404
  } catch {
    return false
  }
}
