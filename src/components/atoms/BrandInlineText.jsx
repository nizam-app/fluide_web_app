import { Fragment } from 'react'
import { Box } from '@chakra-ui/react'
import { BrandName } from './BrandName'

/** Punctuation + spaces after it (e.g. ", "). */
const PUNCT_AFTER = /^([.,;:!?])(\s*)(.*)$/s

/**
 * Locked chunk: leading space + Flunexia + suffix (e.g. ", " or " " before "sur").
 * Survives Chrome Translate (no "Flunexiasur" / "AvecFlunexia,Centralisez").
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

/** Split text after the brand: lock punctuation/spaces; only the rest is translated. */
export function splitAfterBrand(after) {
  if (!after) return { suffix: '', rest: '' }

  const punctMatch = after.match(PUNCT_AFTER)
  if (punctMatch) {
    return {
      suffix: punctMatch[1] + punctMatch[2],
      rest: punctMatch[3],
    }
  }

  const spaceMatch = after.match(/^(\s+)(.*)$/s)
  if (spaceMatch) {
    return {
      suffix: ' ',
      rest: spaceMatch[2],
    }
  }

  return { suffix: '', rest: after }
}

export function BrandInlineText({ before, after }) {
  const { suffix, rest } = splitAfterBrand(after)
  const trimmedBefore = before?.replace(/\s+$/, '') ?? ''

  return (
    <>
      <Box as="span" translate="yes">
        {trimmedBefore}
      </Box>
      <BrandLockChunk suffix={suffix} />
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
  const { suffix, rest } = splitAfterBrand(next)

  return (
    <Fragment key={`brand-${index}`}>
      <BrandLockChunk suffix={suffix} />
      {rest ? <span translate="yes">{rest}</span> : null}
    </Fragment>
  )
}

export function shouldSkipSegmentAfterBrand(part, index, parts) {
  if (index === 0) return false
  const prev = parts[index - 1]
  if (prev?.toLowerCase() !== 'flunexia') return false
  return PUNCT_AFTER.test(part) || /^\s/.test(part)
}
