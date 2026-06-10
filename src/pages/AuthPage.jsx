import { useState } from 'react'
import { Box, Button, Collapsible, Flex, Grid, Input, Text } from '@chakra-ui/react'
import { Link as RouterLink, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AccountTypeCard } from '../components/molecules/AccountTypeCard'
import { DemoCredentialsPanel } from '../components/molecules/DemoCredentialsPanel'
import { NeedTypePicker } from '../components/molecules/NeedTypePicker'
import { MaterialIcon } from '../components/atoms/MaterialIcon'
import { useAuth } from '../context/AuthContext'
import { accountTypeOptions, PROVIDER_TYPES } from '../data/mockData'
import { getHomePath, ROLES } from '../lib/roles'
import { BrandName } from '../components/atoms/BrandName'
import { fluideInputStyles, stitchBlackButton } from '../theme/fluide-theme'
import api from '../lib/api'

const SHOW_DEMO = import.meta.env.DEV

function AccountTypePicker({ accountType, onChange }) {
  return (
    <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="3">
      {accountTypeOptions.map((opt) => (
        <AccountTypeCard key={opt.value} {...opt} checked={accountType === opt.value} onChange={() => onChange(opt.value)} />
      ))}
    </Grid>
  )
}

function SecurityNote() {
  return (
    <Flex align="center" gap="2" p="3" borderRadius="fluide" bg="surfaceContainerLow" borderWidth="1px" borderColor="outlineVariant">
      <MaterialIcon name="lock" size={16} color="primary" />
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
  const [providerTypes, setProviderTypes] = useState(['Transport'])
  const [error, setError] = useState('')
  const [signupNotice, setSignupNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const { login, register, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from

  if (isAuthenticated && user) {
    const target = from ?? getHomePath(user.role)
    return <Navigate to={target} replace />
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.')
      return
    }
    setSubmitting(true)
    try {
      const session = await login({ email, password })
      navigate(from ?? getHomePath(session.role), { replace: true })
    } catch (err) {
      setError(err.message ?? 'Login failed.')
    } finally {
      setSubmitting(false)
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

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (accountType === ROLES.PROVIDER && providerTypes.length === 0) {
      setError('Select at least one supplier service.')
      return
    }
    setSubmitting(true)
    try {
      const result = await register({
        email,
        password,
        accountType,
        name: fullName,
        organizationType: accountType === ROLES.ORGANIZER ? 'Municipality' : undefined,
        providerTypes: accountType === ROLES.PROVIDER ? providerTypes : undefined,
      })
      const sentTo = result.welcomeEmailSentTo || email.trim().toLowerCase()
      if (result?.requiresApproval) {
        setSignupNotice(
          `${result.message || 'Your supplier account is pending platform administrator approval. You can log in once it is approved.'}${
            result.welcomeEmailSent ? ` A confirmation email was sent to ${sentTo}.` : ''
          }`,
        )
        setTab('login')
        return
      }
      if (result?.welcomeEmailSent) {
        setSignupNotice(`Account created! We sent a welcome email to ${sentTo}. Check your inbox and spam folder.`)
        setTab('login')
        return
      }
      if (result?.welcomeEmailSent === false) {
        setSignupNotice(
          `Account created, but the welcome email could not be delivered to ${sentTo}. Click "Resend welcome email" below.`,
        )
        setTab('login')
        return
      }
      navigate(getHomePath(result.role), { replace: true })
    } catch (err) {
      setError(err.message ?? 'Sign up failed.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleResendWelcome = async () => {
    const target = email.trim().toLowerCase()
    if (!target) {
      setError('Enter your email address first.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const result = await api.auth.resendWelcome({ email: target })
      const sentTo = result.welcomeEmailSentTo || target
      if (result.welcomeEmailSent) {
        setSignupNotice(`Welcome email sent to ${sentTo}. Check your inbox and spam folder.`)
      } else {
        setSignupNotice(`We could not send the welcome email to ${sentTo}. Wait a minute and try again.`)
      }
    } catch (err) {
      setError(err.message ?? 'Could not resend welcome email.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Flex minH="100vh" bg="surface" direction="column">
      <Flex justify="center" pt={{ base: 6, md: 8 }} pb="2" px="6">
        <RouterLink to="/">
          <Flex align="center" gap="2">
            <MaterialIcon name="eco" size={26} color="primary" />
            <BrandName as="span" uppercase fontSize="lg" fontWeight="800" letterSpacing="0.05em" color="onSurface">
              Flunexia
            </BrandName>
          </Flex>
        </RouterLink>
      </Flex>

      <Flex flex="1" align="flex-start" justify="center" px={{ base: 5, md: 6 }} pb="10">
        <Box w="full" maxW="md">
          <Flex borderBottomWidth="1px" borderColor="outlineVariant" mb="6" gap="8" justify="center">
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
              <Text textStyle="headlineMd" mb="5" textAlign="center">
                Log in to your space
              </Text>
              <Flex as="form" direction="column" gap="4" onSubmit={handleLogin}>
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
                    size="lg"
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
                    size="lg"
                  />
                </Box>
                {signupNotice && (
                  <Box p="3" borderRadius="fluide" bg="secondaryContainer" borderWidth="1px" borderColor="outlineVariant">
                    <Text textStyle="bodySm" color="onSecondaryContainer">
                      {signupNotice}
                    </Text>
                    {email.trim() && (
                      <Button
                        unstyled
                        mt="2"
                        textStyle="labelSm"
                        color="primary"
                        fontWeight="600"
                        onClick={handleResendWelcome}
                        disabled={submitting}
                      >
                        Resend welcome email
                      </Button>
                    )}
                  </Box>
                )}
                {error && (
                  <Text textStyle="bodySm" color="error">
                    {error}
                  </Text>
                )}
                <Button w="full" py="4" type="submit" {...stitchBlackButton} fontSize="md" loading={submitting} disabled={submitting}>
                  Log in
                </Button>
                <SecurityNote />
              </Flex>

              {SHOW_DEMO && (
                <Box mt="4">
                  <Button
                    variant="ghost"
                    size="sm"
                    w="full"
                    color="onSurfaceVariant"
                    onClick={() => setShowDemo((v) => !v)}
                  >
                    <MaterialIcon name={showDemo ? 'expand_less' : 'expand_more'} size={18} />
                    {showDemo ? 'Hide' : 'Show'} demo access (testing)
                  </Button>
                  <Collapsible.Root open={showDemo}>
                    <Collapsible.Content>
                      <DemoCredentialsPanel onUseCredential={fillDemoCredential} />
                    </Collapsible.Content>
                  </Collapsible.Root>
                </Box>
              )}

              <Text textStyle="bodySm" color="onSurfaceVariant" mt="6" textAlign="center">
                No account?{' '}
                <Button unstyled textStyle="labelMd" color="primary" fontWeight="600" onClick={() => setTab('register')}>
                  Sign up
                </Button>
              </Text>
            </>
          ) : (
            <>
              <Text textStyle="headlineMd" mb="5" textAlign="center">
                Create your account
              </Text>
              <Flex as="form" direction="column" gap="4" onSubmit={handleSignUp}>
                <AccountTypePicker accountType={accountType} onChange={setAccountType} />
                <Box>
                  <Text textStyle="labelMd" mb="2">
                    Full name
                  </Text>
                  <Input
                    placeholder="Alex Morgan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    css={fluideInputStyles}
                    size="lg"
                  />
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
                    size="lg"
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
                    size="lg"
                  />
                </Box>
                {accountType === ROLES.PROVIDER && (
                  <Box>
                    <NeedTypePicker
                      label="Services you provide"
                      options={PROVIDER_TYPES}
                      value={providerTypes}
                      onChange={setProviderTypes}
                    />
                    {providerTypes.length > 1 && (
                      <Text textStyle="bodySm" color="onSurfaceVariant" mt="2">
                        Multiple services require platform administrator approval before you can sign in.
                      </Text>
                    )}
                  </Box>
                )}
                {error && (
                  <Text textStyle="bodySm" color="error">
                    {error}
                  </Text>
                )}
                <Button w="full" py="4" type="submit" {...stitchBlackButton} fontSize="md" loading={submitting} disabled={submitting}>
                  Sign up
                </Button>
                <SecurityNote />
              </Flex>
              <Text textStyle="bodySm" color="onSurfaceVariant" mt="6" textAlign="center">
                Already registered?{' '}
                <Button unstyled textStyle="labelMd" color="primary" fontWeight="600" onClick={() => setTab('login')}>
                  Log in
                </Button>
              </Text>
            </>
          )}
        </Box>
      </Flex>
    </Flex>
  )
}
