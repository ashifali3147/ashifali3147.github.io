import { motion, useReducedMotion } from 'framer-motion'
import type { Accent } from '../content'

const accentText: Record<Accent, string> = {
  violet: 'text-accent-violet-light',
  cyan: 'text-accent-cyan',
  coral: 'text-accent-coral',
  amber: 'text-accent-amber',
  mint: 'text-accent-mint',
}

export default function SectionHeader({
  eyebrow,
  title,
  accent = 'violet',
}: {
  eyebrow: string
  title: string
  accent?: Accent
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mb-12 text-center"
    >
      <p className={`font-mono text-xs font-medium tracking-[0.3em] ${accentText[accent]}`}>
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{title}</h2>
    </motion.div>
  )
}
