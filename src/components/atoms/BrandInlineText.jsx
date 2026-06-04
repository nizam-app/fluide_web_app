import { Box } from '@chakra-ui/react'
import { BrandName } from './BrandName'

/** Ensures one word space before the brand when `before` has no trailing space */
function withTrailingSpace(text) {
  if (!text) return text
  return text.endsWith(' ') ? text : `${text} `
}

/**
 * Sentence with locked brand — spaces live in translatable spans;
 * punctuation (, .) stays in `after` with no gap before it (no margin on brand right).
 */
export function BrandInlineText({ before, after }) {
  const afterGlued = after?.startsWith(',') || after?.startsWith('.') || after?.startsWith(';')

  return (
    <>
      <Box as="span" translate="yes">
        {withTrailingSpace(before)}
      </Box>
      <BrandName inline attachAfter={afterGlued} />
      <Box as="span" translate="yes">
        {after}
      </Box>
    </>
  )
}
