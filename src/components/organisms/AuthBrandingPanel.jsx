import { Box, Flex, Image, Stack, Text } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'
import { AUTH_BG_IMAGE } from '../../data/mockData'

const benefits = [
  { icon: 'groups', label: 'Organizers', text: 'Plan outings and manage provider requests in one place.' },
  { icon: 'storefront', label: 'Providers', text: 'Browse local trips and send clear offers.' },
  { icon: 'hub', label: 'All in one', text: 'Transport, activities, and services — without scattered emails.' },
]

export function AuthBrandingPanel() {
  return (
    <Box
      bg="loginPanel"
      color="white"
      minH={{ base: 'auto', lg: '100vh' }}
      display="flex"
      flexDirection="column"
      p={{ base: 8, lg: 10, xl: 12 }}
      position={{ lg: 'sticky' }}
      top={0}
      order={{ base: 2, lg: 1 }}
    >
      <Flex align="center" gap="2" mb={{ base: 8, lg: 10 }}>
        <MaterialIcon name="eco" size={28} color="accentMint" />
        <Text fontSize="xl" fontWeight="800" letterSpacing="0.05em">
          FLUIDE
        </Text>
      </Flex>

      <Stack gap={{ base: 5, lg: 6 }} flex="1" maxW="md">
        <Box>
          <Text fontSize={{ base: 'xl', lg: '2xl', xl: '3xl' }} fontWeight="700" lineHeight="1.3" mb="4">
            Access your space to organize your outings or respond to requests.
          </Text>
          <Text color="whiteAlpha.800" textStyle="bodyMd" lineHeight="1.65">
            One platform for municipalities, associations, schools, and local providers — transport, activities, and
            services in a single workflow.
          </Text>
        </Box>

        <Stack gap="3" display={{ base: 'none', md: 'flex' }}>
          {benefits.map((item) => (
            <Flex
              key={item.label}
              align="flex-start"
              gap="3"
              p="4"
              borderRadius="fluide3xl"
              bg="whiteAlpha.100"
              borderWidth="1px"
              borderColor="whiteAlpha.200"
            >
              <Flex
                w="10"
                h="10"
                borderRadius="lg"
                bg="whiteAlpha.200"
                align="center"
                justify="center"
                flexShrink={0}
              >
                <MaterialIcon name={item.icon} size={22} color="accentMint" />
              </Flex>
              <Box>
                <Text textStyle="labelMd" fontWeight="700" mb="0.5">
                  {item.label}
                </Text>
                <Text textStyle="bodySm" color="whiteAlpha.800" lineHeight="1.5">
                  {item.text}
                </Text>
              </Box>
            </Flex>
          ))}
        </Stack>

        <Box
          borderRadius="2xl"
          overflow="hidden"
          bg="whiteAlpha.100"
          borderWidth="1px"
          borderColor="whiteAlpha.200"
          p="3"
          w="full"
        >
          <Image src={AUTH_BG_IMAGE} alt="Fluide workspace preview" borderRadius="xl" w="full" objectFit="cover" />
        </Box>
      </Stack>

      <Text textStyle="bodySm" color="whiteAlpha.500" pt={{ base: 8, lg: 10 }} mt="auto">
        © 2024 Fluide Organisation. All rights reserved.
      </Text>
    </Box>
  )
}
