/**
 * Stand-in for the admin HTTP client. Every service goes through `request()`,
 * so replacing this file with a real fetch wrapper connects the backend.
 */
const DEFAULT_LATENCY = [220, 520]

function randomLatency([min, max]) {
  return min + Math.random() * (max - min)
}

export function clone(value) {
  return typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value))
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

let counter = 0
export function makeId(prefix = 'id') {
  counter += 1
  return `${prefix}_${counter}${Math.floor(performance.now()).toString(36)}`
}
