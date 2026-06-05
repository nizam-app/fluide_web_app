import { Flex, Stack, Text } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'
import { BOOKING_MODE_OPTIONS } from '../../lib/itinerary'

export function BookingModePicker({ value, onChange }) {
  return (
    <Stack gap="2">
      <Text textStyle="labelMd" color="onSurfaceVariant">
        Booking type
      </Text>
      <Stack gap="2">
        {BOOKING_MODE_OPTIONS.map((option) => {
          const active = value === option.value
          return (
            <Flex
              key={option.value}
              as="button"
              type="button"
              align="flex-start"
              gap="3"
              p="4"
              borderRadius="fluide3xl"
              borderWidth="2px"
              borderColor={active ? 'primary' : 'outlineVariant'}
              bg={active ? 'primaryContainer' : 'surface'}
              textAlign="left"
              cursor="pointer"
              transition="border-color 0.15s, background 0.15s"
              onClick={() => onChange(option.value)}
            >
              <MaterialIcon
                name={option.icon}
                size={22}
                color={active ? 'primary' : 'onSurfaceVariant'}
              />
              <Stack gap="0.5" flex="1">
                <Text textStyle="labelMd" color={active ? 'onPrimaryContainer' : 'onSurface'}>
                  {option.label}
                </Text>
                <Text textStyle="bodySm" color="onSurfaceVariant">
                  {option.description}
                </Text>
              </Stack>
            </Flex>
          )
        })}
      </Stack>
    </Stack>
  )
}
