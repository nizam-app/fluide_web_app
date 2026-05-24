import { Component } from 'react'
import { Box, Button, Text } from '@chakra-ui/react'

export class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <Box minH="100vh" p="8" bg="background" color="onBackground" fontFamily="body">
          <Text fontSize="xl" fontWeight="700" mb="2">
            Something went wrong
          </Text>
          <Text fontSize="sm" color="onSurfaceVariant" mb="4" maxW="lg">
            {this.state.error.message}
          </Text>
          <Button onClick={() => window.location.reload()}>Reload page</Button>
        </Box>
      )
    }
    return this.props.children
  }
}
