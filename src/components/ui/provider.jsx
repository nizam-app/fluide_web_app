import { ChakraProvider } from '@chakra-ui/react'
import { fluideSystem } from '../../theme/fluide-theme'

export function Provider({ children }) {
  return <ChakraProvider value={fluideSystem}>{children}</ChakraProvider>
}
