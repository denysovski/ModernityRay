import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Icon } from './Icon'

/* A sort control, built rather than borrowed.
 *
 * A native <select> cannot be styled past its border: the popup is drawn by
 * the operating system, square-cornered, and it appears and disappears with
 * no transition at all. This is the same control with the menu as real DOM,
 * so it gets the app's radius and an open/close animation.
 *
 * What the native element gave for free and is reimplemented here:
 *   - the menu closes on Escape, and on a click anywhere outside it,
 *   - focus returns to the trigger when it closes, so the keyboard does not
 *     get stranded on a removed element,
 *   - the arrow keys and Home/End move through the options, Enter picks one,
 *   - aria-expanded / role="listbox" / aria-selected describe the state to a
 *     screen reader, which otherwise sees three unlabelled buttons.
 */

const ease = [0.22, 1, 0.36, 1]

/**
 * @param {object} props
 * @param {string} [props.label]  the uppercase label beside the trigger
 * @param {{id: string, label: string}[]} props.options
 * @param {string} props.value    id of the selected option
 * @param {(id: string) => void} props.onChange
 */
export default function SortMenu({ label = 'Sort', options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(() =>
    Math.max(0, options.findIndex((o) => o.id === value)),
  )
  const wrapRef = useRef(null)
  const triggerRef = useRef(null)
  const listId = useId()

  const selected = options.find((o) => o.id === value) ?? options[0]

  /* Close on an outside click or on Escape. Both listeners are only attached
     while the menu is open, so a closed menu costs nothing. */
  useEffect(() => {
    if (!open) return undefined

    const onPointer = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false)
    }
    const onKey = (event) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      triggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const pick = (id) => {
    onChange(id)
    setOpen(false)
    triggerRef.current?.focus()
  }

  const onListKeyDown = (event) => {
    const last = options.length - 1
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((i) => (i >= last ? 0 : i + 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((i) => (i <= 0 ? last : i - 1))
    } else if (event.key === 'Home') {
      event.preventDefault()
      setActive(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setActive(last)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      pick(options[active].id)
    }
  }

  return (
    <div className="sortmenu" ref={wrapRef}>
      <span className="sortmenu-label">{label}</span>
      <button
        type="button"
        ref={triggerRef}
        className={`sortmenu-trigger ${open ? 'is-open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => {
          setActive(Math.max(0, options.findIndex((o) => o.id === value)))
          setOpen((o) => !o)
        }}
      >
        {selected.label}
        <Icon.chevron className="sortmenu-chevron" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            tabIndex={-1}
            aria-label={label}
            className="sortmenu-list"
            /* Scaled from the top edge rather than the centre, so it reads
               as unfolding out of the trigger it is attached to. */
            initial={{ opacity: 0, y: -8, scaleY: 0.88 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.92 }}
            transition={{ duration: 0.22, ease }}
            style={{ transformOrigin: 'top right' }}
            onKeyDown={onListKeyDown}
            ref={(el) => el?.focus()}
          >
            {options.map((o, i) => (
              <li key={o.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={o.id === value}
                  className={`sortmenu-option ${o.id === value ? 'is-selected' : ''} ${
                    i === active ? 'is-active' : ''
                  }`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => pick(o.id)}
                >
                  <span>{o.label}</span>
                  {o.id === value && <Icon.check className="sortmenu-tick" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
