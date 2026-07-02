import { Firestore, Timestamp } from '@google-cloud/firestore'

import type { SessionRecord, SessionStore } from './session-store.types'

const SESSION_TTL_MS = 365 * 24 * 60 * 60 * 1000

/**
 * Session store on Firestore (named database, REST transport). Auth is ADC via the
 * Cloud Run service account — no secrets. Transactions give the cross-instance
 * atomicity the refresh lease needs.
 */
export class FirestoreSessionStore implements SessionStore {
  private col

  constructor() {
    const db = new Firestore({
      ...(process.env.FIRESTORE_PROJECT_ID && { projectId: process.env.FIRESTORE_PROJECT_ID }),
      ...(process.env.FIRESTORE_SESSIONS_DB && { databaseId: process.env.FIRESTORE_SESSIONS_DB }),
      preferRest: true,
    })
    this.col = db.collection(process.env.SESSIONS_COLLECTION || 'sessions-dev')
  }

  /** `expiresAt` drives the Firestore TTL policy; bumped on every rotation */
  private ttl() {
    return Timestamp.fromMillis(Date.now() + SESSION_TTL_MS)
  }

  async get(sid: string): Promise<SessionRecord | null> {
    const snap = await this.col.doc(sid).get()
    return snap.exists ? (snap.data() as SessionRecord) : null
  }

  async create(sid: string, record: SessionRecord): Promise<void> {
    await this.col.doc(sid).set({ ...record, expiresAt: this.ttl() })
  }

  async createIfAbsent(sid: string, record: SessionRecord): Promise<SessionRecord> {
    const ref = this.col.doc(sid)
    return this.col.firestore.runTransaction(async (tx) => {
      const snap = await tx.get(ref)
      if (snap.exists) return snap.data() as SessionRecord
      tx.create(ref, { ...record, expiresAt: this.ttl() })
      return record
    })
  }

  async delete(sid: string): Promise<void> {
    await this.col.doc(sid).delete()
  }

  async update(
    sid: string,
    mutate: (record: SessionRecord | null) => Partial<SessionRecord> | null
  ): Promise<SessionRecord | null> {
    const ref = this.col.doc(sid)
    return this.col.firestore.runTransaction(async (tx) => {
      const snap = await tx.get(ref)
      const record = snap.exists ? (snap.data() as SessionRecord) : null
      const patch = mutate(record)
      if (!record) return null
      if (!patch) return record
      tx.update(ref, { ...patch, ...(patch.rotatedAt ? { expiresAt: this.ttl() } : {}) })
      return { ...record, ...patch }
    })
  }
}
