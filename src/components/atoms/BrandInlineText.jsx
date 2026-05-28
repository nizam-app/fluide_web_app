import { Box } from '@chakra-ui/react'
import { BrandName } from './BrandName'

/**
 * Sentence with locked brand name — margins on the brand survive Chrome Translate
 * (translate="no" would otherwise eat spaces beside Flunexia).
 */
export function BrandInlineText({ before, after }) {
  return (
    <>
      <Box as="span" translate="yes">
        {before}
      </Box>
      <BrandName inline />
      <Box as="span" translate="yes">
        {after}
      </Box>
    </>
  )
}
