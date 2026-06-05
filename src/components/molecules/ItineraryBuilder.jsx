import { Box, Button, Flex, Grid, IconButton, Input, Stack, Text, Textarea } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'
import { createLeg } from '../../lib/itinerary'
import { fluideInputStyles } from '../../theme/fluide-theme'

const LEG_TYPE_OPTIONS = [
  { value: 'transfer', label: 'Transfer', icon: 'directions_bus' },
  { value: 'stay', label: 'Stay', icon: 'hotel' },
]

function LegTypeToggle({ value, onChange }) {
  return (
    <Flex gap="2" flexWrap="wrap">
      {LEG_TYPE_OPTIONS.map((option) => {
        const active = value === option.value
        return (
          <Flex
            key={option.value}
            as="button"
            type="button"
            align="center"
            gap="2"
            px="4"
            py="2"
            minW="7.5rem"
            borderRadius="pill"
            borderWidth="1px"
            borderColor={active ? 'primary' : 'outlineVariant'}
            bg={active ? 'primaryContainer' : 'surface'}
            color={active ? 'onPrimaryContainer' : 'onSurface'}
            fontWeight="600"
            fontSize="sm"
            whiteSpace="nowrap"
            cursor="pointer"
            transition="border-color 0.15s, background 0.15s"
            _hover={{ borderColor: 'primary', bg: active ? 'primaryContainer' : 'surfaceContainerLow' }}
            onClick={() => onChange(option.value)}
          >
            <MaterialIcon
              name={option.icon}
              size={18}
              color={active ? 'primary' : 'onSurfaceVariant'}
            />
            {option.label}
          </Flex>
        )
      })}
    </Flex>
  )
}

function LegCard({ leg, index, onChange, onRemove, canRemove }) {
  const update = (field) => (event) => {
    onChange({ ...leg, [field]: event.target.value })
  }

  const switchType = (nextType) => {
    if (nextType === leg.type) return
    onChange({ ...createLeg(nextType), id: leg.id })
  }

  const isTransfer = leg.type === 'transfer'

  return (
    <Box
      bg="surfaceContainerLow"
      borderRadius="fluide3xl"
      borderWidth="1px"
      borderColor="outlineVariant"
      p="5"
    >
      <Flex justify="space-between" align="flex-start" mb="4" gap="3" flexWrap="wrap">
        <Stack gap="3" flex="1" minW="0">
          <Flex align="center" gap="2">
            <Flex
              w="8"
              h="8"
              borderRadius="full"
              bg="primaryContainer"
              color="primary"
              align="center"
              justify="center"
              fontSize="sm"
              fontWeight="700"
              flexShrink={0}
            >
              {index + 1}
            </Flex>
            <Text textStyle="labelMd" color="onSurface">
              Step {index + 1}
            </Text>
          </Flex>
          <LegTypeToggle value={leg.type} onChange={switchType} />
        </Stack>
        {canRemove && (
          <IconButton
            aria-label="Remove step"
            variant="ghost"
            size="sm"
            color="onSurfaceVariant"
            onClick={onRemove}
            flexShrink={0}
          >
            <MaterialIcon name="close" size={18} />
          </IconButton>
        )}
      </Flex>

      {isTransfer ? (
        <Stack gap="3">
          <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="3">
            <Box>
              <Text textStyle="labelSm" color="onSurfaceVariant" mb="2">
                Date
              </Text>
              <Input type="date" value={leg.date || ''} onChange={update('date')} css={fluideInputStyles} />
            </Box>
            <Box>
              <Text textStyle="labelSm" color="onSurfaceVariant" mb="2">
                Time
              </Text>
              <Input type="time" value={leg.time || ''} onChange={update('time')} css={fluideInputStyles} />
            </Box>
          </Grid>
          <Box>
            <Text textStyle="labelSm" color="onSurfaceVariant" mb="2">
              Pick-up
            </Text>
            <Input
              placeholder="e.g. Gare Marseille-Saint-Charles"
              value={leg.pickup || ''}
              onChange={update('pickup')}
              css={fluideInputStyles}
            />
          </Box>
          <Box>
            <Text textStyle="labelSm" color="onSurfaceVariant" mb="2">
              Destination
            </Text>
            <Input
              placeholder="e.g. Hôtel Marseille Centre"
              value={leg.destination || ''}
              onChange={update('destination')}
              css={fluideInputStyles}
            />
          </Box>
        </Stack>
      ) : (
        <Stack gap="3">
          <Box>
            <Text textStyle="labelSm" color="onSurfaceVariant" mb="2">
              Location
            </Text>
            <Input
              placeholder="e.g. Hôtel Marseille Centre, Gare Saint-Charles"
              value={leg.location || ''}
              onChange={update('location')}
              css={fluideInputStyles}
            />
          </Box>
          <Grid templateColumns={{ base: '1fr', sm: '1fr 2fr' }} gap="3">
            <Box>
              <Text textStyle="labelSm" color="onSurfaceVariant" mb="2">
                Duration (days)
              </Text>
              <Input
                type="number"
                min="1"
                placeholder="4"
                value={leg.durationDays ?? ''}
                onChange={update('durationDays')}
                css={fluideInputStyles}
              />
            </Box>
            <Box>
              <Text textStyle="labelSm" color="onSurfaceVariant" mb="2">
                Notes (optional)
              </Text>
              <Textarea
                rows={2}
                placeholder="Room type, group size, special requests…"
                value={leg.detail || ''}
                onChange={update('detail')}
                borderRadius="fluide"
                borderColor="outlineVariant"
                bg="surface"
              />
            </Box>
          </Grid>
        </Stack>
      )}
    </Box>
  )
}

export function ItineraryBuilder({ value = [], onChange }) {
  const legs = value.length ? value : [createLeg('transfer')]

  const setLegs = (next) => onChange(next)

  const updateLeg = (index, nextLeg) => {
    const copy = [...legs]
    copy[index] = nextLeg
    setLegs(copy)
  }

  const addLeg = (type) => setLegs([...legs, createLeg(type)])

  return (
    <Stack gap="3">
      <Box>
        <Text textStyle="labelMd" color="onSurfaceVariant" mb="1">
          Itinerary
        </Text>
        <Text textStyle="bodySm" color="onSurfaceVariant">
          Add each transfer and stay — dates, pick-up points, and destinations. This replaces long
          descriptions for group bookings.
        </Text>
      </Box>

      <Stack gap="3">
        {legs.map((leg, index) => (
          <LegCard
            key={leg.id}
            leg={leg}
            index={index}
            onChange={(next) => updateLeg(index, next)}
            onRemove={() => setLegs(legs.filter((_, i) => i !== index))}
            canRemove={legs.length > 1}
          />
        ))}
      </Stack>

      <Flex gap="2" flexWrap="wrap">
        <Button
          type="button"
          variant="outline"
          borderRadius="pill"
          size="sm"
          onClick={() => addLeg('transfer')}
        >
          <MaterialIcon name="directions_bus" size={16} />
          Add transfer
        </Button>
        <Button
          type="button"
          variant="outline"
          borderRadius="pill"
          size="sm"
          onClick={() => addLeg('stay')}
        >
          <MaterialIcon name="hotel" size={16} />
          Add stay
        </Button>
      </Flex>
    </Stack>
  )
}
