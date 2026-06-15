import { Box } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
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
 * contact@flunexia.fr — by default opens the /contact page (buyer expectation).
 * Use mode="mailto" only where direct email compose is intended (e.g. contact page sidebar).
 */
export function ContactEmailLink({ children, onClick, mode = 'contact', to = '/contact', ...props }) {
  if (mode === 'mailto') {
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

  return (
    <Box as={RouterLink} to={to} onClick={onClick} cursor="pointer" {...props}>
      {children ?? CONTACT_EMAIL}
    </Box>
  )
}
