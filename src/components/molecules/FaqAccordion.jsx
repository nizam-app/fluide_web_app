import { useState } from 'react'
import { Box, Button, Collapsible, Text } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false)

  return (
    <Box
      borderWidth="1px"
      borderColor="outlineVariant"
      borderRadius="fluide"
      overflow="hidden"
      bg="surfaceContainerLowest"
    >
      <Button
        unstyled
        w="full"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p="4"
        textAlign="left"
        cursor="pointer"
        _hover={{ bg: 'surfaceContainerLow' }}
        _focusVisible={{ outline: '2px solid', outlineColor: 'primary', bg: 'surfaceVariant' }}
        onClick={() => setOpen((v) => !v)}
      >
        <Text textStyle="labelMd" color="onBackground">
          {question}
        </Text>
        <MaterialIcon
          name={open ? 'remove' : 'add'}
          size={24}
          color="outline"
          transition="transform 0.3s"
          transform={open ? 'rotate(180deg)' : 'none'}
        />
      </Button>
      <Collapsible.Root open={open}>
        <Collapsible.Content>
          <Box px="4" pb="4" borderTopWidth="1px" borderColor="outlineVariant/50">
            <Text textStyle="bodySm" color="onSurfaceVariant" pt="2">
              {answer}
            </Text>
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  )
}

export function FaqAccordion({ items }) {
  return (
    <Box display="flex" flexDirection="column" gap="2">
      {items.map((item) => (
        <FaqItem key={item.question} {...item} />
      ))}
    </Box>
  )
}
