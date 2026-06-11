import { Box, Flex, Grid, Input, Stack, Text } from '@chakra-ui/react'
import { NeedTypePicker } from './NeedTypePicker'
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

function ServiceNeedFields({ needType, plan, onChange }) {
  const config = SERVICE_NEED_CONFIG[needType]
  if (!config) return null

  const detail = plan.needs[needType] || {}

  if (needType === 'Transport') {
    return (
      <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="3" flex="1">
        <Input
          placeholder={config.pickupLabel}
          value={detail.pickup || ''}
          onChange={(event) => onChange(updateNeedField(plan, needType, 'pickup', event.target.value))}
          css={fluideInputStyles}
        />
        <Input
          placeholder={config.destinationLabel}
          value={detail.destination || ''}
          onChange={(event) =>
            onChange(updateNeedField(plan, needType, 'destination', event.target.value))
          }
          css={fluideInputStyles}
        />
      </Grid>
    )
  }

  if (needType === 'Accommodation' || needType === 'Food & Catering') {
    return (
      <Input
        flex="1"
        placeholder={config.venuePlaceholder}
        value={detail.venueName || ''}
        onChange={(event) => onChange(updateNeedField(plan, needType, 'venueName', event.target.value))}
        css={fluideInputStyles}
      />
    )
  }

  if (needType === 'Equipment') {
    return (
      <Input
        flex="1"
        placeholder={config.detailsPlaceholder}
        value={detail.details || ''}
        onChange={(event) => onChange(updateNeedField(plan, needType, 'details', event.target.value))}
        css={fluideInputStyles}
      />
    )
  }

  return null
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
    <Box
      bg="surfaceContainerLow"
      borderRadius="fluide3xl"
      borderWidth="1px"
      borderColor="outlineVariant"
      p="6"
    >
      <Text textStyle="headlineSm" mb="1">
        Step 1 — What do you need?
      </Text>
      <Text textStyle="bodySm" color="onSurfaceVariant" mb="5">
        Choose the services you need. Fields appear below for each option you select.
      </Text>

      <Stack gap="5">
        <NeedTypePicker
          label="Choose options"
          options={CREATE_TRIP_SERVICE_OPTIONS}
          value={plan.selectedTypes}
          onChange={handleTypesChange}
        />

        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="3">
          <Box>
            <Text textStyle="labelSm" color="onSurfaceVariant" mb="2">
              Date
            </Text>
            <Input
              type="date"
              value={plan.serviceDate}
              onChange={(event) => onChange({ ...plan, serviceDate: event.target.value })}
              css={fluideDateInputStyles}
            />
          </Box>
          <Box>
            <Text textStyle="labelSm" color="onSurfaceVariant" mb="2">
              From
            </Text>
            <Input
              type="time"
              value={plan.timeFrom}
              onChange={(event) => onChange({ ...plan, timeFrom: event.target.value })}
              css={fluideInputStyles}
            />
          </Box>
          <Box>
            <Text textStyle="labelSm" color="onSurfaceVariant" mb="2">
              To
            </Text>
            <Input
              type="time"
              value={plan.timeTo}
              onChange={(event) => onChange({ ...plan, timeTo: event.target.value })}
              css={fluideInputStyles}
            />
          </Box>
        </Grid>

        {plan.selectedTypes.length > 0 && (
          <Stack gap="3">
            {plan.selectedTypes.map((needType) => {
              const config = SERVICE_NEED_CONFIG[needType]
              return (
                <Flex
                  key={needType}
                  direction={{ base: 'column', sm: 'row' }}
                  align={{ base: 'stretch', sm: 'center' }}
                  gap="3"
                  bg="surface"
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="outlineVariant"
                  p="4"
                >
                  <Text
                    textStyle="labelMd"
                    color="primary"
                    fontWeight="700"
                    minW={{ sm: '120px' }}
                    flexShrink={0}
                  >
                    {config?.label || needType}
                  </Text>
                  <ServiceNeedFields needType={needType} plan={plan} onChange={onChange} />
                </Flex>
              )
            })}
          </Stack>
        )}
      </Stack>
    </Box>
  )
}
