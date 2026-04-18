// Generates og.png and apple-icon.png from SVG sources.
// Run: node scripts/generate-assets.mjs

import sharp from 'sharp'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const ogSvg = readFileSync(join(root, 'public/og.svg'))
const logoSvg = readFileSync(join(root, 'public/brand/logo.svg'))

await sharp(ogSvg)
  .resize(1200, 630)
  .png()
  .toFile(join(root, 'public/og.png'))
console.log('✓ public/og.png')

await sharp(logoSvg)
  .resize(180, 180)
  .png()
  .toFile(join(root, 'app/apple-icon.png'))
console.log('✓ app/apple-icon.png')

await sharp(logoSvg)
  .resize(32, 32)
  .png()
  .toFile(join(root, 'public/favicon.ico'))
console.log('✓ public/favicon.ico')
