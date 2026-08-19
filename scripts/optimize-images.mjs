// Re-compress everything already in public/img in place. Safe to re-run.
// For bringing NEW photography in from assets/source, use ingest-images.mjs.
import sharp from 'sharp'
import { readdir, mkdir, rename, stat } from 'node:fs/promises'
import path from 'node:path'

const SRC = path.resolve('public/img')
const TMP = path.resolve('public/img/_tmp')
await mkdir(TMP, { recursive: true })

const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f))

for (const f of files) {
  const inPath = path.join(SRC, f)
  const out = path.join(TMP, f.replace(/\.(jpe?g|png)$/i, '.jpg'))
  const before = (await stat(inPath)).size
  await sharp(inPath)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(out)
  const after = (await stat(out)).size
  await rename(out, inPath)
  console.log(
    `${f}: ${(before / 1024 / 1024).toFixed(2)}MB -> ${(after / 1024).toFixed(0)}KB`,
  )
}
console.log('done')
