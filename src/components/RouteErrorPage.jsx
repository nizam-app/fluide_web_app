import { Box, Button, Text } from '@chakra-ui/react'
import { useRouteError } from 'react-router-dom'

export function RouteErrorPage() {
  const error = useRouteError()
  const message = error?.message || 'Something went wrong loading this page.'

  return (
    <Box minH="50vh" p="8" bg="background">
      <Text textStyle="headlineSm" mb="2">
        Something went wrong
      </Text>
      <Text textStyle="bodySm" color="onSurfaceVariant" mb="4" maxW="lg">
        {message}
      </Text>
      <Button onClick={() => window.location.reload()}>Reload page</Button>
    </Box>
  )
}
