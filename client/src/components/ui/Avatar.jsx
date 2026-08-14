import cn from '../../lib/cn'
import { initials } from '../../lib/format'

const sizes = {
  xs: 'h-7 w-7 text-[0.62rem]',
  sm: 'h-8 w-8 text-[0.68rem]',
  md: 'h-10 w-10 text-[0.78rem]',
  lg: 'h-14 w-14 text-base',
}

export default function Avatar({ name = '', src, size = 'md', className = '', tone = 'brand' }) {
  return (
    <span
      className={cn(
        'inline-grid shrink-0 place-items-center overflow-hidden rounded-full font-display font-bold',
        sizes[size],
        tone === 'brand' ? 'bg-gradient-to-br from-brand-400 to-brand-600 text-white' : 'bg-slate-100 text-slate-500',
        className,
      )}
      aria-hidden="true"
    >
      {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : initials(name) || '?'}
    </span>
  )
}
