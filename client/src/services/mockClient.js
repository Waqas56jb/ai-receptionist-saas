/**
 * Stand-in for the HTTP client. Every service call goes through `request()`,
 * so replacing this file with a real fetch/axios wrapper is the only change
 * needed when the backend lands.
 */

const DEFAULT_LATENCY = [220, 520]

function randomLatency([min, max]) {
  return min + Math.random() * (max - min)
}

/** Deep clone so callers can never mutate the store by accident. */
export function clone(value) {
  return typeof structuredClone === 'function'
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value))
}

export function request(resolver, { latency = DEFAULT_LATENCY, fail = false } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) {
        reject(new Error('REQUEST_FAILED'))
        return
      }
      try {
        resolve(clone(typeof resolver === 'function' ? resolver() : resolver))
      } catch (error) {
        reject(error)
      }
    }, randomLatency(latency))
  })
}

/** Stable-ish ids for records created in the browser during a demo session. */
let counter = 0
export function makeId(prefix = 'id') {
  counter += 1
  return `${prefix}_${counter}${Math.floor(performance.now()).toString(36)}`
}
