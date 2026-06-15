import { useEffect, useRef, useState } from 'react'
import { Box, Image, Text } from '@chakra-ui/react'

/**
 * Looping hero visual for the marketing homepage.
 *
 * - Auto-rotates through `slides` with a soft cross-fade, loops forever.
 * - Respects `prefers-reduced-motion` (shows the first slide, no animation).
 * - Drop-in upgrade path to video: pass `videoSrc` (or set HOME_HERO_VIDEO in
 *   content) and it renders an autoplay muted loop instead of the slideshow.
 */
export function HeroCarousel({ slides = [], videoSrc = '', poster = '', interval = 4000, lang = 'en' }) {
  const [active, setActive] = useState(0)
  const reducedMotion = usePrefersReducedMotion()

  const count = slides.length

  useEffect(() => {
    if (videoSrc || reducedMotion || count <= 1) return undefined
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % count)
    }, interval)
    return () => window.clearInterval(id)
  }, [videoSrc, reducedMotion, count, interval])

  if (videoSrc) {
    return (
      <Box position="relative" w="full" h="full" bg="surface">
        <Box
          as="video"
          src={videoSrc}
          poster={poster || undefined}
          autoPlay
          muted
          loop
          playsInline
          w="full"
          h="full"
          objectFit="cover"
          objectPosition="center"
          sx={{ '& ': { display: 'block' } }}
        />
      </Box>
    )
  }

  if (count === 0) return null

  return (
    <Box position="relative" w="full" h="full" bg="surface" overflow="hidden">
      {slides.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt || ''}
          translate="no"
          loading={i === 0 ? 'eager' : 'lazy'}
          position="absolute"
          inset="0"
          w="full"
          h="full"
          objectFit="cover"
          objectPosition="center"
          opacity={i === active ? 1 : 0}
          transition="opacity 900ms ease-in-out"
          aria-hidden={i === active ? undefined : true}
        />
      ))}

      {/* Caption + gradient scrim for legibility */}
      <Box
        position="absolute"
        insetX="0"
        bottom="0"
        pt="16"
        pb={{ base: 4, md: 5 }}
        px={{ base: 4, md: 6 }}
        bgGradient="linear(to-t, blackAlpha.700, blackAlpha.300, transparent)"
        pointerEvents="none"
      >
        <Text
          color="white"
          fontWeight="700"
          fontSize={{ base: 'sm', md: 'md' }}
          lineHeight="1.4"
          translate="no"
          className="notranslate"
          lang={lang}
          textShadow="0 1px 8px rgba(0,0,0,0.45)"
        >
          {slides[active]?.caption}
        </Text>

        {count > 1 ? (
          <Box display="flex" gap="2" mt="3">
            {slides.map((slide, i) => (
              <Box
                key={`dot-${slide.src}`}
                h="1.5"
                borderRadius="full"
                bg="white"
                opacity={i === active ? 1 : 0.45}
                w={i === active ? '6' : '1.5'}
                transition="all 400ms ease"
              />
            ))}
          </Box>
        ) : null}
      </Box>
    </Box>
  )
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  const mountedRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    mountedRef.current = true
    query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])

  return reduced
}
