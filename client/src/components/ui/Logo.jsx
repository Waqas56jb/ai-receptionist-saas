import { brand } from '../../config/brand'

/**
 * The supplied logo is a wordmark on a black plate; `public/logo-mark.png` is
 * the same artwork with the plate keyed out, so it sits on light and dark
 * surfaces alike. Original file is kept untouched at `public/logo.png`.
 */
export default function Logo({ className = '', size = 'md' }) {
  const heights = {
    sm: 'h-7 sm:h-8',
    md: 'h-8 sm:h-9',
    lg: 'h-9 sm:h-10',
  }

  return (
    <span className={`inline-flex items-center ${className}`}>
      <img
        src={brand.logo}
        alt={brand.name}
        width={448}
        height={178}
        className={`${heights[size]} w-auto`}
        decoding="async"
      />
    </span>
  )
}
