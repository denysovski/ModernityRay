// Pull raw photography from assets/source into public/img, resized and
// compressed the same way scripts/optimize-images.mjs treats the rest.
//
//   1. drop the original in assets/source
//   2. add a line to MAP below, naming it for what it shows
//   3. npm run images:ingest
//
// Originals stay in assets/source and are never served or bundled.
import sharp from 'sharp'
import { access, mkdir, stat } from 'node:fs/promises'
import path from 'node:path'

const SRC = path.resolve('assets/source')
const OUT = path.resolve('public/img')
await mkdir(OUT, { recursive: true })

const MAP = {
  'fitsum-admasu-oGv9xIl7DkY-unsplash.jpg': 'runners.jpg',
  'ilya-shishikhin-bpz-MQJDJuA-unsplash.jpg': 'airborne.jpg',
  'josh-nuttall-uNQ-TTg_qNY-unsplash.jpg': 'strength.jpg',
  'maxim-hopman-xyDkHkvDYp4-unsplash.jpg': 'floodlights.jpg',
  'teo-zac-WssrChikeeU-unsplash.jpg': 'night.jpg',
  'will-truettner-7FVfZSPaY34-unsplash.jpg': 'cycling.jpg',
  'adam-seckel-caIuSRJEnyE-unsplash.jpg': 'aerial.jpg',
  'christina-moroz-v0f_sspLB-o-unsplash.jpg': 'stretch.jpg',
  'dillon-wanner-heZ87Px7NHc-unsplash.jpg': 'courtside.jpg',
  'gentrit-sylejmani-JjUyjE-oEbM-unsplash.jpg': 'swim.jpg',
  'jeffery-erhunse-xvl_cfsMQ8M-unsplash.jpg': 'courtlife.jpg',
  'jeffrey-f-lin-oBxX10dsZJk-unsplash.jpg': 'fixture.jpg',
  'olga-guryanova-ft7vJxwl2RY-unsplash.jpg': 'scrum.jpg',
  'omar-abozeid-IJcWXo-IZv4-unsplash.jpg': 'lanes.jpg',
  'ryan-searle-qjrjJnFypa0-unsplash.jpg': 'woodcourt.jpg',
  'shayna-douglas-VibRcV8tMDM-unsplash.jpg': 'bluesky.jpg',
  'valentin-balan-k0aVMMZwqtU-unsplash.jpg': 'baseline.jpg',
  'vitaly-gariev-az_3xzrPNtg-unsplash.jpg': 'yoga.jpg',
}

for (const [src, name] of Object.entries(MAP)) {
  const inPath = path.join(SRC, src)
  try {
    await access(inPath)
  } catch {
    console.log(`skip ${src} (not in assets/source)`)
    continue
  }
  const before = (await stat(inPath)).size
  const outPath = path.join(OUT, name)
  await sharp(inPath)
    .rotate()
    // cap both axes — portrait sources would otherwise come out enormous
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(outPath)
  const after = (await stat(outPath)).size
  console.log(
    `${src} -> img/${name}: ${(before / 1024 / 1024).toFixed(2)}MB -> ${(after / 1024).toFixed(0)}KB`,
  )
}
console.log('done')
