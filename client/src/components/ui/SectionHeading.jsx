import Reveal from './Reveal'

export default function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  tone = 'light',
  align = 'center',
  className = '',
}) {
  const centered = align === 'center'

  return (
    <div className={`${centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl text-left'} ${className}`}>
      {eyebrow && (
        <Reveal>
          <h6 className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-500">
            {eyebrow}
          </h6>
        </Reveal>
      )}

      <Reveal delay={0.06}>
        <h2
          id={id}
          className="mt-3 font-display text-3xl font-bold leading-[1.15] tracking-[-0.025em] text-ink sm:text-4xl"
        >
          {title}
        </h2>
      </Reveal>

      {description && (
        <Reveal delay={0.12}>
          <p className={`mt-4 text-pretty text-base leading-relaxed text-muted sm:text-lg ${centered ? 'mx-auto max-w-lg' : ''}`}>
            {description}
          </p>
        </Reveal>
      )}
    </div>
  )
}
