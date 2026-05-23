import { Box } from '@chakra-ui/react'

/**
 * Brand lock — prevents browser / Google Translate from altering "Flunexia".
 * Use translate="no" + notranslate (both are needed for broad browser support).
 */
export function BrandName({
  children = 'Flunexia',
  as = 'span',
  uppercase = false,
  ...props
}) {
  const label = uppercase ? String(children).toUpperCase() : children

  return (
    <Box
      as={as}
      translate="no"
      lang="zxx"
      className="notranslate brand-lock"
      display="inline"
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
