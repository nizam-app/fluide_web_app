import { useEffect, useState } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'
import { BrandName } from '../atoms/BrandName'

const STYLE_ID = 'hero-carousel-keyframes'
const KEYFRAMES = `
@keyframes hcKenBurns { from { transform: scale(1); } to { transform: scale(1.12); } }
@keyframes hcFill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes hcRise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes hcPulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .35; transform: scale(.8); } }
`

/**
 * Premium looping hero visual for the marketing homepage.
 *
 * - Cinematic Ken Burns zoom + soft cross-fade between scenes, loops forever.
 * - Story-style segmented progress bars that fill across each slide.
 * - Frosted-glass caption chip with a scene icon + label.
 * - Respects `prefers-reduced-motion` (static first slide, no animation).
 * - Swap-ready for video: pass `videoSrc` to play an MP4 loop instead.
 */
export function HeroCarousel({ slides = [], videoSrc = '', poster = '', interval = 4500, lang = 'en' }) {
  const [active, setActive] = useState(0)
  const reducedMotion = usePrefersReducedMotion()
  useKeyframes()

  const count = slides.length

  useEffect(() => {
    if (videoSrc || reducedMotion || count <= 1) return undefined
    const id = window.setInterval(() => setActive((prev) => (prev + 1) % count), interval)
    return () => window.clearInterval(id)
  }, [videoSrc, reducedMotion, count, interval])

  if (videoSrc) {
    return (
      <Box position="relative" w="full" h="full" bg="surfaceContainerHigh">
        <Box
          as="video"
          src={videoSrc}
          poster={poster || undefined}
          autoPlay
          muted
          loop
          playsInline
          display="block"
          w="full"
          h="full"
          objectFit="cover"
          objectPosition="center"
        />
      </Box>
    )
  }

  if (count === 0) return null
  const current = slides[active]

  return (
    <Box position="relative" w="full" h="full" bg="surfaceContainerHigh" overflow="hidden">
      {/* Scene layers */}
      {slides.map((slide, i) => (
        <Box
          key={slide.src}
          position="absolute"
          inset="0"
          opacity={i === active ? 1 : 0}
          transition="opacity 1100ms cubic-bezier(0.4, 0, 0.2, 1)"
          aria-hidden={i === active ? undefined : true}
          overflow="hidden"
        >
          <Box
            as="img"
            src={slide.src}
            alt={slide.alt || ''}
            translate="no"
            loading={i === 0 ? 'eager' : 'lazy'}
            w="full"
            h="full"
            objectFit="cover"
            objectPosition="center"
            display="block"
            style={
              reducedMotion
                ? undefined
                : { animation: 'hcKenBurns 14s ease-in-out infinite alternate' }
            }
          />
        </Box>
      ))}

      {/* Legibility scrim */}
      <Box
        position="absolute"
        inset="0"
        pointerEvents="none"
        bgImage="linear-gradient(to top, rgba(8,15,12,0.78) 0%, rgba(8,15,12,0.28) 38%, rgba(8,15,12,0) 62%)"
      />

      {/* Top: story-style progress segments */}
      <Flex position="absolute" top="3" insetX="3" gap="1.5" zIndex={2}>
        {slides.map((slide, i) => (
          <Box
            key={`seg-${slide.src}`}
            flex="1"
            h="3px"
            borderRadius="full"
            bg="whiteAlpha.400"
            overflow="hidden"
          >
            <Box
              key={i === active ? `fill-active-${active}` : `fill-idle-${i}`}
              h="full"
              w="full"
              borderRadius="full"
              bg="white"
              transformOrigin="left"
              transform={i < active ? 'scaleX(1)' : 'scaleX(0)'}
              style={
                i === active && !reducedMotion
                  ? { animation: `hcFill ${interval}ms linear forwards` }
                  : undefined
              }
            />
          </Box>
        ))}
      </Flex>

      {/* Top-right: live badge */}
      <Flex
        position="absolute"
        top="4"
        right="4"
        align="center"
        gap="2"
        px="3"
        py="1.5"
        borderRadius="full"
        bg="blackAlpha.500"
        backdropFilter="blur(8px)"
        zIndex={2}
      >
        <Box
          w="2"
          h="2"
          borderRadius="full"
          bg="accentMint"
          style={reducedMotion ? undefined : { animation: 'hcPulse 1.8s ease-in-out infinite' }}
        />
        <BrandName uppercase fontSize="2xs" fontWeight="700" color="white" letterSpacing="0.06em" />
      </Flex>

      {/* Bottom-left: frosted caption chip */}
      <Flex
        key={`cap-${active}`}
        position="absolute"
        left={{ base: 3, md: 5 }}
        right={{ base: 3, md: 5 }}
        bottom={{ base: 3, md: 5 }}
        align="center"
        gap="3"
        px={{ base: 3, md: 4 }}
        py={{ base: 2.5, md: 3 }}
        borderRadius="2xl"
        bg="blackAlpha.500"
        backdropFilter="blur(14px)"
        borderWidth="1px"
        borderColor="whiteAlpha.300"
        boxShadow="0 8px 30px rgba(0,0,0,0.35)"
        zIndex={2}
        style={reducedMotion ? undefined : { animation: 'hcRise 600ms cubic-bezier(0.4,0,0.2,1)' }}
      >
        <Flex
          flexShrink={0}
          w={{ base: 9, md: 10 }}
          h={{ base: 9, md: 10 }}
          borderRadius="xl"
          bg="primary"
          align="center"
          justify="center"
        >
          <MaterialIcon name={current.icon || 'check'} size={22} color="white" />
        </Flex>
        <Box minW={0}>
          {current.label ? (
            <Text
              fontSize="2xs"
              fontWeight="700"
              color="accentMint"
              letterSpacing="0.06em"
              textTransform="uppercase"
              translate="no"
              className="notranslate"
              lang={lang}
              mb="0.5"
            >
              {current.label}
            </Text>
          ) : null}
          <Text
            fontSize={{ base: 'sm', md: 'md' }}
            fontWeight="600"
            color="white"
            lineHeight="1.35"
            translate="no"
            className="notranslate"
            lang={lang}
          >
            {current.caption}
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}

function useKeyframes() {
  useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return
    const el = document.createElement('style')
    el.id = STYLE_ID
    el.textContent = KEYFRAMES
    document.head.appendChild(el)
  }, [])
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])
  return reduced
}
