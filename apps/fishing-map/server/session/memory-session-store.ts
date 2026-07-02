import type { SessionRecord, SessionStore } from './session-store.types'

/**
 * Single-process store for local dev and tests. All operations are synchronous over a
 * Map, so they are atomic within one Node process — the deployed store is Firestore.
 */
export class MemorySessionStore implements SessionStore {
  private docs = new Map<string, SessionRecord>()

  async get(sid: string): Promise<SessionRecord | null> {
    const record = this.docs.get(sid)
    return record ? { ...record } : null
  }

  async create(sid: string, record: SessionRecord): Promise<void> {
    this.docs.set(sid, { ...record })
  }

  async createIfAbsent(sid: string, record: SessionRecord): Promise<SessionRecord> {
    const existing = this.docs.get(sid)
    if (existing) return { ...existing }
    this.docs.set(sid, { ...record })
    return { ...record }
  }

  async delete(sid: string): Promise<void> {
    this.docs.delete(sid)
  }

  async update(
    sid: string,
    mutate: (record: SessionRecord | null) => Partial<SessionRecord> | null
  ): Promise<SessionRecord | null> {
    const record = this.docs.get(sid) ?? null
    const patch = mutate(record ? { ...record } : null)
    if (!record) return null
    if (!patch) return { ...record }
    const next = { ...record, ...patch }
    this.docs.set(sid, next)
    return { ...next }
  }
}
