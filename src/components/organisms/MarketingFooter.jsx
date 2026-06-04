import { Box, Flex, HStack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { BrandInlineText } from '../atoms/BrandInlineText'
import { FluideLogo } from '../atoms/FluideLogo'
import { FOOTER } from '../../content/homeMarketing'
import { useLocale } from '../../context/LocaleContext'

export function MarketingFooter({ compact = false }) {
  const { locale } = useLocale()
  const copy = FOOTER[locale]

  return (
    <Box as="footer" w="full" py="8" borderTopWidth="1px" borderColor="outlineVariant" bg="surface" mt="auto">
      <Flex
        maxW="contentMax"
        mx="auto"
        px={{ base: 'marginMobile', lg: 'marginDesktop' }}
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align="center"
        gap="4"
      >
        <Flex direction="column" gap="3" align={{ base: 'center', md: 'flex-start' }}>
          <FluideLogo to="/" />
          {!compact && (
            <Text textStyle="bodySm" color="onSurfaceVariant" display={{ base: 'none', sm: 'block' }}>
              {copy.tagline}
            </Text>
          )}
          <Text textStyle="bodySm" color="onSurfaceVariant" as="span" display="block">
            <BrandInlineText before={copy.copyrightBefore} after={copy.copyrightAfter} />
          </Text>
        </Flex>
        <HStack as="nav" gap="6" flexWrap="wrap" justify="center">
          {copy.links.map((link) => (
            <RouterLink key={link.label} to={link.href}>
              <Text textStyle="bodySm" color="onSurfaceVariant" textDecoration="underline" _hover={{ color: 'primary' }}>
                {link.label}
              </Text>
            </RouterLink>
          ))}
        </HStack>
      </Flex>
    </Box>
  )
}
