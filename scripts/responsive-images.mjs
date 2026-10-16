/* Generates responsive WebP derivatives for every photograph.
 *
 * The originals in public/img are 1600px JPEGs of 200–550 kB each. A phone
 * showing a 400px-wide card downloads all of it, which is what pinned
 * largest-contentful-paint at nearly ten seconds on a throttled connection.
 *
 * For each source this writes public/img/w<width>/<name>.webp at the widths
 * below, and components/ui/Img builds a <picture> with the matching srcset.
 * The original JPEG stays put as the fallback for browsers without WebP and
 * as the source of truth for re-runs — nothing here is destructive, and the
 * script is idempotent: a derivative newer than its source is skipped.
 *
 *   npm run images:responsive
 */
import sharp from 'sharp'
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

const SRC = path.resolve('public/img')

/** Covers a 400px card at 2x, a half-width banner, and a full-bleed hero. */
export const WIDTHS = [480, 800, 1200, 1600]

const QUALITY = 72

const exists = async (p) => {
  try {
    return await stat(p)
  } catch {
    return null
  }
}

const files = (await readdir(SRC)).filter((f) => /\.jpe?g$/i.test(f))
if (files.length === 0) {
  console.error('no source images in public/img')
  process.exit(1)
}

let written = 0
let skipped = 0
let bytesBefore = 0
let bytesAfter = 0

for (const file of files) {
  const inPath = path.join(SRC, file)
  const source = await stat(inPath)
  const name = file.replace(/\.jpe?g$/i, '')
  const meta = await sharp(inPath).metadata()
  bytesBefore += source.size

  for (const width of WIDTHS) {
    // never upscale: a 1200px-wide original gets no 1600 variant
    if (meta.width && meta.width < width && width !== WIDTHS[0]) continue

    const dir = path.join(SRC, `w${width}`)
    await mkdir(dir, { recursive: true })
    const outPath = path.join(dir, `${name}.webp`)

    const existing = await exists(outPath)
    if (existing && existing.mtimeMs > source.mtimeMs) {
      skipped++
      bytesAfter += existing.size
      continue
    }

    await sharp(inPath)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(outPath)

    const out = await stat(outPath)
    bytesAfter += out.size
    written++
  }
}

/* A manifest so the Img component knows which widths actually exist for a
   given photograph (instead of requesting a derivative that was skipped), and
   what shape it is, so it can reserve the box before the file lands. */
const manifest = {}
for (const file of files) {
  const name = file.replace(/\.jpe?g$/i, '')
  const widths = []
  for (const width of WIDTHS) {
    if (await exists(path.join(SRC, `w${width}`, `${name}.webp`))) widths.push(width)
  }
  const { width = null, height = null } = await sharp(path.join(SRC, file)).metadata()
  manifest[name] = { widths, width, height }
}

await writeFile(
  path.resolve('src/data/image-manifest.json'),
  JSON.stringify(manifest, null, 2) + '\n',
)

const mb = (n) => (n / 1024 / 1024).toFixed(2) + ' MB'
console.log(`${written} written, ${skipped} up to date`)
console.log(`source JPEGs ${mb(bytesBefore)} -> all WebP derivatives ${mb(bytesAfter)}`)
console.log('manifest: src/data/image-manifest.json')
