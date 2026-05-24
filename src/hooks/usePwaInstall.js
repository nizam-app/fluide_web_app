import { useCallback, useEffect, useState } from 'react'

function detectIos() {
  if (typeof navigator === 'undefined') return false
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function detectInstalled() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

/** Captures `beforeinstallprompt` for Chromium install; tracks iOS / already-installed. */
export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(detectInstalled)
  const [isIos] = useState(detectIos)

  useEffect(() => {
    if (detectInstalled()) return undefined

    const onBeforeInstall = (event) => {
      event.preventDefault()
      setDeferredPrompt(event)
    }

    const onInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const install = useCallback(async () => {
    if (!deferredPrompt) return false
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    setDeferredPrompt(null)
    if (outcome === 'accepted') setIsInstalled(true)
    return outcome === 'accepted'
  }, [deferredPrompt])

  return {
    canPromptInstall: Boolean(deferredPrompt),
    install,
    isInstalled,
    isIos,
    showBanner: !isInstalled,
  }
}
