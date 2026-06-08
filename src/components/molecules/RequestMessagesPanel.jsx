import { useState } from 'react'
import { Box, Button, Flex, Stack, Text, Textarea } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'
import api from '../../lib/api'
import { formatDateTime } from '../../lib/format'
import { fluideInputStyles, stitchGreenButton } from '../../theme/fluide-theme'

export function RequestMessagesPanel({
  requestId,
  messages = [],
  canPost,
  onPosted,
  currentUserId,
}) {
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    if (!body.trim()) return
    setBusy(true)
    setError('')
    try {
      await api.requests.addMessage(requestId, body.trim())
      setBody('')
      await onPosted?.()
    } catch (err) {
      setError(err?.message || 'Could not send the message.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Box mt="6" pt="5" borderTopWidth="1px" borderColor="outlineVariant">
      <Text textStyle="labelMd" mb="3" fontWeight="600">
        Messages
      </Text>
      <Box
        bg="surfaceContainerLow"
        borderRadius="xl"
        borderWidth="1px"
        borderColor="outlineVariant"
        overflow="hidden"
      >
        <Stack gap="3" p="4" maxH="280px" overflowY="auto" minH={messages.length ? '120px' : '72px'}>
          {messages.length === 0 ? (
            <Flex align="center" justify="center" minH="72px">
              <Text textStyle="bodySm" color="onSurfaceVariant" textAlign="center">
                No messages yet. Start the conversation below.
              </Text>
            </Flex>
          ) : (
            messages.map((msg) => {
              const authorId = msg.author?._id || msg.author
              const isOwn = currentUserId && String(authorId) === String(currentUserId)
              return (
                <Flex key={msg._id || `${msg.createdAt}-${msg.body}`} justify={isOwn ? 'flex-end' : 'flex-start'}>
                  <Box
                    maxW={{ base: '92%', sm: '78%' }}
                    bg={isOwn ? 'primaryContainer' : 'surface'}
                    color={isOwn ? 'onPrimaryContainer' : 'onSurface'}
                    borderRadius="xl"
                    px="4"
                    py="3"
                    borderWidth="1px"
                    borderColor={isOwn ? 'primary' : 'outlineVariant'}
                    shadow="level1"
                  >
                    <Flex justify="space-between" gap="3" mb="1.5" flexWrap="wrap">
                      <Text textStyle="labelSm" fontWeight="600">
                        {msg.author?.name || 'User'}
                      </Text>
                      <Text textStyle="bodySm" color={isOwn ? 'onPrimaryContainer' : 'onSurfaceVariant'} opacity={0.85}>
                        {formatDateTime(msg.createdAt)}
                      </Text>
                    </Flex>
                    <Text textStyle="bodySm" whiteSpace="pre-wrap">
                      {msg.body}
                    </Text>
                  </Box>
                </Flex>
              )
            })
          )}
        </Stack>

        {canPost ? (
          <Flex
            as="form"
            onSubmit={submit}
            gap="2"
            align="flex-end"
            p="3"
            bg="surface"
            borderTopWidth="1px"
            borderColor="outlineVariant"
          >
            <Textarea
              flex="1"
              rows={2}
              resize="none"
              placeholder="Write a message…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  submit(e)
                }
              }}
              css={{
                ...fluideInputStyles,
                _placeholder: { color: 'onSurfaceVariant', opacity: 0.7 },
              }}
            />
            <Button {...stitchGreenButton} type="submit" loading={busy} px="4" flexShrink={0}>
              <MaterialIcon name="send" size={18} />
              Send
            </Button>
          </Flex>
        ) : messages.length > 0 ? (
          <Box p="3" bg="surface" borderTopWidth="1px" borderColor="outlineVariant">
            <Text textStyle="bodySm" color="onSurfaceVariant">
              You can read this thread but cannot post new messages.
            </Text>
          </Box>
        ) : null}
      </Box>
      {error ? (
        <Text textStyle="bodySm" color="error" mt="2">
          {error}
        </Text>
      ) : null}
    </Box>
  )
}
