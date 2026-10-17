import { Icon } from './Icon'

/* A coach's social handles, as icon bubbles.
 *
 * Shared by the programmes index and the programme detail pages so the same
 * person shows the same handles in both places.
 *
 * The links do not go anywhere. This is a coursework build with no real club
 * behind it, and inventing an Instagram URL for an invented person would
 * point at somebody else's account. They are rendered as buttons rather than
 * as anchors with a dead href, so nothing claims to be a link that is not —
 * see the inert footer legal links for the same decision.
 */

const KINDS = {
  instagram: { icon: Icon.instagram, label: 'Instagram' },
  x: { icon: Icon.x, label: 'X' },
  linkedin: { icon: Icon.linkedin, label: 'LinkedIn' },
  mail: { icon: Icon.mail, label: 'Email' },
}

/**
 * @param {object} props
 * @param {('instagram'|'x'|'linkedin'|'mail')[]} props.socials
 * @param {string} props.name  whose handles these are, for the labels
 */
export default function CoachSocials({ socials = [], name }) {
  if (socials.length === 0) return null

  return (
    <ul className="coach-socials">
      {socials.map((kind) => {
        const entry = KINDS[kind]
        if (!entry) return null
        const Glyph = entry.icon
        return (
          <li key={kind}>
            <button
              type="button"
              className="coach-social"
              aria-label={`${name} on ${entry.label}`}
              title={entry.label}
            >
              <Glyph aria-hidden="true" />
            </button>
          </li>
        )
      })}
    </ul>
  )
}
