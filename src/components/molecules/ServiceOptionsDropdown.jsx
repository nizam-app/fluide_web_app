import { useEffect, useRef, useState } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'
import { SERVICE_NEED_CONFIG } from '../../lib/servicePlan'

export function ServiceOptionsDropdown({ options, value = [], onChange }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open])

  const toggle = (option) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option))
      return
    }
    onChange([...value, option])
  }

  return (
    <Box ref={rootRef} position="relative" w="fit-content" minW={{ base: 'full', sm: '260px' }}>
      <Flex
        as="button"
        type="button"
        align="center"
        justify="space-between"
        gap="3"
        w={{ base: 'full', sm: '260px' }}
        px="4"
        py="3"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="primary"
        bg="primaryContainer"
        color="onPrimaryContainer"
        fontWeight="600"
        textStyle="labelMd"
        cursor="pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        Choose options
        <MaterialIcon name={open ? 'expand_less' : 'expand_more'} size={20} />
      </Flex>

      {open && (
        <Box
          position="absolute"
          top="calc(100% + 4px)"
          left="0"
          zIndex={20}
          minW={{ base: 'full', sm: '260px' }}
          maxH="16rem"
          overflowY="auto"
          bg="primaryContainer"
          borderWidth="1px"
          borderColor="primary"
          borderRadius="lg"
          shadow="level2"
        >
          {options.map((option) => {
            const active = value.includes(option)
            const label = SERVICE_NEED_CONFIG[option]?.label || option
            return (
              <Flex
                key={option}
                as="button"
                type="button"
                w="full"
                px="4"
                py="3"
                align="center"
                justify="space-between"
                bg={active ? 'surface' : 'primaryContainer'}
                color="onPrimaryContainer"
                fontWeight={active ? '700' : '500'}
                textStyle="labelMd"
                borderTopWidth="1px"
                borderColor="primary"
                _first={{ borderTopWidth: 0 }}
                _hover={{ bg: 'surface' }}
                onClick={() => toggle(option)}
              >
                {label}
                {active && <MaterialIcon name="check" size={18} color="primary" />}
              </Flex>
            )
          })}
        </Box>
      )}

      {value.length === 0 && (
        <Text textStyle="bodySm" color="onSurfaceVariant" mt="2">
          Select at least one option.
        </Text>
      )}
    </Box>
  )
}
