/**
 * Legacy copy path for browsers/contexts where the async Clipboard API is
 * unavailable (non-secure origins, older Safari). Must run inside a user
 * gesture or `execCommand` is a no-op.
 */
function copyWithExecCommand(text: string): boolean {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.setAttribute('aria-hidden', 'true')
  textarea.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;'

  const previouslyFocused = document.activeElement as HTMLElement | null
  document.body.appendChild(textarea)

  try {
    textarea.select()
    // iOS ignores select() on its own
    textarea.setSelectionRange(0, text.length)
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    textarea.remove()
    previouslyFocused?.focus?.()
  }
}

async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof document === 'undefined' || !text) {
    return false
  }

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Permission denied or insecure context, fall through to the legacy path
    }
  }

  return copyWithExecCommand(text)
}

export default copyToClipboard
