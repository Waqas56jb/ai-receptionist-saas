import Reveal from './Reveal'

/**
 * Shared section header: eyebrow + h2 + supporting line.
 * `tone="dark"` flips it for the deep-navy sections.
 */
export default function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  tone = 'light',
  align = 'center',
  className = '',
}) {
  const dark = tone === 'dark'
  const centered = align === 'center'

  return (
    <div
      className={`${centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl text-left'} ${className}`}
    >
      {eyebrow && (
        <Reveal>
          <span className={dark ? 'eyebrow-dark' : 'eyebrow'}>
            <span
              className={`h-1.5 w-1.5 rounded-full ${dark ? 'bg-brand-300' : 'bg-brand-500'}`}
              aria-hidden="true"
            />
            {eyebrow}
          </span>
        </Reveal>
      )}

      <Reveal delay={0.06}>
        <h2
          id={id}
          className={`mt-5 text-[2rem] font-bold leading-[1.12] tracking-tight sm:text-[2.5rem] lg:text-[2.85rem] ${
            dark ? 'text-white' : 'text-ink-900'
          }`}
        >
          {title}
        </h2>
      </Reveal>

      {description && (
        <Reveal delay={0.12}>
          <p
            className={`mt-5 text-pretty text-base leading-relaxed sm:text-lg ${
              dark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  )
}
