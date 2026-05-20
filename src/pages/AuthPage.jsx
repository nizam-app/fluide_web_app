import { useState } from 'react'
import { Box, Button, Flex, Grid, Image, Input, Text } from '@chakra-ui/react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AccountTypeCard } from '../components/molecules/AccountTypeCard'
import { DemoCredentialsPanel } from '../components/molecules/DemoCredentialsPanel'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { useAuth } from '../context/AuthContext'
import { accountTypeOptions, AUTH_BG_IMAGE } from '../data/mockData'
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

  const handleRegister = (e) => {
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
      setError(err.message ?? 'Registration failed.')
    }
  }

  return (
    <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} minH="100vh">
      <Box bg="loginPanel" p={{ base: 10, lg: 16 }} display="flex" flexDirection="column" justifyContent="space-between" color="white">
        <Flex align="center" gap="2">
          <MaterialIcon name="eco" size={28} color="accentMint" />
          <Text fontSize="xl" fontWeight="800" letterSpacing="0.05em">
            FLUIDE
          </Text>
        </Flex>
        <Box>
          <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="700" lineHeight="1.2" mb="4">
            Coordinate effortlessly,{' '}
            <Box as="span" color="accentMint">
              empower your community.
            </Box>
          </Text>
          <Text color="whiteAlpha.700" textStyle="bodyMd" maxW="md" mb="8">
            Organizers plan group outings. Providers respond with transport, activities, and local services.
          </Text>
          <Box borderRadius="2xl" overflow="hidden" bg="blackAlpha.400" p="4" maxW="md">
            <Image src={AUTH_BG_IMAGE} alt="Dashboard preview" borderRadius="xl" w="full" />
          </Box>
        </Box>
        <Text textStyle="bodySm" color="whiteAlpha.500">
          © 2024 Fluide Organisation. All rights reserved.
        </Text>
      </Box>

      <Flex align="center" justify="center" p={{ base: 8, lg: 16 }} bg="surface">
        <Box w="full" maxW="lg">
          <Flex borderBottomWidth="1px" borderColor="outlineVariant" mb="8" gap="8">
            {['login', 'register'].map((t) => (
              <Button
                key={t}
                unstyled
                pb="3"
                textStyle="labelMd"
                fontWeight="600"
                color={tab === t ? 'onSurface' : 'onSurfaceVariant'}
                borderBottomWidth="3px"
                borderColor={tab === t ? 'primary' : 'transparent'}
                onClick={() => {
                  setTab(t)
                  setError('')
                }}
              >
                {t === 'login' ? 'Log In' : 'Register'}
              </Button>
            ))}
          </Flex>

          {tab === 'login' ? (
            <>
              <Text textStyle="headlineLg" mb="1">
                Welcome back
              </Text>
              <Text textStyle="bodySm" color="onSurfaceVariant" mb="6">
                Select your account type, then sign in. Admin uses internal credentials only.
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
                    placeholder="name@organization.gov"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    css={fluideInputStyles}
                  />
                </Box>
                <Box>
                  <Flex justify="space-between" mb="2">
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
                <Button w="full" py="3" type="submit" {...stitchBlackButton}>
                  Log In
                </Button>
              </Flex>
              <DemoCredentialsPanel onUseCredential={fillDemoCredential} />
            </>
          ) : (
            <>
              <Text textStyle="headlineLg" mb="1">
                Create your account
              </Text>
              <Text textStyle="bodySm" color="onSurfaceVariant" mb="6">
                Public registration is for Organizers and Providers only.
              </Text>
              <Flex as="form" direction="column" gap="5" onSubmit={handleRegister}>
                <Box>
                  <Text textStyle="labelMd" mb="3">
                    Account type
                  </Text>
                  <AccountTypePicker accountType={accountType} onChange={setAccountType} />
                </Box>
                <Box>
                  <Text textStyle="labelMd" mb="2">
                    Full Name
                  </Text>
                  <Input placeholder="Alex Morgan" value={fullName} onChange={(e) => setFullName(e.target.value)} css={fluideInputStyles} />
                </Box>
                <Box>
                  <Text textStyle="labelMd" mb="2">
                    Email Address
                  </Text>
                  <Input
                    type="email"
                    placeholder="alex@example.com"
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
                <Button w="full" py="3" type="submit" {...stitchBlackButton}>
                  Create My Account
                </Button>
              </Flex>
            </>
          )}
        </Box>
      </Flex>
    </Grid>
  )
}
