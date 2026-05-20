import { useState } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { PortalHeader } from '../organisms/PortalHeader'
import { PortalSidebar } from '../organisms/PortalSidebar'

/** Authenticated app shell: header + role sidebar (collapsible on mobile). */
export function PortalLayout({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="background">
      <PortalHeader onMenuToggle={() => setMobileNavOpen((o) => !o)} />
      <Flex flex="1" minH="0">
        <PortalSidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
        <Box as="main" flex="1" minW="0" overflow="auto">
          {children}
        </Box>
      </Flex>
    </Box>
  )
}
