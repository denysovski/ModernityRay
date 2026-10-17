import { useId } from 'react'
import { SelectMenu } from '../ui'

/* One text field, with its label, its error and the wiring between them.
 *
 * Accessibility is the reason this is a component rather than inline markup:
 * every field needs a label tied to the input by id, `aria-invalid` when it
 * fails, `aria-describedby` pointing at the message, and `role="alert"` on the
 * message so a screen reader announces it. Getting that right once and reusing
 * it beats getting it wrong in eleven places.
 *
 * Errors are shown only once a field has been touched or the step has been
 * submitted, so the form does not shout at someone who has not typed yet.
 */

/**
 * @param {object} props
 * @param {string} props.label
 * @param {string} props.value
 * @param {(value: string) => void} props.onChange  receives the value, not the event
 * @param {string} [props.error]      message from lib/validation, or falsy
 * @param {boolean} [props.show]      whether to reveal the error yet
 * @param {string} [props.hint]       static help text, replaced by the error
 * @param {string} [props.type]
 * @param {string} [props.autoComplete]
 * @param {(value: string) => string} [props.mask]  formats as the user types
 * @param {string[]} [props.options]  renders a <select> instead of an <input>
 */
export default function Field({
  label,
  value,
  onChange,
  error,
  show = false,
  hint,
  type = 'text',
  autoComplete,
  mask,
  options,
  inputMode,
  placeholder,
  maxLength,
  required = true,
  name,
}) {
  const id = useId()
  const msgId = `${id}-msg`
  const invalid = Boolean(error) && show

  const handle = (e) => onChange(mask ? mask(e.target.value) : e.target.value)

  const shared = {
    id,
    name,
    value,
    onChange: handle,
    'aria-invalid': invalid || undefined,
    'aria-describedby': invalid || hint ? msgId : undefined,
    'aria-required': required || undefined,
  }

  return (
    <div className={`fld ${invalid ? 'is-bad' : ''}`}>
      <label className="fld-label" htmlFor={id}>
        {label}
      </label>

      {options ? (
        /* Our own menu rather than a <select>: the native popup is drawn by
           the OS, so it cannot take the app's radius and cannot animate.
           SelectMenu reimplements what the element gave for free — Escape,
           outside-click, arrow keys, type-ahead and the listbox roles. */
        <SelectMenu
          block
          id={id}
          name={name}
          options={options}
          value={value}
          onChange={onChange}
          invalid={invalid}
          describedBy={invalid || hint ? msgId : undefined}
        />
      ) : (
        <input
          className="fld-input"
          type={type}
          autoComplete={autoComplete}
          inputMode={inputMode}
          placeholder={placeholder}
          maxLength={maxLength}
          {...shared}
        />
      )}

      {invalid ? (
        <p className="fld-msg fld-err" id={msgId} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="fld-msg" id={msgId}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}
