import { Box, Flex, Grid, Text } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'
import { demoCredentials } from '../../data/mockData'

const roleColors = {
  admin: { bg: 'surfaceContainer', color: 'onSurface' },
  organizer: { bg: 'primaryContainer', color: 'onPrimaryContainer' },
  provider: { bg: 'secondaryContainer', color: 'onSecondaryContainer' },
}

export function DemoCredentialsPanel({ onUseCredential }) {
  return (
    <Box mt="8" pt="6" borderTopWidth="1px" borderColor="outlineVariant">
      <Flex align="center" gap="2" mb="1">
        <MaterialIcon name="info" size={18} color="primary" />
        <Text textStyle="labelMd" color="onSurface">
          Demo credentials
        </Text>
      </Flex>
      <Text textStyle="bodySm" color="onSurfaceVariant" mb="4">
        Click a row to fill the form. Any password works for admin; use the password shown below for other roles.
      </Text>
      <Grid gap="3">
        {demoCredentials.map((cred) => {
          const colors = roleColors[cred.role] ?? roleColors.organizer
          return (
            <Box
              key={cred.role}
              as="button"
              type="button"
              w="full"
              textAlign="left"
              p="4"
              borderRadius="fluide"
              borderWidth="1px"
              borderColor="outlineVariant"
              bg="surfaceContainerLow"
              cursor="pointer"
              transition="all 0.15s"
              _hover={{ borderColor: 'primary', bg: 'primaryContainer' }}
              onClick={() => onUseCredential(cred)}
            >
              <Flex justify="space-between" align="flex-start" gap="3" mb="2">
                <Box
                  as="span"
                  px="2.5"
                  py="0.5"
                  borderRadius="pill"
                  textStyle="labelSm"
                  fontWeight="700"
                  bg={colors.bg}
                  color={colors.color}
                  textTransform="uppercase"
                >
                  {cred.label}
                </Box>
                <MaterialIcon name="login" size={18} color="outline" />
              </Flex>
              <Text textStyle="bodySm" color="onSurfaceVariant" mb="2">
                {cred.hint}
              </Text>
              <Flex direction="column" gap="1" fontFamily="mono" fontSize="13px">
                <Text color="onSurface">
                  <Text as="span" color="onSurfaceVariant">
                    Email:{' '}
                  </Text>
                  {cred.email}
                </Text>
                <Text color="onSurface">
                  <Text as="span" color="onSurfaceVariant">
                    Password:{' '}
                  </Text>
                  {cred.password}
                </Text>
              </Flex>
            </Box>
          )
        })}
      </Grid>
    </Box>
  )
}
