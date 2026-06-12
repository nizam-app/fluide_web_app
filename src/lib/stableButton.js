/** Props that avoid Chakra `loading` spinner DOM swaps (removeChild crashes with React + translation). */
export function stableBusyProps(busy) {
  return {
    disabled: Boolean(busy),
    opacity: busy ? 0.75 : 1,
    className: 'notranslate',
    translate: 'no',
    lang: 'en',
    'aria-busy': busy || undefined,
  }
}

/** Defer React state updates until after paint — avoids removeChild crashes when browser translate mutates the DOM. */
export function deferDomUpdate(callback) {
  if (typeof window === 'undefined') {
    callback()
    return
  }
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(callback)
  })
}
