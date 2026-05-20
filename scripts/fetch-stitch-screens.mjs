/**
 * Fetches screen list + asset URLs from a Stitch project.
 * Requires STITCH_API_KEY in the environment (see https://github.com/google-labs-code/stitch-sdk).
 *
 * Usage: STITCH_API_KEY=... node scripts/fetch-stitch-screens.mjs [projectId]
 */
import { stitch } from '@google/stitch-sdk'

const projectId = process.argv[2] ?? '1544471542847675581'

async function main() {
  const project = stitch.project(projectId)
  const screens = await project.screens()
  console.log(`Project ${projectId}: ${screens.length} screen(s)\n`)

  for (const screen of screens) {
    const html = await screen.getHtml()
    const image = await screen.getImage()
    console.log(`Screen ${screen.screenId ?? screen.id}`)
    console.log(`  HTML:  ${html}`)
    console.log(`  Image: ${image}\n`)
  }
}

main().catch((err) => {
  console.error(err.message ?? err)
  process.exit(1)
})
