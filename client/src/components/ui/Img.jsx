import { useState } from 'react'

/**
 * Lazy, responsive image with a graceful navy fallback so a blocked or
 * broken remote photo never leaves an empty hole in the layout.
 */
export default function Img({ src, alt, className = '', width, height, loading = 'lazy' }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`bg-gradient-to-br from-ink-800 via-ink-700 to-brand-800 ${className}`}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  )
}
