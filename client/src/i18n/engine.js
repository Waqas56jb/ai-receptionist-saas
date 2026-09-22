function interpolate(template, vars = {}) {
  return String(template).replace(/\{\{(\w+)\}\}/g, (_, key) => (vars[key] == null ? '' : String(vars[key])))
}

export function createTranslator(dictionary) {
  const dict = dictionary || {}
  return function t(input, vars) {
    if (input == null) return ''
    const key = String(input)
    const trimmed = key.trim()
    const exact = dict[key] ?? dict[trimmed]
    if (exact) return interpolate(exact, vars)
    const ofPair = trimmed.match(/^(\d+) of (\d+) entries$/)
    if (ofPair && dict['{{n}} of {{total}} entries']) {
      return interpolate(dict['{{n}} of {{total}} entries'], { n: ofPair[1], total: ofPair[2] })
    }
    const ofGeneric = trimmed.match(/^(\d+) of (\d+) (.+)$/)
    if (ofGeneric && dict['{{n}} of {{total}} {{label}}']) {
      return interpolate(dict['{{n}} of {{total}} {{label}}'], {
        n: ofGeneric[1],
        total: ofGeneric[2],
        label: t(ofGeneric[3]),
      })
    }
    const minAgo = trimmed.match(/^(\d+) min ago$/)
    if (minAgo && dict['{{n}} min ago']) return interpolate(dict['{{n}} min ago'], { n: minAgo[1] })
    const hAgo = trimmed.match(/^(\d+) h ago$/)
    if (hAgo && dict['{{n}} h ago']) return interpolate(dict['{{n}} h ago'], { n: hAgo[1] })
    const dAgo = trimmed.match(/^(\d+) d ago$/)
    if (dAgo && dict['{{n}} d ago']) return interpolate(dict['{{n}} d ago'], { n: dAgo[1] })
    const noMatches = trimmed.match(/^No matches for [“"'](.+)[”"']\.?$/)
    if (noMatches && dict['No matches for “{{query}}”.']) {
      return interpolate(dict['No matches for “{{query}}”.'], { query: noMatches[1] })
    }
    if (vars) return interpolate(key, vars)
    return key
  }
}

function sourceFor(current, stored, t) {
  if (!stored) return current
  if (current === stored || current === t(stored)) return stored
  return current
}

export function translateAttr(el, attr, t, lang) {
  const value = el.getAttribute(attr)
  if (!value) return
  const flag = `data-i18n-${attr}`
  const stored = el.getAttribute(flag) || value
  if (lang === 'en') {
    if (el.hasAttribute(flag)) {
      el.setAttribute(attr, stored)
      el.removeAttribute(flag)
    }
    return
  }
  const source = sourceFor(value, stored, t)
  if (!el.hasAttribute(flag)) el.setAttribute(flag, source)
  const next = t(source)
  if (next !== value) el.setAttribute(attr, next)
}

export function translateDom(root, t, lang) {
  if (!root) return
  const walk = (node) => {
    if (!node) return
    if (node.nodeType === Node.TEXT_NODE) {
      const raw = node.nodeValue
      if (!raw || !raw.trim()) return
      const leading = raw.match(/^\s*/)[0]
      const trailing = raw.match(/\s*$/)[0]
      const core = raw.trim()
      const source = sourceFor(core, node.__i18nOrig, t)
      node.__i18nOrig = source
      if (lang === 'en') {
        if (core !== source) node.nodeValue = `${leading}${source}${trailing}`
        return
      }
      const translated = t(source)
      if (translated !== core) node.nodeValue = `${leading}${translated}${trailing}`
      return
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return
    const el = node
    if (el.closest?.('[data-no-i18n]')) return
    const tag = el.tagName
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA' || tag === 'CODE' || tag === 'PRE') return
    translateAttr(el, 'placeholder', t, lang)
    translateAttr(el, 'aria-label', t, lang)
    translateAttr(el, 'title', t, lang)
    translateAttr(el, 'alt', t, lang)
    el.childNodes.forEach(walk)
  }
  walk(root)
}
