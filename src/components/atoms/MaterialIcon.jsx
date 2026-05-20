import { Box } from '@chakra-ui/react'

export function MaterialIcon({ name, filled = false, size = 24, ...props }) {
  return (
    <Box
      as="span"
      className={`material-symbols-outlined${filled ? ' filled' : ''}`}
      fontSize={`${size}px`}
      lineHeight="1"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      {...props}
    >
      {name}
    </Box>
  )
}
