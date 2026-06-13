import { useEffect, useState } from 'react'
import { Box, Button, Flex, Grid, Image, Text } from '@chakra-ui/react'
import QRCode from 'qrcode'
import { BrandInlineText } from '../atoms/BrandInlineText'
import { MaterialIcon } from '../atoms/MaterialIcon'
import { INSTALL_APP } from '../../content/homeMarketing'
import { useLocale } from '../../context/LocaleContext'
import { usePwaInstall } from '../../hooks/usePwaInstall'

const sectionPx = { base: 'marginMobile', md: 'marginDesktop' }

function PhoneQrMockup({ qrDataUrl }) {
  return (
    <Box position="relative" w="full" maxW="13.5rem" mx="auto">
      <Box
        position="absolute"
        inset="-12%"
        borderRadius="full"
        bg="accentMint"
        opacity={0.12}
        filter="blur(24px)"
        aria-hidden
      />
      <Box
        position="relative"
        bg="brandBlack"
        borderRadius="2rem"
        p="2.5"
        pt="3"
        pb="3.5"
        borderWidth="2px"
        borderColor="whiteAlpha.300"
        shadow="0 20px 40px rgba(0,0,0,0.35)"
      >
        <Flex justify="center" mb="2.5" aria-hidden>
          <Box w="14" h="1.5" borderRadius="full" bg="whiteAlpha.400" />
        </Flex>
        <Box bg="surface" borderRadius="xl" p="3" lineHeight={0}>
          {qrDataUrl ? (
            <Image
              src={qrDataUrl}
              alt="QR code to open Flunexia"
              w="full"
              h="auto"
              aspectRatio="1"
              display="block"
              borderRadius="md"
            />
          ) : (
            <Box aspectRatio="1" bg="surfaceContainerLow" borderRadius="md" />
          )}
        </Box>
        <Flex justify="center" gap="1.5" mt="3" aria-hidden>
          <Box w="2" h="2" borderRadius="full" bg="whiteAlpha.300" />
          <Box w="8" h="2" borderRadius="full" bg="whiteAlpha.500" />
          <Box w="2" h="2" borderRadius="full" bg="whiteAlpha.300" />
        </Flex>
      </Box>
    </Box>
  )
}

