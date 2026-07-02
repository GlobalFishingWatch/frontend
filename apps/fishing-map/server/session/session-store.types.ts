export type SessionRecord = {
  /** The ONLY copy of the refresh token — it never leaves the server */
  refreshToken: string
  /** Last-issued access token */
  token: string
  /** Epoch ms decoded from the access token JWT `exp` claim */
  tokenExpiresAt: number
  /** Epoch ms of the last successful rotation (0 for migrated legacy sessions) */
  rotatedAt: number
  /** Rotation lease holder id, null when free */
  leaseId: string | null
  /** Epoch ms the lease expires, 0 when free */
  leaseUntil: number
}

export interface SessionStore {
  get(sid: string): Promise<SessionRecord | null>
  create(sid: string, record: SessionRecord): Promise<void>
  /** Atomic create-if-missing; returns the stored record (an existing one wins). */
  createIfAbsent(sid: string, record: SessionRecord): Promise<SessionRecord>
  delete(sid: string): Promise<void>
  /**
   * Atomic read-modify-write. `mutate` must be synchronous and may be invoked more
   * than once on contention (Firestore transaction retries) — its only side effect
   * should be capturing the outcome of the final invocation. Return the fields to
   * write, or null to write nothing. Resolves to the post-write record, or null
   * when the session doesn't exist.
   */
  update(
    sid: string,
    mutate: (record: SessionRecord | null) => Partial<SessionRecord> | null
  ): Promise<SessionRecord | null>
}
