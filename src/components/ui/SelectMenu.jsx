import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Icon } from './Icon'

/* The app's one dropdown. Every menu that picks a value uses it.
 *
 * A native <select> cannot be styled past its border: the popup is drawn by
 * the operating system, square-cornered, and it appears and disappears with
 * no transition at all. This is the same control with the menu as real DOM,
 * so it gets the app's radius and an open/close animation — and so the
 * sort menu and the country field cannot drift apart.
 *
 * What the native element gave for free and is reimplemented here:
 *   - the menu closes on Escape, and on a click anywhere outside it,
 *   - focus returns to the trigger when it closes, so the keyboard does not
 *     get stranded on a removed element,
 *   - the arrow keys and Home/End move through the options, Enter picks one,
 *     and typing a letter jumps to the next option starting with it,
 *   - role="listbox" / aria-selected / aria-expanded describe the state to a
 *     screen reader, which otherwise sees a button and some buttons.
 */

const ease = [0.22, 1, 0.36, 1]

/** Accepts ['Spain', …] as well as [{ id, label }, …]. */
const normalise = (options) =>
  options.map((o) => (typeof o === 'string' ? { id: o, label: o } : o))

/**
 * @param {object} props
 * @param {string} [props.label]        small uppercase label beside the trigger
 * @param {(string|{id: string, label: string})[]} props.options
 * @param {string} props.value          id of the selected option
 * @param {(id: string) => void} props.onChange
 * @param {boolean} [props.block]       full-width, styled as a form field
 * @param {string} [props.id]           id for the trigger, so a <label> can point at it
 * @param {string} [props.name]         reported on the trigger for form tooling
 * @param {boolean} [props.invalid]
 * @param {string} [props.describedBy]
 * @param {string} [props.placeholder]  shown when nothing is selected yet
 */
export default function SelectMenu({
  label,
  options,
  value,
  onChange,
  block = false,
  id,
  name,
  invalid = false,
  describedBy,
  placeholder = 'Choose…',
}) {
  const items = normalise(options)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(() =>
    Math.max(0, items.findIndex((o) => o.id === value)),
  )
  const wrapRef = useRef(null)
  const triggerRef = useRef(null)
  const listId = useId()
  // collects keystrokes for type-ahead, cleared after a pause
  const typed = useRef({ text: '', at: 0 })

  const selected = items.find((o) => o.id === value)

  /* Close on an outside click or on Escape. Both listeners are attached
     only while the menu is open, so a closed menu costs nothing. */
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

  const pick = (nextId) => {
    onChange(nextId)
    setOpen(false)
    triggerRef.current?.focus()
  }

  const toggle = () => {
    setActive(Math.max(0, items.findIndex((o) => o.id === value)))
    setOpen((o) => !o)
  }

  const onListKeyDown = (event) => {
    const last = items.length - 1
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
      pick(items[active].id)
    } else if (event.key.length === 1 && /\S/.test(event.key)) {
      /* Type-ahead. A country list is long enough that arrowing to
         "Switzerland" is unreasonable, and it is what the native control
         would have done. */
      event.preventDefault()
      const now = Date.now()
      typed.current.text = now - typed.current.at > 700 ? event.key : typed.current.text + event.key
      typed.current.at = now
      const needle = typed.current.text.toLowerCase()
      const hit = items.findIndex((o) => o.label.toLowerCase().startsWith(needle))
      if (hit >= 0) setActive(hit)
    }
  }

  return (
    <div className={`selectmenu ${block ? 'is-block' : ''}`} ref={wrapRef}>
      {label && <span className="selectmenu-label">{label}</span>}
      <button
        type="button"
        id={id}
        name={name}
        ref={triggerRef}
        className={`selectmenu-trigger ${open ? 'is-open' : ''} ${invalid ? 'is-bad' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={toggle}
      >
        <span className="selectmenu-value">{selected ? selected.label : placeholder}</span>
        <Icon.chevron className="selectmenu-chevron" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            tabIndex={-1}
            aria-label={label || placeholder}
            className="selectmenu-list"
            /* Scaled from its top edge rather than its centre, so it reads
               as unfolding out of the trigger it hangs from. */
            initial={{ opacity: 0, y: -8, scaleY: 0.88 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.92 }}
            transition={{ duration: 0.22, ease }}
            onKeyDown={onListKeyDown}
            ref={(el) => el?.focus()}
          >
            {items.map((o, i) => (
              <li key={o.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={o.id === value}
                  className={`selectmenu-option ${o.id === value ? 'is-selected' : ''} ${
                    i === active ? 'is-active' : ''
                  }`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => pick(o.id)}
                >
                  <span>{o.label}</span>
                  {o.id === value && <Icon.check className="selectmenu-tick" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
