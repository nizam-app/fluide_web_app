import { Box } from '@chakra-ui/react'
import { MarketingNav } from '../organisms/MarketingNav'
import { MarketingFooter } from '../organisms/MarketingFooter'

export function MarketingLayout({ children }) {
  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="background">
      <MarketingNav />
      <Box as="main" flex="1">
        {children}
      </Box>
      <MarketingFooter />
    </Box>
  )
}
