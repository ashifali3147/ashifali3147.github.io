import { motion, useReducedMotion } from 'framer-motion'
import { hero } from '../content'
import { useTypewriter } from '../hooks/useTypewriter'

export default function Hero() {
  const typed = useTypewriter(hero.typewriter)
  const reduced = useReducedMotion()

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduced ? 0 : 0.15 },
    },
  }
  const item = {
    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
  }

  return (
    <section id="top" className="relative flex min-h-screen items-center px-4 pt-14 sm:px-6">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto grid w-full max-w-6xl items-center gap-12 py-20 lg:grid-cols-[1.4fr_1fr]"
      >
        <div>
          <motion.p
            variants={item}
            className="font-mono text-sm font-medium tracking-[0.3em] text-accent-amber"
          >
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            variants={item}
            className="gradient-text mt-4 font-display font-bold leading-tight"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          >
            {hero.headline}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-2 h-[1.6em] font-display text-xl font-medium text-ink sm:text-2xl"
          >
            <span className="sr-only">{hero.typewriter.join(', ')}</span>
            <span aria-hidden>{typed}</span>
            <span aria-hidden className="anim-blink ml-1 inline-block w-[2px] -translate-y-[2px] self-stretch bg-accent-cyan">
              &nbsp;
            </span>
          </motion.p>

          <motion.p variants={item} className="mt-6 max-w-xl text-ink-muted">
            {hero.subline}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
            <a
              href={hero.ctaPrimary.href}
              className="rounded-lg bg-accent-violet-deep px-6 py-3 font-mono text-sm font-bold text-white transition-shadow hover:shadow-[0_0_28px_rgba(139,92,246,0.55)]"
            >
              {hero.ctaPrimary.label}
            </a>
            <a
              href={hero.ctaSecondary.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-accent-cyan/60 px-6 py-3 font-mono text-sm font-bold text-accent-cyan transition-all hover:bg-accent-cyan/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]"
            >
              {hero.ctaSecondary.label}
            </a>
          </motion.div>
        </div>

        {/* Character sheet */}
        <motion.div variants={item} className="lg:justify-self-end">
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-panel/80 p-6 shadow-[0_0_40px_rgba(139,92,246,0.12)] backdrop-blur">
            <p className="mb-4 flex items-center justify-between font-mono text-[10px] tracking-[0.3em] text-ink-muted">
              CHARACTER SHEET
              <span className="text-accent-mint">● ONLINE</span>
            </p>
            <dl className="space-y-3 font-mono text-sm">
              {hero.statCard.map((row) => (
                <div
                  key={row.key}
                  className="flex items-baseline justify-between gap-4 border-b border-white/5 pb-2"
                >
                  <dt className="text-xs tracking-widest text-ink-muted">{row.key}</dt>
                  <dd className="text-right font-medium text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
