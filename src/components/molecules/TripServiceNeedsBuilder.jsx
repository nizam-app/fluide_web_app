import { Box, Flex, Grid, Input, Stack, Text } from '@chakra-ui/react'
import { ServiceOptionsDropdown } from './ServiceOptionsDropdown'
import {
  CREATE_TRIP_SERVICE_OPTIONS,
  SERVICE_NEED_CONFIG,
} from '../../lib/servicePlan'
import { fluideDateInputStyles, fluideInputStyles } from '../../theme/fluide-theme'

function updateNeedField(plan, needType, field, value) {
  return {
    ...plan,
    needs: {
      ...plan.needs,
      [needType]: {
        pickup: '',
        destination: '',
        venueName: '',
        details: '',
        ...plan.needs[needType],
        [field]: value,
      },
    },
  }
}

function ServiceNeedRow({ needType, plan, onChange }) {
  const config = SERVICE_NEED_CONFIG[needType]
  if (!config) return null

  const detail = plan.needs[needType] || {}
  const label = config.label || needType

  return (
    <Flex
      direction={{ base: 'column', sm: 'row' }}
      align={{ base: 'stretch', sm: 'center' }}
      gap="3"
      w="full"
    >
      <Flex
        align="center"
        justify="center"
        minW={{ sm: '130px' }}
        px="4"
        py="3"
        borderRadius="lg"
        bg="primaryContainer"
        color="onPrimaryContainer"
        fontWeight="700"
        textStyle="labelMd"
        flexShrink={0}
      >
        {label}
      </Flex>

      {needType === 'Transport' ? (
        <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="3" flex="1">
          <Input
            placeholder={config.pickupLabel}
            value={detail.pickup || ''}
            onChange={(event) => onChange(updateNeedField(plan, needType, 'pickup', event.target.value))}
            css={fluideInputStyles}
            bg="surface"
          />
          <Input
            placeholder={config.destinationLabel}
            value={detail.destination || ''}
            onChange={(event) =>
              onChange(updateNeedField(plan, needType, 'destination', event.target.value))
            }
            css={fluideInputStyles}
            bg="surface"
          />
        </Grid>
      ) : (
        <Input
          flex="1"
          placeholder={
            needType === 'Equipment' ? config.detailsPlaceholder : config.venuePlaceholder
          }
          value={needType === 'Equipment' ? detail.details || '' : detail.venueName || ''}
          onChange={(event) =>
            onChange(
              updateNeedField(
                plan,
                needType,
                needType === 'Equipment' ? 'details' : 'venueName',
                event.target.value,
              ),
            )
          }
          css={fluideInputStyles}
          bg="surface"
        />
      )}
    </Flex>
  )
}

export function TripServiceNeedsBuilder({ value, onChange }) {
  const plan = value

  const handleTypesChange = (selectedTypes) => {
    const needs = { ...plan.needs }
    for (const type of selectedTypes) {
      if (!needs[type]) {
        needs[type] = { pickup: '', destination: '', venueName: '', details: '' }
      }
    }
    onChange({ ...plan, selectedTypes, needs })
  }

  return (
    <Box borderTopWidth="1px" borderColor="outlineVariant" pt="8" mt="2">
      <Text textStyle="headlineSm" color="onSurfaceVariant" fontWeight="500" mb="6">
        What do you need?
      </Text>

      <Stack gap="5">
        <Text textStyle="labelMd" fontWeight="600">
          Step 1
        </Text>

        <Grid templateColumns={{ base: '1fr', md: 'minmax(0, 200px) 1fr' }} gap="4" alignItems="end">
          <Box>
            <Input
              type="date"
              value={plan.serviceDate}
              onChange={(event) => onChange({ ...plan, serviceDate: event.target.value })}
              css={fluideDateInputStyles}
              bg="surface"
            />
            <Text textStyle="bodySm" color="onSurfaceVariant" mt="1">
              jj/mm/aa
            </Text>
          </Box>

          <Box>
            <Flex align="center" gap="2" flexWrap="wrap">
              <Text textStyle="labelSm" color="onSurfaceVariant" flexShrink={0}>
                from
              </Text>
              <Input
                type="time"
                value={plan.timeFrom}
                onChange={(event) => onChange({ ...plan, timeFrom: event.target.value })}
                css={fluideInputStyles}
                bg="surface"
                flex="1"
                minW="120px"
              />
              <Text textStyle="labelSm" color="onSurfaceVariant" flexShrink={0}>
                to
              </Text>
              <Input
                type="time"
                value={plan.timeTo}
                onChange={(event) => onChange({ ...plan, timeTo: event.target.value })}
                css={fluideInputStyles}
                bg="surface"
                flex="1"
                minW="120px"
              />
            </Flex>
          </Box>
        </Grid>

        <ServiceOptionsDropdown
          options={CREATE_TRIP_SERVICE_OPTIONS}
          value={plan.selectedTypes}
          onChange={handleTypesChange}
        />

        {plan.selectedTypes.length > 0 && (
          <Stack gap="4" pt="2">
            {plan.selectedTypes.map((needType) => (
              <ServiceNeedRow key={needType} needType={needType} plan={plan} onChange={onChange} />
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  )
}
