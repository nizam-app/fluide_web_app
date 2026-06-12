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
