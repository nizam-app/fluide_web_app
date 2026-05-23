import { Box, Flex, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { BrandName } from './BrandName'
import { MaterialIcon } from './MaterialIcon'

export function FluideLogo({ to = '/', variant = 'marketing', subtitle, ...props }) {
  const isAdmin = variant === 'admin'

  const content = (
    <Flex align="center" gap="3" translate="no" lang="zxx" className="notranslate brand-lock" {...props}>
      {isAdmin && (
        <Flex w="10" h="10" bg="brandBlack" borderRadius="lg" align="center" justify="center" flexShrink={0}>
          <MaterialIcon name="account_balance" size={22} color="white" />
        </Flex>
      )}
      <Box>
        <Text
          as="div"
          fontSize="lg"
          fontWeight="800"
          letterSpacing="0.04em"
          color={isAdmin ? 'navy' : 'brandBlack'}
          lineHeight="1.1"
        >
          {isAdmin ? (
            <>
              <BrandName uppercase>Flunexia</BrandName>
              <Box as="span" translate="yes" lang="en">
                {' '}
                Admin
              </Box>
            </>
          ) : (
            <BrandName uppercase>Flunexia</BrandName>
          )}
        </Text>
        {isAdmin && (
          <Text fontSize="10px" color="onSurfaceVariant" mt="0.5" letterSpacing="0.12em" textTransform="uppercase" fontWeight="600">
            {subtitle ?? 'Municipality Portal'}
          </Text>
        )}
      </Box>
    </Flex>
  )

  if (to) {
    return (
      <Box asChild _hover={{ opacity: 0.85 }}>
        <RouterLink to={to}>{content}</RouterLink>
      </Box>
    )
  }
  return content
}
