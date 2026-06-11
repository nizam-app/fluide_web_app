import { useState } from 'react'
import { Box, Button, Flex, Grid, Input, Stack, Text } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'
import { DestinationAddressPreview } from './DestinationAddressPreview'
import { ServiceOptionsDropdown } from './ServiceOptionsDropdown'
import {
  CREATE_TRIP_SERVICE_OPTIONS,
  DEFAULT_SERVICE_STEP_COUNT,
  SERVICE_NEED_CONFIG,
} from '../../lib/servicePlan'
import { fluideDateInputStyles, fluideInputStyles } from '../../theme/fluide-theme'

function StepField({ label, children }) {
  return (
    <Box flex="0 0 auto">
      <Text textStyle="labelSm" color="onSurfaceVariant" mb="1.5">
        {label}
      </Text>
      {children}
    </Box>
  )
}

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
  const previewQuery =
    needType === 'Transport'
      ? detail.destination || detail.pickup
      : needType === 'Equipment'
        ? ''
        : detail.venueName

  return (
    <Stack gap="3" w="full">
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
      {previewQuery && <DestinationAddressPreview query={previewQuery} />}
    </Stack>
  )
}

function ServicePlanStep({ stepIndex, plan, onChange, isLastVisible, onAddNext }) {
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
      borderWidth="1px"
      borderColor="outlineVariant"
      borderRadius="fluide2xl"
      p={{ base: '4', md: '5' }}
      bg="surfaceContainerLowest"
    >
      <Stack gap="5">
        <Flex align="center" gap="2">
          <Flex
            align="center"
            justify="center"
            w="8"
            h="8"
            borderRadius="full"
            bg="primary"
            color="onPrimary"
            fontWeight="700"
            textStyle="labelSm"
            flexShrink={0}
          >
            {stepIndex + 1}
          </Flex>
          <Text textStyle="labelMd" fontWeight="600">
            Step {stepIndex + 1}
          </Text>
        </Flex>

        <Flex gap="4" flexWrap="wrap" align="flex-end">
          <StepField label="Service date">
            <Input
              type="date"
              value={plan.serviceDate}
              onChange={(event) => onChange({ ...plan, serviceDate: event.target.value })}
              css={fluideDateInputStyles}
              bg="surface"
              w={{ base: 'full', sm: '11.5rem' }}
            />
          </StepField>

          <StepField label="From">
            <Input
              type="time"
              value={plan.timeFrom}
              onChange={(event) => onChange({ ...plan, timeFrom: event.target.value })}
              css={fluideInputStyles}
              bg="surface"
              w="8.5rem"
            />
          </StepField>

          <StepField label="To">
            <Input
              type="time"
              value={plan.timeTo}
              onChange={(event) => onChange({ ...plan, timeTo: event.target.value })}
              css={fluideInputStyles}
              bg="surface"
              w="8.5rem"
            />
          </StepField>
        </Flex>

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

        {isLastVisible && onAddNext && (
          <Button
            type="button"
            variant="outline"
            borderRadius="pill"
            borderColor="primary"
            color="primary"
            alignSelf="flex-start"
            onClick={onAddNext}
          >
            <MaterialIcon name="add" size={18} />
            Add step {stepIndex + 2}
          </Button>
        )}
      </Stack>
    </Box>
  )
}

export function TripServiceNeedsBuilder({ value, onChange }) {
  const steps = value?.length ? value : Array.from({ length: DEFAULT_SERVICE_STEP_COUNT }, () => ({
    serviceDate: '',
    timeFrom: '',
    timeTo: '',
    selectedTypes: [],
    needs: {},
  }))

  const [visibleStepCount, setVisibleStepCount] = useState(() => {
    const filled = steps.filter((step) => step.selectedTypes.length > 0).length
    return Math.min(Math.max(filled || 1, 1), DEFAULT_SERVICE_STEP_COUNT)
  })

  const updateStep = (index, nextStep) => {
    const next = [...steps]
    next[index] = nextStep
    onChange(next)
  }

  const handleAddNextStep = () => {
    setVisibleStepCount((count) => Math.min(count + 1, DEFAULT_SERVICE_STEP_COUNT))
  }

  const visibleSteps = steps.slice(0, visibleStepCount)

  return (
    <Box pt="2">
      <Text textStyle="headlineSm" color="onSurface" fontWeight="600" mb="1">
        What do you need?
      </Text>
      <Text textStyle="bodySm" color="onSurfaceVariant" mb="5">
        Fill in each step, then use &ldquo;Add step 2&rdquo; or &ldquo;Add step 3&rdquo; to continue.
      </Text>

      <Stack gap="5">
        {visibleSteps.map((plan, index) => (
          <ServicePlanStep
            key={`service-step-${index + 1}`}
            stepIndex={index}
            plan={plan}
            onChange={(next) => updateStep(index, next)}
            isLastVisible={index === visibleStepCount - 1}
            onAddNext={visibleStepCount < DEFAULT_SERVICE_STEP_COUNT ? handleAddNextStep : undefined}
          />
        ))}
      </Stack>
    </Box>
  )
}
