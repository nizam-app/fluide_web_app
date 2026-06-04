import { Box } from '@chakra-ui/react'

/**
 * Brand lock — prevents browser / Google Translate from altering "Flunexia".
 * Use translate="no" + notranslate (both are needed for broad browser support).
 */
export function BrandName({
  children = 'Flunexia',
  as = 'span',
  uppercase = false,
  inline = false,
  attachAfter = false,
  ...props
}) {
  const label = uppercase ? String(children).toUpperCase() : children
  const inlineClass = inline
    ? ` brand-lock--inline${attachAfter ? ' brand-lock--attach-after' : ''}`
    : ''

  return (
    <Box
      as={as}
      translate="no"
      lang="zxx"
      className={`notranslate brand-lock${inlineClass}`}
      display={inline ? 'inline-block' : 'inline'}
      fontWeight="inherit"
      fontSize="inherit"
      lineHeight="inherit"
      color="inherit"
      letterSpacing="inherit"
      {...props}
    >
      {label}
    </Box>
  )
}
