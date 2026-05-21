import { useState } from 'react'
import { Box, Button, Flex, Grid, Input, Text } from '@chakra-ui/react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AuthBrandingPanel } from '../components/organisms/AuthBrandingPanel'
import { AccountTypeCard } from '../components/molecules/AccountTypeCard'
import { DemoCredentialsPanel } from '../components/molecules/DemoCredentialsPanel'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { useAuth } from '../context/AuthContext'
import { accountTypeOptions } from '../data/mockData'
import { getHomePath, ROLES } from '../lib/roles'
import { fluideInputStyles, stitchBlackButton } from '../theme/fluide-theme'

function AccountTypePicker({ accountType, onChange }) {
  return (
    <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="4">
      {accountTypeOptions.map((opt) => (
        <AccountTypeCard key={opt.value} {...opt} checked={accountType === opt.value} onChange={() => onChange(opt.value)} />
      ))}
    </Grid>
  )
}

function SecurityNote() {
  return (
    <Flex
      align="center"
      gap="2"
      mt="4"
      p="3"
      borderRadius="fluide"
      bg="surfaceContainerLow"
      borderWidth="1px"
      borderColor="outlineVariant"
    >
      <MaterialIcon name="lock" size={18} color="primary" />
      <Text textStyle="bodySm" color="onSurfaceVariant">
        Secure connection – your data is protected.
      </Text>
    </Flex>
  )
}

export function AuthPage() {
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [accountType, setAccountType] = useState(ROLES.ORGANIZER)
  const [error, setError] = useState('')
  const { login, register, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from

  if (isAuthenticated && user) {
    const target = from ?? getHomePath(user.role)
    return <Navigate to={target} replace />
  }

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.')
      return
    }
    try {
      const session = login({ email, accountType })
      navigate(from ?? getHomePath(session.role), { replace: true })
    } catch (err) {
      setError(err.message ?? 'Login failed.')
    }
  }

  const fillDemoCredential = (cred) => {
    setEmail(cred.email)
    setPassword(cred.password)
    setError('')
    if (cred.role === ROLES.ORGANIZER || cred.role === ROLES.PROVIDER) {
      setAccountType(cred.role)
    }
    if (tab !== 'login') setTab('login')
  }

  const handleSignUp = (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.')
      return
    }
    try {
      const session = register({
        email,
        password,
        accountType,
        name: fullName,
        organizationType: accountType === ROLES.ORGANIZER ? 'Municipality' : undefined,
        providerType: accountType === ROLES.PROVIDER ? 'Transport' : undefined,
      })
      navigate(getHomePath(session.role), { replace: true })
    } catch (err) {
      setError(err.message ?? 'Sign up failed.')
    }
  }

  return (
    <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} minH="100vh" alignItems="stretch">
      <AuthBrandingPanel />

      <Flex
        align="flex-start"
        justify="center"
        p={{ base: 6, lg: 10, xl: 12 }}
        bg="surface"
        order={{ base: 1, lg: 2 }}
        minH={{ base: 'auto', lg: '100vh' }}
        overflowY="auto"
      >
        <Box w="full" maxW="lg" py={{ base: 2, lg: 4 }}>
          <Flex borderBottomWidth="1px" borderColor="outlineVariant" mb="8" gap={{ base: 6, sm: 8 }}>
            {[
              { id: 'login', label: 'Log in' },
              { id: 'register', label: 'Sign up' },
            ].map(({ id, label }) => (
              <Button
                key={id}
                unstyled
                pb="3"
                textStyle="labelMd"
                fontWeight="600"
                color={tab === id ? 'onSurface' : 'onSurfaceVariant'}
                borderBottomWidth="3px"
                borderColor={tab === id ? 'primary' : 'transparent'}
                onClick={() => {
                  setTab(id)
                  setError('')
                }}
              >
                {label}
              </Button>
            ))}
          </Flex>

          {tab === 'login' ? (
            <>
              <Text textStyle="headlineLg" mb="1">
                Log in
              </Text>
              <Text textStyle="bodySm" color="onSurfaceVariant" mb="6" lineHeight="1.55">
                Choose your account type, then enter your email and password.
              </Text>
              <Flex as="form" direction="column" gap="5" onSubmit={handleLogin}>
                <Box>
                  <Text textStyle="labelMd" mb="3">
                    Account type
                  </Text>
                  <AccountTypePicker accountType={accountType} onChange={setAccountType} />
                </Box>
                <Box>
                  <Text textStyle="labelMd" mb="2">
                    Email
                  </Text>
                  <Input
                    type="email"
                    placeholder="name@organization.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    css={fluideInputStyles}
                  />
                </Box>
                <Box>
                  <Flex justify="space-between" mb="2" flexWrap="wrap" gap="2">
                    <Text textStyle="labelMd">Password</Text>
                    <Text textStyle="labelSm" color="primary" cursor="pointer">
                      Forgot password?
                    </Text>
                  </Flex>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    css={fluideInputStyles}
                  />
                </Box>
                {error && (
                  <Text textStyle="bodySm" color="error">
                    {error}
                  </Text>
                )}
                <Button w="full" py="3.5" type="submit" {...stitchBlackButton}>
                  Log in
                </Button>
                <SecurityNote />
              </Flex>
              <DemoCredentialsPanel onUseCredential={fillDemoCredential} />
              <Text textStyle="bodySm" color="onSurfaceVariant" mt="6" textAlign="center">
                No account yet?{' '}
                <Button unstyled textStyle="labelMd" color="primary" fontWeight="600" onClick={() => setTab('register')}>
                  Sign up
                </Button>
              </Text>
            </>
          ) : (
            <>
              <Text textStyle="headlineLg" mb="1">
                Sign up
              </Text>
              <Text textStyle="bodySm" color="onSurfaceVariant" mb="6" lineHeight="1.55">
                Create an Organizer or Provider account. Admin access is managed internally by Fluide.
              </Text>
              <Flex as="form" direction="column" gap="5" onSubmit={handleSignUp}>
                <Box>
                  <Text textStyle="labelMd" mb="3">
                    Account type
                  </Text>
                  <AccountTypePicker accountType={accountType} onChange={setAccountType} />
                </Box>
                <Box>
                  <Text textStyle="labelMd" mb="2">
                    Full name
                  </Text>
                  <Input placeholder="Alex Morgan" value={fullName} onChange={(e) => setFullName(e.target.value)} css={fluideInputStyles} />
                </Box>
                <Box>
                  <Text textStyle="labelMd" mb="2">
                    Email
                  </Text>
                  <Input
                    type="email"
                    placeholder="you@organization.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    css={fluideInputStyles}
                  />
                </Box>
                <Box>
                  <Text textStyle="labelMd" mb="2">
                    Password
                  </Text>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    css={fluideInputStyles}
                  />
                </Box>
                {error && (
                  <Text textStyle="bodySm" color="error">
                    {error}
                  </Text>
                )}
                <Button w="full" py="3.5" type="submit" {...stitchBlackButton}>
                  Sign up
                </Button>
                <SecurityNote />
              </Flex>
              <Text textStyle="bodySm" color="onSurfaceVariant" mt="6" textAlign="center">
                Already have an account?{' '}
                <Button unstyled textStyle="labelMd" color="primary" fontWeight="600" onClick={() => setTab('login')}>
                  Log in
                </Button>
              </Text>
            </>
          )}
        </Box>
      </Flex>
    </Grid>
  )
}
