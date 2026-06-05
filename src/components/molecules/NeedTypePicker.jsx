import { Flex, Text } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'
import { NEED_TYPE_OPTIONS } from '../../data/mockData'
import { getNeedTypeIcon } from '../../lib/format'

export function NeedTypePicker({
  value = [],
  onChange,
  label = 'What do you need?',
  options = NEED_TYPE_OPTIONS,
}) {
  const selected = Array.isArray(value) ? value : []

  const toggle = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter((o) => o !== option))
    } else {
      onChange([...selected, option])
    }
  }

  return (
    <Flex direction="column" gap="2">
      <Text textStyle="labelMd" color="onSurfaceVariant">
        {label}
      </Text>
      <Flex gap="2" flexWrap="wrap">
        {options.map((option) => {
          const active = selected.includes(option)
          return (
            <Flex
              key={option}
              as="button"
              type="button"
              align="center"
              gap="2"
              px="4"
              py="2.5"
              borderRadius="pill"
              borderWidth="1px"
              borderColor={active ? 'primary' : 'outlineVariant'}
              bg={active ? 'primaryContainer' : 'surface'}
              color={active ? 'onPrimaryContainer' : 'onSurface'}
              fontWeight="600"
              fontSize="sm"
              cursor="pointer"
              transition="border-color 0.15s, background 0.15s"
              _hover={{ borderColor: 'primary', bg: active ? 'primaryContainer' : 'surfaceContainerLow' }}
              onClick={() => toggle(option)}
            >
              <MaterialIcon name={getNeedTypeIcon(option)} size={18} color={active ? 'primary' : 'onSurfaceVariant'} />
              {option}
            </Flex>
          )
        })}
      </Flex>
      {selected.length === 0 && (
        <Text textStyle="bodySm" color="onSurfaceVariant">
          Select at least one need type.
        </Text>
      )}
    </Flex>
  )
}
