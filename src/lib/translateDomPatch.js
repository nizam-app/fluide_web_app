/**
 * Google Translate (and similar tools) wrap/replace text nodes, so React's DOM updates
 * can throw removeChild / insertBefore errors. Patch native DOM methods to no-op safely
 * when the tree was mutated externally. See facebook/react#11538.
 */
const TRANSLATE_DOM_RE = /removeChild|insertBefore|replaceChild/i

function isDev() {
  try {
    return import.meta.env?.DEV
  } catch {
    return false
  }
}

function warnDev(message, ...args) {
  if (isDev()) {
    console.warn(`[translateDomPatch] ${message}`, ...args)
  }
}

export function applyTranslateDomPatch() {
  if (typeof Node !== 'function' || !Node.prototype || Node.prototype.__flunexiaTranslatePatch) {
    return
  }

  const originalRemoveChild = Node.prototype.removeChild
  Node.prototype.removeChild = function removeChildPatched(child) {
    if (child?.parentNode !== this) {
      warnDev('Skipped removeChild — parent mismatch (likely browser translate).', child, this)
      return child
    }
    return originalRemoveChild.call(this, child)
  }

  const originalInsertBefore = Node.prototype.insertBefore
  Node.prototype.insertBefore = function insertBeforePatched(newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      warnDev(
        'Skipped insertBefore — reference parent mismatch (likely browser translate).',
        referenceNode,
        this,
      )
      return newNode
    }
    return originalInsertBefore.call(this, newNode, referenceNode)
  }

  if (typeof Node.prototype.replaceChild === 'function') {
    const originalReplaceChild = Node.prototype.replaceChild
    Node.prototype.replaceChild = function replaceChildPatched(newChild, oldChild) {
      if (oldChild?.parentNode !== this) {
        warnDev('Skipped replaceChild — parent mismatch (likely browser translate).', oldChild, this)
        return oldChild
      }
      return originalReplaceChild.call(this, newChild, oldChild)
    }
  }

  Object.defineProperty(Node.prototype, '__flunexiaTranslatePatch', { value: true })
}

export function isTranslateDomError(error) {
  const message = error?.message || String(error || '')
  return TRANSLATE_DOM_RE.test(message)
}

applyTranslateDomPatch()
