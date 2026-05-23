import { Box } from '@chakra-ui/react'

/**
 * Material Symbols icon — ligature text must not be machine-translated
 * (otherwise "add" becomes "AJOUTER" next to buttons, etc.)
 */
export function MaterialIcon({ name, filled = false, size = 24, decorative = true, ...props }) {
  return (
    <Box
      as="span"
      className={`material-symbols-outlined notranslate${filled ? ' filled' : ''}`}
      translate="no"
      lang="zxx"
      aria-hidden={decorative ? true : undefined}
      fontSize={`${size}px`}
      lineHeight="1"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      {...props}
    >
      {name}
    </Box>
  )
}
