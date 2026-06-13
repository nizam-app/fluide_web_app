import { Box, Button, Flex, Input, Stack, Text } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'
import { DestinationAddressPreview } from './DestinationAddressPreview'
import { ServiceOptionsDropdown } from './ServiceOptionsDropdown'
import { getPortalCopy } from '../../content/portalCopy'
import { useLocale } from '../../context/LocaleContext'
import {
  CREATE_TRIP_SERVICE_OPTIONS,
  SERVICE_FIELD_KIND,
  SERVICE_NEED_CONFIG,
  createEmptyServicePlan,
  createServicePlanStepId,
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
    config.fieldKind === SERVICE_FIELD_KIND.TRANSFER
      ? detail.destination || detail.pickup
      : config.fieldKind === SERVICE_FIELD_KIND.VENUE
        ? detail.venueName
        : ''

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

        {config.fieldKind === SERVICE_FIELD_KIND.TRANSFER ? (
          <Flex gap="3" flex="1" direction={{ base: 'column', sm: 'row' }}>
            <Input
              flex="1"
              placeholder={config.pickupLabel}
              value={detail.pickup || ''}
              onChange={(event) => onChange(updateNeedField(plan, needType, 'pickup', event.target.value))}
              css={fluideInputStyles}
              bg="surface"
            />
            <Input
              flex="1"
              placeholder={config.destinationLabel}
              value={detail.destination || ''}
              onChange={(event) =>
                onChange(updateNeedField(plan, needType, 'destination', event.target.value))
              }
              css={fluideInputStyles}
              bg="surface"
            />
          </Flex>
        ) : (
          <Input
            flex="1"
            placeholder={
              config.fieldKind === SERVICE_FIELD_KIND.DETAILS
                ? config.detailsPlaceholder
                : config.venuePlaceholder
            }
            value={
              config.fieldKind === SERVICE_FIELD_KIND.DETAILS ? detail.details || '' : detail.venueName || ''
            }
            onChange={(event) =>
              onChange(
                updateNeedField(
                  plan,
                  needType,
                  config.fieldKind === SERVICE_FIELD_KIND.DETAILS ? 'details' : 'venueName',
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

function ServicePlanStep({ stepIndex, plan, onChange, isLast, onAddStep, onRemoveStep, canRemove, copy }) {
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
        <Flex align="center" justify="space-between" gap="3">
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
              {copy.step(stepIndex + 1)}
            </Text>
          </Flex>
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              color="onSurfaceVariant"
              onClick={onRemoveStep}
            >
              <MaterialIcon name="delete" size={16} />
              {copy.remove}
            </Button>
          )}
        </Flex>

        <Flex gap="4" flexWrap="wrap" align="flex-end">
          <StepField label={copy.serviceDate}>
            <Input
              type="date"
              value={plan.serviceDate}
              onChange={(event) => onChange({ ...plan, serviceDate: event.target.value })}
              css={fluideDateInputStyles}
              bg="surface"
              w={{ base: 'full', sm: '11.5rem' }}
            />
          </StepField>

          <StepField label={copy.from}>
            <Input
              type="time"
              value={plan.timeFrom}
              onChange={(event) => onChange({ ...plan, timeFrom: event.target.value })}
              css={fluideInputStyles}
              bg="surface"
              w="8.5rem"
            />
          </StepField>

          <StepField label={copy.to}>
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

        {isLast && (
          <Button
            type="button"
            variant="outline"
            borderRadius="pill"
            borderColor="primary"
            color="primary"
            alignSelf="flex-start"
            onClick={onAddStep}
          >
            <MaterialIcon name="add" size={18} />
            {copy.addStep}
          </Button>
        )}
      </Stack>
    </Box>
  )
}

export function TripServiceNeedsBuilder({ value, onChange }) {
  const { locale } = useLocale()
  const copy = getPortalCopy(locale).createTrip
  const steps = (value?.length ? value : [createEmptyServicePlan()]).map((step) =>
    step.id ? step : { ...step, id: createServicePlanStepId() },
  )

  const updateStep = (index, nextStep) => {
    const next = [...steps]
    next[index] = nextStep
    onChange(next)
  }

  const handleAddStep = () => {
    onChange([...steps, createEmptyServicePlan()])
  }

  const handleRemoveStep = (index) => {
    if (steps.length <= 1) return
    onChange(steps.filter((_, stepIndex) => stepIndex !== index))
  }

  return (
    <Box pt="2">
      <Text textStyle="headlineSm" color="onSurface" fontWeight="600" mb="1">
        {copy.whatDoYouNeed}
      </Text>
      <Text textStyle="bodySm" color="onSurfaceVariant" mb="5">
        {copy.addStepsHint}
      </Text>

      <Stack gap="5">
        {steps.map((plan, index) => (
          <ServicePlanStep
            key={plan.id || `service-step-${index}`}
            stepIndex={index}
            plan={plan}
            onChange={(next) => updateStep(index, next)}
            isLast={index === steps.length - 1}
            onAddStep={handleAddStep}
            onRemoveStep={() => handleRemoveStep(index)}
            canRemove={steps.length > 1}
            copy={copy}
          />
        ))}
      </Stack>
    </Box>
  )
}
