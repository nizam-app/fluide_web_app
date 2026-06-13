import { Box } from '@chakra-ui/react'
import { CONTACT_EMAIL } from '../../content/siteContact'

/** Opens the visitor's email app to compose a message to Flunexia. */
export function openContactEmail() {
  const href = `mailto:${CONTACT_EMAIL}`
  try {
    const anchor = document.createElement('a')
    anchor.href = href
    anchor.rel = 'noopener noreferrer'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  } catch {
    window.location.assign(href)
  }
}

/**
 * Clickable contact@flunexia.fr — uses a programmatic mailto click so the link
 * works in PWA / standalone mode and when the default mail client is not registered.
 */
export function ContactEmailLink({ children, onClick, ...props }) {
  const handleClick = (event) => {
    event.preventDefault()
    event.stopPropagation()
    onClick?.(event)
    openContactEmail()
  }

  return (
    <Box
      as="a"
      href={`mailto:${CONTACT_EMAIL}`}
      onClick={handleClick}
      cursor="pointer"
      {...props}
    >
      {children ?? CONTACT_EMAIL}
    </Box>
  )
}
