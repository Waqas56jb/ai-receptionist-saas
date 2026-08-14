import { cn } from '../../lib/utils'

const heights = { sm: 'h-7', md: 'h-8', lg: 'h-9' }

export default function Logo({ size = 'md', className = '' }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <img src="/admin/logo-mark.png" alt="DEVMARK SOLUTION" width={448} height={178} className={cn(heights[size], 'w-auto')} decoding="async" />
      <span className="rounded-md bg-ink-900 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white">
        Admin
      </span>
    </span>
  )
}
