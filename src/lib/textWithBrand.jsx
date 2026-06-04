import { BrandName } from '../components/atoms/BrandName'
import {
  renderBrandWithFollowingText,
  shouldSkipSegmentAfterBrand,
} from '../components/atoms/BrandInlineText'

/** Splits copy and wraps every "Flunexia" mention so machine translators skip the brand */
export function textWithBrand(text) {
  if (!text || typeof text !== 'string') return text

  const parts = text.split(/(Flunexia)/gi)
  if (parts.length === 1) return text

  return parts.map((part, index) => {
    if (!part) return null
    if (shouldSkipSegmentAfterBrand(part, index, parts)) return null

    if (part.toLowerCase() === 'flunexia') {
      return renderBrandWithFollowingText(part, index, parts)
    }

    let segment = part
    const prevIsBrand = index > 0 && parts[index - 1]?.toLowerCase() === 'flunexia'
    const nextIsBrand = index < parts.length - 1 && parts[index + 1]?.toLowerCase() === 'flunexia'

    if (nextIsBrand) segment = segment.replace(/\s+$/, '')
    if (prevIsBrand) segment = segment.replace(/^\s+/, '')

    return (
      <span key={`text-${index}`} translate="yes">
        {segment}
      </span>
    )
  })
}
