import { useState } from 'react'
import { Box, Button, Collapsible, Text } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'
import { textWithBrand } from '../../lib/textWithBrand'

function FaqItem({ question, answer, defaultOpen = false, alwaysVisible = false }) {
  const [open, setOpen] = useState(defaultOpen)

  if (alwaysVisible) {
    return (
      <Box borderWidth="1px" borderColor="outlineVariant" borderRadius="fluide3xl" overflow="hidden" bg="surface" p={{ base: 5, md: 6 }}>
        <Text textStyle="labelMd" color="onBackground" mb="3" fontWeight="700">
          {textWithBrand(question)}
        </Text>
        <Text textStyle="bodyMd" color="onSurfaceVariant" lineHeight="1.6">
          {textWithBrand(answer)}
        </Text>
      </Box>
    )
  }

  return (
    <Box borderWidth="1px" borderColor="outlineVariant" borderRadius="fluide3xl" overflow="hidden" bg="surface">
      <Button
        unstyled
        w="full"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={{ base: 4, md: 5 }}
        textAlign="left"
        cursor="pointer"
        _hover={{ bg: 'surfaceContainerLow' }}
        _focusVisible={{ outline: '2px solid', outlineColor: 'primary' }}
        onClick={() => setOpen((v) => !v)}
      >
        <Text textStyle="labelMd" color="onBackground" fontWeight="700" pr="4">
          {textWithBrand(question)}
        </Text>
        <MaterialIcon name={open ? 'expand_less' : 'expand_more'} size={24} color="outline" flexShrink={0} />
      </Button>
      <Collapsible.Root open={open}>
        <Collapsible.Content>
          <Box px={{ base: 4, md: 5 }} pb={{ base: 4, md: 5 }} pt="0" borderTopWidth={open ? '1px' : 0} borderColor="outlineVariant">
            <Text textStyle="bodyMd" color="onSurfaceVariant" lineHeight="1.6">
              {textWithBrand(answer)}
            </Text>
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  )
}

export function FaqAccordion({ items, alwaysVisible = false }) {
  return (
    <Box display="flex" flexDirection="column" gap="4">
      {items.map((item, i) => (
        <FaqItem key={item.question} {...item} defaultOpen={i === 0} alwaysVisible={alwaysVisible} />
      ))}
    </Box>
  )
}
