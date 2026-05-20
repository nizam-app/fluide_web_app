import { Box, Button, Flex, Grid, Image, Input, NativeSelect, Stack, Text, Textarea } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { RolePageHeader } from '../components/molecules/RolePageHeader'
import { PortalLayout } from '../components/templates/PortalLayout'
import { NEED_TYPE_OPTIONS, trips } from '../data/mockData'
import { fluideInputStyles, stitchBlackButton } from '../theme/fluide-theme'

function FormField({ label, children }) {
  return (
    <Box>
      <Text textStyle="labelMd" color="onSurfaceVariant" mb="2">
        {label}
      </Text>
      {children}
    </Box>
  )
}

export function CreateTripPage() {
  const navigate = useNavigate()

  return (
    <PortalLayout>
      <Box maxW="contentMax" mx="auto" px={{ base: 'marginMobile', lg: 'marginDesktop' }} py="10">
        <RolePageHeader role="organizer" />
        <Box mb="10">
          <Text textStyle="headlineMd" mb="2">
            Create a Trip
          </Text>
          <Text textStyle="bodyMd" color="onSurfaceVariant">
            Publish a new outing request to the Fluide provider network.
          </Text>
        </Box>

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap="8">
          <Box bg="surface" borderRadius="fluide3xl" p="8" borderWidth="1px" borderColor="outlineVariant" shadow="level1">
            <Stack gap="5" as="form" onSubmit={(e) => { e.preventDefault(); navigate('/trips') }}>
              <FormField label="Trip Title">
                <Input placeholder="e.g. Summer Youth Camp Transport" css={fluideInputStyles} />
              </FormField>
              <Grid templateColumns="1fr 1fr" gap="4">
                <FormField label="Date">
                  <Input type="date" css={fluideInputStyles} />
                </FormField>
                <FormField label="Location">
                  <Input placeholder="City, Region" css={fluideInputStyles} />
                </FormField>
              </Grid>
              <Grid templateColumns="1fr 1fr" gap="4">
                <FormField label="Number of Participants">
                  <Input type="number" placeholder="24" css={fluideInputStyles} />
                </FormField>
                <FormField label="Need Type">
                  <NativeSelect.Root>
                    <NativeSelect.Field css={fluideInputStyles}>
                      {NEED_TYPE_OPTIONS.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </FormField>
              </Grid>
              <FormField label="Description">
                <Textarea rows={4} placeholder="Describe requirements for providers..." borderRadius="fluide" borderColor="outlineVariant" bg="surfaceContainerLow" />
              </FormField>
              <Flex justify="flex-end">
                <Button {...stitchBlackButton} px="10" py="3" type="submit">
                  Publish Request
                </Button>
              </Flex>
            </Stack>
          </Box>

          <Stack gap="4">
            <Box bg="infoBg" borderRadius="fluide3xl" p="6">
              <Flex align="center" gap="2" mb="4">
                <MaterialIcon name="info" color="infoFg" />
                <Text textStyle="labelMd" color="infoFg">
                  How it works
                </Text>
              </Flex>
              <Stack gap="3">
                {['Submit your trip details', 'Providers send offers', 'Accept the best match'].map((step, i) => (
                  <Flex key={step} gap="3" align="flex-start">
                    <Text color="primary" fontWeight="700">
                      {i + 1}.
                    </Text>
                    <Text textStyle="bodySm" color="onSurface">
                      {step}
                    </Text>
                  </Flex>
                ))}
              </Stack>
            </Box>
            <Box borderRadius="fluide3xl" overflow="hidden" position="relative" h="48">
              <Image src={trips[0].image} alt="Community" w="full" h="full" objectFit="cover" />
            </Box>
          </Stack>
        </Grid>
      </Box>
    </PortalLayout>
  )
}
