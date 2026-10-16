import manifest from '../../data/image-manifest.json'

/* A photograph, served at the size the viewport actually needs.
 *
 * Every picture on the site is a 1600px JPEG of 200–550 kB. Handing a phone
 * the full file to paint a 400px card is what held largest-contentful-paint
 * near ten seconds; this component emits the WebP derivatives built by
 * scripts/responsive-images.mjs and lets the browser pick.
 *
 * The <picture> element rather than a plain srcset, because the sources are a
 * different *format* as well as a different size: browsers without WebP fall
 * through to the original JPEG in the <img>, which is also what the srcset
 * manifest guarantees always exists.
 *
 * `sizes` is the one thing a caller must think about. It tells the browser how
 * wide the image will be *before* layout is known, so a wrong value means the
 * wrong file is fetched. Each call site passes the CSS reality of its slot.
 */

const BASE = import.meta.env.BASE_URL

/** '/ModernityRay/img/clay.jpg' -> 'clay' */
const nameOf = (src) => {
  if (typeof src !== 'string') return null
  const file = src.split('/').pop() || ''
  const match = /^(.+)\.(jpe?g|png|webp)$/i.exec(file)
  return match ? match[1] : null
}

/**
 * @param {object} props
 * @param {string} props.src        the original URL, from data/images local()
 * @param {string} props.alt        '' for decorative images, which is deliberate
 * @param {string} [props.sizes]    CSS width of the slot, e.g. '(max-width: 700px) 100vw, 420px'
 * @param {'lazy'|'eager'} [props.loading]
 * @param {'high'|'low'|'auto'} [props.fetchPriority]  'high' for the LCP image only
 * @param {string} [props.className]  applied to the <img>, so existing CSS keeps working
 */
export default function Img({
  src,
  alt = '',
  sizes = '100vw',
  loading = 'lazy',
  fetchPriority,
  className,
  pictureClassName,
  ...rest
}) {
  const name = nameOf(src)
  const entry = (name && manifest[name]) || null
  const widths = entry?.widths || []

  /* width/height are the intrinsic ratio, not the rendered size: CSS still
     decides how big the image is, and these only tell the browser what shape
     box to reserve while it downloads. */
  const dims =
    entry?.width && entry?.height ? { width: entry.width, height: entry.height } : null

  const img = (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      // React 18 does not camel-case this one for us
      fetchpriority={fetchPriority}
      className={className}
      {...dims}
      {...rest}
    />
  )

  // no derivatives (a remote avatar, or an image added since the last build)
  if (widths.length === 0) return img

  const srcSet = widths.map((w) => `${BASE}img/w${w}/${name}.webp ${w}w`).join(', ')

  return (
    <picture className={pictureClassName}>
      <source type="image/webp" srcSet={srcSet} sizes={sizes} />
      {img}
    </picture>
  )
}
