import { Component, Fragment } from 'react'
import { Box, Button, Text } from '@chakra-ui/react'
import { isTranslateDomError } from '../lib/translateDomPatch'

export class ErrorBoundary extends Component {
  state = { error: null, recoveryKey: 0 }

  static getDerivedStateFromError(error) {
    if (isTranslateDomError(error)) {
      return null
    }
    return { error }
  }

  componentDidCatch(error) {
    if (isTranslateDomError(error)) {
      this.setState((state) => ({ recoveryKey: state.recoveryKey + 1 }))
    }
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

    return <Fragment key={this.state.recoveryKey}>{this.props.children}</Fragment>
  }
}
