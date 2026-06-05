/**
 * Same-origin guard for public, guest-accessible API routes.
 *
 * These endpoints intentionally do NOT require login (guests can submit track
 * corrections, feedback and surveys), so they can't be protected with auth. The realistic
 * protection against cross-site / scripted abuse is verifying the request came from our
 * own frontend: the browser-set `Origin` (or `Referer`) host must match the request host.
 *
 * Browsers always send `Origin` on cross-origin and on same-origin `fetch` POSTs, so a
 * missing source header on a write endpoint indicates a non-browser caller and is rejected.
 * This is a CSRF mitigation, not authentication — a determined non-browser client can forge
 * headers; pair with rate limiting at the edge if abuse becomes a problem.
 */
export function isSameOrigin(request: Request): boolean {
  const source = request.headers.get('origin') || request.headers.get('referer')
  if (!source) {
    return false
  }
  try {
    return new URL(source).host === new URL(request.url).host
  } catch {
    return false
  }
}

export function forbiddenResponse() {
  return Response.json({ success: false, message: 'Forbidden' }, { status: 403 })
}
