import { Box, Flex, Grid, SimpleGrid, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { MaterialIcon } from '../atoms/MaterialIcon'
import { MARKETING_PAGE_UI } from '../../content/marketingPages'
import { useLocale } from '../../context/LocaleContext'
import { textWithBrand } from '../../lib/textWithBrand'

const sectionPx = { base: 'marginMobile', md: 'marginDesktop' }

/**
 * Institutional hero for About, Terms, Privacy, Impact and Contact pages.
 */
export function MarketingPageHero({
  badge,
  title,
  subtitle,
  icon = 'article',
  breadcrumbLabel,
}) {
  const { locale } = useLocale()
  const ui = MARKETING_PAGE_UI[locale]

  return (
    <Box
      w="full"
      position="relative"
      overflow="hidden"
      borderBottomWidth="1px"
      borderColor="whiteAlpha.200"
      style={{
        background: 'linear-gradient(128deg, #0d2818 0%, #1b4332 38%, #1e3a5f 100%)',
      }}
    >
      {/* Subtle grid overlay */}
      <Box
        position="absolute"
        inset="0"
        opacity={0.08}
        pointerEvents="none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <Box maxW="contentMax" mx="auto" px={sectionPx} py={{ base: 10, md: 14 }} position="relative">
        <Flex align="center" gap="2" mb="6" flexWrap="wrap">
          <RouterLink to="/">
            <Text fontSize="sm" color="whiteAlpha.700" fontWeight="600" _hover={{ color: 'accentMint' }}>
              {ui.breadcrumbHome}
            </Text>
          </RouterLink>
          <MaterialIcon name="chevron_right" size={16} color="whiteAlpha.600" />
          <Text fontSize="sm" color="accentMint" fontWeight="700">
            {breadcrumbLabel}
          </Text>
        </Flex>

        <Grid templateColumns={{ base: '1fr', lg: '1fr auto' }} gap="8" alignItems="center">
          <Box maxW="3xl">
            {badge && (
              <Flex
                display="inline-flex"
                align="center"
                gap="2"
                px="3"
                py="1.5"
                mb="4"
                borderRadius="pill"
                bg="whiteAlpha.150"
                borderWidth="1px"
                borderColor="whiteAlpha.300"
              >
                <MaterialIcon name={icon} size={16} color="accentMint" />
                <Text fontSize="xs" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color="whiteAlpha.900">
                  {badge}
                </Text>
              </Flex>
            )}

            <Text
              as="h1"
              fontSize={{ base: '2.25rem', md: '3rem', lg: '3.25rem' }}
              lineHeight="1.1"
              fontWeight="800"
              letterSpacing="-0.03em"
              color="white"
              mb="4"
            >
              {title}
            </Text>

            <Text fontSize={{ base: 'md', md: 'lg' }} color="whiteAlpha.900" lineHeight="1.7" maxW="2xl">
              {textWithBrand(subtitle)}
            </Text>
          </Box>

          <Flex
            display={{ base: 'none', lg: 'flex' }}
            w="28"
            h="28"
            borderRadius="3xl"
            bg="whiteAlpha.100"
            borderWidth="1px"
            borderColor="whiteAlpha.250"
            align="center"
            justify="center"
            flexShrink={0}
          >
            <MaterialIcon name={icon} size={56} color="accentMint" />
          </Flex>
        </Grid>
      </Box>
    </Box>
  )
}

export function MarketingTrustStrip() {
  const { locale } = useLocale()
  const ui = MARKETING_PAGE_UI[locale]

  return (
    <Box w="full" bg="surface" borderBottomWidth="1px" borderColor="outlineVariant">
      <Box maxW="contentMax" mx="auto" px={sectionPx} py={{ base: 6, md: 7 }}>
        <Text
          textAlign="center"
          fontSize="xs"
          fontWeight="700"
          letterSpacing="0.1em"
          textTransform="uppercase"
          color="onSurfaceVariant"
          mb="5"
        >
          {ui.trustHeading}
        </Text>
        <SimpleGrid columns={{ base: 2, md: 4 }} gap="4">
          {ui.trustItems.map((item) => (
            <Flex
              key={item.label}
              direction="column"
              align="center"
              textAlign="center"
              gap="2"
              p="4"
              borderRadius="fluide3xl"
              bg="surfaceContainerLow"
              borderWidth="1px"
              borderColor="outlineVariant"
            >
              <Flex w="10" h="10" borderRadius="full" bg="primaryContainer" align="center" justify="center">
                <MaterialIcon name={item.icon} size={22} color="primary" />
              </Flex>
              <Text fontSize="sm" fontWeight="700" color="onSurface">
                {item.label}
              </Text>
            </Flex>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  )
}

export function MarketingHighlightCards({ items }) {
  if (!items?.length) return null

  return (
    <Box w="full" bg="background" borderBottomWidth="1px" borderColor="outlineVariant">
      <Box maxW="contentMax" mx="auto" px={sectionPx} py={{ base: 8, md: 10 }}>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap="5">
          {items.map((item) => (
            <Flex
              key={item.title}
              bg="surface"
              p="6"
              borderRadius="fluide3xl"
              borderWidth="1px"
              borderColor="outlineVariant"
              shadow="level1"
              align="flex-start"
              gap="4"
              h="full"
            >
              <Flex
                w="12"
                h="12"
                borderRadius="xl"
                bg="primaryContainer"
                align="center"
                justify="center"
                flexShrink={0}
              >
                <MaterialIcon name={item.icon} size={24} color="primary" />
              </Flex>
              <Box>
                <Text fontSize="md" fontWeight="700" color="onSurface" mb="1.5">
                  {item.title}
                </Text>
                <Text fontSize="sm" color="onSurfaceVariant" lineHeight="1.65">
                  {textWithBrand(item.text)}
                </Text>
              </Box>
            </Flex>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  )
}
