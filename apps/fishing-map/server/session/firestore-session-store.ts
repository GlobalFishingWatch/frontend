import { GoogleAuth } from 'google-auth-library'

import type { SessionRecord, SessionStore } from './session-store.types'

/**
 * Session store on the Firestore REST API. The @google-cloud/firestore SDK cannot be
 * used here: the production image ships only the bundled .output/ (no node_modules)
 * and the SDK is CJS relying on __dirname + proto files on disk. Plain fetch +
 * google-auth-library (ADC via the Cloud Run service account) bundles cleanly — same
 * approach as the spreadsheets server code.
 *
 * Atomicity: single-doc read-modify-write with an updateTime precondition instead of
 * a transaction — a concurrent write makes the commit fail FAILED_PRECONDITION and we
 * re-read and retry, which is equivalent for the per-session lease this store backs.
 */

const SESSION_TTL_MS = 365 * 24 * 60 * 60 * 1000
const MAX_UPDATE_RETRIES = 5

type FirestoreValue = {
  stringValue?: string
  integerValue?: string
  doubleValue?: number
  nullValue?: null
  timestampValue?: string
}
type FirestoreDoc = { name: string; fields?: Record<string, FirestoreValue>; updateTime: string }

const toValue = (value: string | number | null): FirestoreValue => {
  if (value === null) return { nullValue: null }
  if (typeof value === 'string') return { stringValue: value }
  return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value }
}

const fromValue = (value: FirestoreValue): string | number | null => {
  if (value.stringValue !== undefined) return value.stringValue
  if (value.integerValue !== undefined) return Number(value.integerValue)
  if (value.doubleValue !== undefined) return value.doubleValue
  if (value.timestampValue !== undefined) return Date.parse(value.timestampValue)
  return null
}

const toFields = (patch: Partial<SessionRecord>, withTtl: boolean) => {
  const fields: Record<string, FirestoreValue> = {}
  for (const [key, value] of Object.entries(patch)) {
    fields[key] = toValue(value)
  }
  if (withTtl) {
    // Drives the Firestore TTL policy; bumped on every rotation
    fields.expiresAt = { timestampValue: new Date(Date.now() + SESSION_TTL_MS).toISOString() }
  }
  return fields
}

const RECORD_DEFAULTS: SessionRecord = {
  refreshToken: '',
  token: '',
  tokenExpiresAt: 0,
  rotatedAt: 0,
  leaseId: null,
  leaseUntil: 0,
}

const fromDoc = (doc: FirestoreDoc): SessionRecord => {
  const record = { ...RECORD_DEFAULTS }
  for (const key of Object.keys(RECORD_DEFAULTS) as (keyof SessionRecord)[]) {
    const value = doc.fields?.[key]
    if (value !== undefined) (record[key] as string | number | null) = fromValue(value)
  }
  return record
}

const isConflict = (status: number, body: string) =>
  (status === 400 || status === 409 || status === 412) &&
  /FAILED_PRECONDITION|ALREADY_EXISTS|ABORTED/.test(body)

export class FirestoreSessionStore implements SessionStore {
  private auth = new GoogleAuth({ scopes: 'https://www.googleapis.com/auth/datastore' })
  private baseUrl: string

  constructor() {
    const project = process.env.FIRESTORE_PROJECT_ID
    const database = process.env.FIRESTORE_SESSIONS_DB || '(default)'
    const collection = process.env.SESSIONS_COLLECTION || 'sessions-dev'
    const host = process.env.FIRESTORE_EMULATOR_HOST
      ? `http://${process.env.FIRESTORE_EMULATOR_HOST}`
      : 'https://firestore.googleapis.com'
    this.baseUrl = `${host}/v1/projects/${project}/databases/${database}/documents/${collection}`
  }

  private async request(
    method: string,
    path: string,
    body?: unknown
  ): Promise<{ status: number; text: string }> {
    const headers: Record<string, string> = { 'content-type': 'application/json' }
    if (!process.env.FIRESTORE_EMULATOR_HOST) {
      headers.authorization = `Bearer ${await this.auth.getAccessToken()}`
    }
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      ...(body !== undefined && { body: JSON.stringify(body) }),
    })
    const text = await res.text()
    if (!res.ok && res.status !== 404 && !isConflict(res.status, text)) {
      throw new Error(`Firestore ${method} ${path} failed (${res.status}): ${text.slice(0, 300)}`)
    }
    return { status: res.status, text }
  }

  private async getDoc(sid: string): Promise<FirestoreDoc | null> {
    const res = await this.request('GET', `/${sid}`)
    return res.status === 404 ? null : (JSON.parse(res.text) as FirestoreDoc)
  }

  async get(sid: string): Promise<SessionRecord | null> {
    const doc = await this.getDoc(sid)
    return doc ? fromDoc(doc) : null
  }

  async create(sid: string, record: SessionRecord): Promise<void> {
    // PATCH without precondition upserts — sids are random, collisions don't exist
    await this.request('PATCH', `/${sid}`, { fields: toFields(record, true) })
  }

  async createIfAbsent(sid: string, record: SessionRecord): Promise<SessionRecord> {
    const res = await this.request('PATCH', `/${sid}?currentDocument.exists=false`, {
      fields: toFields(record, true),
    })
    if (isConflict(res.status, res.text) || res.status === 404) {
      const existing = await this.get(sid)
      if (existing) return existing
    }
    return record
  }

  async delete(sid: string): Promise<void> {
    await this.request('DELETE', `/${sid}`)
  }

  async update(
    sid: string,
    mutate: (record: SessionRecord | null) => Partial<SessionRecord> | null
  ): Promise<SessionRecord | null> {
    for (let attempt = 0; attempt < MAX_UPDATE_RETRIES; attempt++) {
      const doc = await this.getDoc(sid)
      const record = doc ? fromDoc(doc) : null
      const patch = mutate(record)
      if (!record || !doc) return null
      if (!patch || !Object.keys(patch).length) return record

      const fields = toFields(patch, patch.rotatedAt !== undefined)
      const mask = Object.keys(fields)
        .map((key) => `updateMask.fieldPaths=${key}`)
        .join('&')
      const precondition = `currentDocument.updateTime=${encodeURIComponent(doc.updateTime)}`
      const res = await this.request('PATCH', `/${sid}?${mask}&${precondition}`, { fields })
      if (res.status === 404) return null
      if (isConflict(res.status, res.text)) continue // concurrent write — re-read and retry
      return { ...record, ...patch }
    }
    throw new Error('Firestore session update failed: contention retries exhausted')
  }
}