export function InstallAppBanner() {
  const { locale } = useLocale()
  const copy = INSTALL_APP[locale]
  const { canPromptInstall, install, isInstalled, isIos, showBanner } = usePwaInstall()
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [installing, setInstalling] = useState(false)

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://staging.flunexia.fr'

  useEffect(() => {
    let cancelled = false
    QRCode.toDataURL(appUrl, {
      width: 160,
      margin: 1,
      color: { dark: '#1B4332', light: '#FFFFFF' },
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [appUrl])

  if (!showBanner || isInstalled) return null

  const handleInstall = async () => {
    if (!canPromptInstall) return
    setInstalling(true)
    try {
      await install()
    } finally {
      setInstalling(false)
    }
  }

  return (
    <Box w="full" maxW="contentMax" mx="auto" px={sectionPx} py={{ base: 6, md: 10 }}>
      <Box
        position="relative"
        overflow="hidden"
        borderRadius="fluide3xl"
        px={{ base: 5, sm: 7, lg: 10 }}
        py={{ base: 7, md: 9, lg: 10 }}
        color="white"
        css={{
          background: 'linear-gradient(128deg, #0d2818 0%, #1b4332 42%, #2d6a4f 100%)',
        }}
      >
        <Box
          position="absolute"
          top="-20%"
          right="-8%"
          w="20rem"
          h="20rem"
          borderRadius="full"
          bg="accentMint"
          opacity={0.08}
          aria-hidden
        />
        <Box
          position="absolute"
          bottom="-30%"
          left="-5%"
          w="16rem"
          h="16rem"
          borderRadius="full"
          bg="white"
          opacity={0.04}
          aria-hidden
        />

        <Grid
          templateColumns={{ base: '1fr', md: '1fr auto' }}
          gap={{ base: 8, md: 10, lg: 14 }}
          alignItems="center"
          position="relative"
          zIndex={1}
        >
          <Box maxW={{ md: '34rem' }}>
            <Flex
              display="inline-flex"
              align="center"
              gap="2"
              px="3"
              py="1"
              mb="4"
              borderRadius="pill"
              bg="whiteAlpha.150"
              borderWidth="1px"
              borderColor="whiteAlpha.250"
            >
              <MaterialIcon name="smartphone" size={16} color="accentMint" />
              <Text fontSize="xs" fontWeight="700" letterSpacing="0.06em" textTransform="uppercase">
                {copy.badge}
              </Text>
            </Flex>

            <Text
              as="h2"
              fontSize={{ base: '1.5rem', md: '1.75rem', lg: '2rem' }}
              fontWeight="700"
              lineHeight="1.2"
              letterSpacing="-0.02em"
              mb="3"
            >
              <BrandInlineText before={copy.titleBefore} after={copy.titleAfter} />
            </Text>

            <Text fontSize={{ base: 'md', md: 'lg' }} color="whiteAlpha.850" lineHeight="1.6" mb="6" maxW="28rem">
              {copy.description}
            </Text>

            <Flex direction={{ base: 'column', sm: 'row' }} gap="3" mb="6" align={{ sm: 'center' }}>
              {canPromptInstall ? (
                <Button
                  bg="white"
                  color="primary"
                  borderRadius="pill"
                  px="7"
                  py="3.5"
                  fontSize="md"
                  fontWeight="700"
                  w={{ base: 'full', sm: 'auto' }}
                  onClick={handleInstall}
                  disabled={installing}
                  _hover={{ bg: 'primaryContainer' }}
                >
                  <MaterialIcon name="install_mobile" size={22} color="primary" />
                  <Box as="span" ml="2">
                    {installing ? copy.installingCta : copy.installCta}
                  </Box>
                </Button>
              ) : (
                <Button
                  bg="white"
                  color="primary"
                  borderRadius="pill"
                  px="7"
                  py="3.5"
                  fontSize="md"
                  fontWeight="700"
                  w={{ base: 'full', sm: 'auto' }}
                  as="a"
                  href={appUrl}
                  _hover={{ bg: 'primaryContainer', textDecoration: 'none' }}
                >
                  <MaterialIcon name="open_in_new" size={20} color="primary" />
                  <Box as="span" ml="2">
                    {copy.openPhoneCta}
                  </Box>
                </Button>
              )}
              <Text fontSize="sm" color="whiteAlpha.700" textAlign={{ base: 'center', sm: 'left' }}>
                {copy.orScan}
              </Text>
            </Flex>

            {isIos && !canPromptInstall && (
              <Box
                mb="5"
                p="4"
                borderRadius="xl"
                bg="whiteAlpha.100"
                borderWidth="1px"
                borderColor="whiteAlpha.200"
              >
                <Text fontSize="sm" fontWeight="600" mb="2" color="whiteAlpha.900">
                  {copy.iosTitle}
                </Text>
                <Flex gap="3" align="flex-start">
                  <Flex
                    w="6"
                    h="6"
                    borderRadius="full"
                    bg="whiteAlpha.200"
                    align="center"
                    justify="center"
                    flexShrink={0}
                    fontSize="xs"
                    fontWeight="700"
                  >
                    1
                  </Flex>
                  <Text fontSize="sm" color="whiteAlpha.850" lineHeight="1.5">
                    {copy.iosStep1}
                  </Text>
                </Flex>
                <Flex gap="3" align="flex-start" mt="2">
                  <Flex
                    w="6"
                    h="6"
                    borderRadius="full"
                    bg="whiteAlpha.200"
                    align="center"
                    justify="center"
                    flexShrink={0}
                    fontSize="xs"
                    fontWeight="700"
                  >
                    2
                  </Flex>
                  <Text fontSize="sm" color="whiteAlpha.850" lineHeight="1.5">
                    {copy.iosStep2}
                  </Text>
                </Flex>
              </Box>
            )}

            <Flex direction="column" gap="2.5">
              {copy.perks.map((item) => (
                <Flex key={item.label} align="center" gap="3">
                  <Flex
                    w="8"
                    h="8"
                    borderRadius="lg"
                    bg="whiteAlpha.150"
                    align="center"
                    justify="center"
                    flexShrink={0}
                  >
                    <MaterialIcon name={item.icon} size={18} color="accentMint" />
                  </Flex>
                  <Text fontSize="sm" color="whiteAlpha.800" lineHeight="1.4">
                    {item.label}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Box>

          <Box w="full" maxW={{ base: '15rem', md: '13.5rem' }} mx={{ base: 'auto', md: 0 }}>
            <Text
              fontSize="xs"
              fontWeight="700"
              letterSpacing="0.08em"
              textTransform="uppercase"
              color="whiteAlpha.700"
              textAlign="center"
              mb="4"
            >
              {copy.scanLabel}
            </Text>
            <PhoneQrMockup qrDataUrl={qrDataUrl} />
            <Text fontSize="sm" color="whiteAlpha.750" textAlign="center" mt="4" lineHeight="1.45">
              {copy.scanHint}
            </Text>
          </Box>
        </Grid>
      </Box>
    </Box>
  )
}
