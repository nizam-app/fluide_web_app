import { Fragment } from 'react'
import { Box } from '@chakra-ui/react'
import { BrandName } from './BrandName'

const PUNCT_AFTER = /^([.,;:!?])(.*)$/s

/**
 * Keeps "Flunexia," or "Flunexia." in one notranslate chunk so Chrome Translate
 * cannot glue the next word (e.g. "FlunexiaCentralisez").
 */
export function BrandLockWithPunct({ punct }) {
  return (
    <Box
      as="span"
      translate="no"
      lang="zxx"
      className="notranslate brand-lock brand-lock--inline brand-lock--attach-after"
      display="inline-block"
      whiteSpace="nowrap"
    >
      <BrandName inline attachAfter />
      {punct}
    </Box>
  )
}

export function splitAfterPunctuation(after) {
  if (!after) return { punct: '', rest: '' }
  const match = after.match(PUNCT_AFTER)
  if (!match) return { punct: '', rest: after }
  return { punct: match[1], rest: match[2] }
}

export function BrandInlineText({ before, after }) {
  const { punct, rest } = splitAfterPunctuation(after)

  return (
    <>
      <Box as="span" translate="yes">
        {before}
      </Box>
      {punct ? (
        <BrandLockWithPunct punct={punct} />
      ) : (
        <BrandName inline />
      )}
      {rest ? (
        <Box as="span" translate="yes">
          {rest}
        </Box>
      ) : null}
    </>
  )
}

/** For textWithBrand: render brand + leading punctuation from the next segment */
export function renderBrandWithFollowingText(part, index, parts) {
  const next = parts[index + 1] ?? ''
  const { punct, rest } = splitAfterPunctuation(next)

  if (punct) {
    return (
      <Fragment key={`brand-${index}`}>
        <BrandLockWithPunct punct={punct} />
        {rest ? (
          <span translate="yes">{rest}</span>
        ) : null}
      </Fragment>
    )
  }

  return <BrandName key={`brand-${index}`} inline />
}

export function shouldSkipSegmentAfterBrand(part, index, parts) {
  if (index === 0) return false
  const prev = parts[index - 1]
  if (prev?.toLowerCase() !== 'flunexia') return false
  return PUNCT_AFTER.test(part)
}
