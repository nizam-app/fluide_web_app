import { Button } from '@chakra-ui/react'

export function FilterChip({ active, children, onClick, ...props }) {
  return (
    <Button
      unstyled
      px="4"
      py="2"
      borderRadius="full"
      textStyle="labelMd"
      borderWidth="1px"
      borderColor={active ? 'primary/20' : 'outlineVariant'}
      bg={active ? 'primaryContainer' : 'surfaceContainerLowest'}
      color={active ? 'primary' : 'onSurfaceVariant'}
      cursor="pointer"
      transition="background 0.2s"
      _hover={{ bg: active ? 'primaryContainer' : 'surfaceContainerLow' }}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  )
}
