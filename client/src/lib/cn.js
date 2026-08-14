/** Tiny classname joiner — filters out falsy values. */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default cn
