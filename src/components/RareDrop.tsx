import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { rareDrop } from '../content'

export default function RareDrop() {
  const reduced = useReducedMotion()
  const hasPrLink = rareDrop.cta.href.startsWith('http')

  return (
    <section id="rare-drop" className="scroll-mt-20 px-4 py-16 sm:px-6">
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-accent-amber/40 bg-gradient-to-br from-panel to-deep p-8 shadow-[0_0_60px_rgba(251,191,36,0.15)] sm:p-12"
      >
        {/* Golden shine sweep on first view */}
        {!reduced && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(105deg, transparent 42%, rgba(251,191,36,0.16) 50%, transparent 58%)',
            }}
            initial={{ x: '-120%' }}
            whileInView={{ x: '120%' }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.3, delay: 0.4, ease: 'easeInOut' }}
          />
        )}

        <p className="flex items-center justify-center gap-2 text-center font-mono text-xs font-bold tracking-[0.35em] text-accent-amber">
          <Sparkles className="h-4 w-4" aria-hidden />
          {rareDrop.eyebrow}
          <Sparkles className="h-4 w-4" aria-hidden />
        </p>
        <h2 className="mt-5 text-center font-display text-2xl font-bold leading-snug text-ink sm:text-3xl">
          {rareDrop.title}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-center text-sm italic leading-relaxed text-ink-muted sm:text-base">
          {rareDrop.body}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          {rareDrop.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-accent-amber/40 bg-accent-amber/10 px-3 py-1 font-mono text-[11px] font-medium tracking-wider text-accent-amber"
            >
              {chip}
            </span>
          ))}
        </div>
        <div className="mt-8 text-center">
          {hasPrLink ? (
            <a
              href={rareDrop.cta.href}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-lg bg-accent-amber px-6 py-3 font-mono text-sm font-bold text-deep transition-shadow hover:shadow-[0_0_28px_rgba(251,191,36,0.5)]"
            >
              {rareDrop.cta.label}
            </a>
          ) : (
            /* TODO_PR_LINK — becomes a live button once the URL is set in content.ts */
            <span className="inline-block cursor-not-allowed rounded-lg border border-accent-amber/40 px-6 py-3 font-mono text-sm font-bold text-accent-amber/60">
              {rareDrop.cta.label}
            </span>
          )}
        </div>
      </motion.div>
    </section>
  )
}
