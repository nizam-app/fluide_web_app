import { BrandName } from '../components/atoms/BrandName'

/** Splits copy and wraps every "Flunexia" mention so machine translators skip the brand */
export function textWithBrand(text) {
  if (!text || typeof text !== 'string') return text

  const parts = text.split(/(Flunexia)/gi)
  if (parts.length === 1) return text

  return parts.map((part, index) => {
    if (!part) return null
    if (part.toLowerCase() === 'flunexia') {
      return <BrandName key={`brand-${index}`} uppercase={part === 'FLUNEXIA'} />
    }
    return part
  })
}
