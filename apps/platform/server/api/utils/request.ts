/**
 * Same-origin guard for the API routes that write to spreadsheets: the browser-set `Origin`
 * (or `Referer`) host must match the request host.
 *
 * Browsers always send `Origin` on cross-origin and on same-origin `fetch` POSTs, so a
 * missing source header on a write endpoint indicates a non-browser caller and is rejected.
 * This is a CSRF mitigation, not authentication — a non-browser client can forge headers.
 * The routes also require a logged user (getRequestUser), or a captcha for guest feedback.
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

export function unauthorizedResponse(message = 'Login required') {
  return Response.json({ success: false, message }, { status: 401 })
}
