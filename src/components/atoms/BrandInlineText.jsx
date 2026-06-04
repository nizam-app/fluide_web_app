import { Fragment } from 'react'
import { Box } from '@chakra-ui/react'
import { BrandName } from './BrandName'

/** Punctuation + any spaces after it stay locked to the brand (e.g. ", "). */
const PUNCT_AFTER = /^([.,;:!?])(\s*)(.*)$/s

/**
 * Locked chunk: leading space + Flunexia + suffix (e.g. ", ").
 * Survives Chrome Translate so you get "Avec Flunexia, centralisez" not "AvecFlunexia,Centralisez".
 */
export function BrandLockChunk({ suffix = '' }) {
  return (
    <Box
      as="span"
      translate="no"
      lang="zxx"
      className="notranslate brand-lock brand-lock--chunk"
      display="inline"
    >
      {' '}
      <BrandName inline attachAfter />
      {suffix}
    </Box>
  )
}

export function splitAfterPunctuation(after) {
  if (!after) return { suffix: null, rest: '' }
  const match = after.match(PUNCT_AFTER)
  if (!match) return { suffix: null, rest: after }
  return {
    suffix: match[1] + match[2],
    rest: match[3],
  }
}

export function BrandInlineText({ before, after }) {
  const { suffix, rest } = splitAfterPunctuation(after)
  const trimmedBefore = before?.replace(/\s+$/, '') ?? ''

  return (
    <>
      <Box as="span" translate="yes">
        {trimmedBefore}
      </Box>
      <BrandLockChunk suffix={suffix ?? ''} />
      {rest ? (
        <Box as="span" translate="yes">
          {rest}
        </Box>
      ) : null}
    </>
  )
}

export function renderBrandWithFollowingText(part, index, parts) {
  const next = parts[index + 1] ?? ''
  const { suffix, rest } = splitAfterPunctuation(next)

  if (suffix !== null) {
    return (
      <Fragment key={`brand-${index}`}>
        <BrandLockChunk suffix={suffix} />
        {rest ? <span translate="yes">{rest}</span> : null}
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
