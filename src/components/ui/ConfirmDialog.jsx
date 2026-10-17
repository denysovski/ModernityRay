import { useEffect, useId, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Icon } from './Icon'

/* A confirmation the app draws itself, instead of window.confirm().
 *
 * The native dialog cannot be styled at all, says "localhost:5173 says",
 * and gives no room to explain what is about to be lost — which is exactly
 * the information someone needs before deleting an account.
 *
 * What it has to put back, because window.confirm got it for free:
 *   - focus moves into the dialog and returns to whatever opened it,
 *   - Escape cancels, and a click on the backdrop cancels,
 *   - Tab is trapped inside while it is open, so the page behind cannot be
 *     reached with a keyboard,
 *   - the page behind does not scroll under it,
 *   - role="alertdialog" with the heading and body wired to it by id.
 *
 * The destructive action is never the default: focus lands on Cancel.
 */

const ease = [0.22, 1, 0.36, 1]

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {string} props.title
 * @param {string} props.body
 * @param {string} [props.confirmLabel]
 * @param {string} [props.cancelLabel]
 * @param {() => void} props.onConfirm
 * @param {() => void} props.onCancel
 */
export default function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = 'Yes, delete it',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  const panelRef = useRef(null)
  const cancelRef = useRef(null)
  const returnTo = useRef(null)
  const titleId = useId()
  const bodyId = useId()

  useEffect(() => {
    if (!open) return undefined

    returnTo.current = document.activeElement
    // the safe choice gets the focus, not the destructive one
    const focusTimer = window.setTimeout(() => cancelRef.current?.focus(), 0)

    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCancel()
        return
      }
      if (event.key !== 'Tab') return

      /* Keep Tab inside the panel. Without this the page behind stays
         reachable, and a keyboard user can "answer" a modal question by
         going somewhere else entirely. */
      const focusable = panelRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      // hand focus back to whatever opened the dialog
      if (returnTo.current instanceof HTMLElement) returnTo.current.focus()
    }
  }, [open, onCancel])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cfm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease }}
        >
          <div className="cfm-scrim" onClick={onCancel} aria-hidden="true" />

          <motion.div
            className="cfm-panel"
            ref={panelRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={bodyId}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.28, ease }}
          >
            <span className="cfm-ic" aria-hidden="true"><Icon.spark /></span>
            <h2 id={titleId}>{title}</h2>
            <p id={bodyId}>{body}</p>

            <div className="cfm-actions">
              <button type="button" className="btn btn-light" ref={cancelRef} onClick={onCancel}>
                {cancelLabel}
              </button>
              <button type="button" className="btn cfm-danger" onClick={onConfirm}>
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
