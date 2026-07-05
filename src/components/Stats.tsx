import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { Lock } from 'lucide-react'
import SectionHeader from './SectionHeader'
import { nextUnlocks, skillCategories, skillInTraining, type Accent, type Skill } from '../content'

const accentHex: Record<Accent, string> = {
  violet: '#8B5CF6',
  cyan: '#22D3EE',
  coral: '#FB7185',
  amber: '#FBBF24',
  mint: '#34D399',
}

// For small text, violet needs the lighter AA-contrast shade.
const accentTextHex: Record<Accent, string> = { ...accentHex, violet: '#A78BFA' }

function XPBar({ skill, accent }: { skill: Skill; accent: Accent }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setDisplay(skill.level)
      return
    }
    const controls = animate(0, skill.level, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, reduced, skill.level])

  return (
    <div ref={ref}>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sm text-ink">
          {skill.icon && (
            <img src={skill.icon} alt="" width={16} height={16} loading="lazy" aria-hidden />
          )}
          {skill.name}
        </span>
        <span className="font-mono text-xs text-ink-muted">
          <span style={{ color: accentTextHex[accent] }}>{display}</span> XP
        </span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-white/10"
        role="meter"
        aria-valuenow={skill.level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${skill.name} skill level`}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: accentHex[accent] }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={reduced ? { duration: 0 } : { duration: 1.2, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

function TrainingBar() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()

  return (
    <div ref={ref} className="mt-8 rounded-lg border border-accent-amber/30 bg-accent-amber/5 p-4">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 font-mono text-xs font-medium text-accent-amber">
          {skillInTraining.icon && (
            <img src={skillInTraining.icon} alt="" width={16} height={16} loading="lazy" aria-hidden />
          )}
          {skillInTraining.label}
        </span>
        <span className="font-mono text-xs text-ink-muted">
          <span className="text-accent-amber">{skillInTraining.level}</span> XP
        </span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-white/10"
        role="meter"
        aria-valuenow={skillInTraining.level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Jetpack Compose skill level (in training)"
      >
        <motion.div
          className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-accent-amber to-accent-coral"
          initial={{ width: 0 }}
          animate={inView ? { width: `${skillInTraining.level}%` } : { width: 0 }}
          transition={reduced ? { duration: 0 } : { duration: 1.2, ease: 'easeOut' }}
        >
          <span
            aria-hidden
            className="anim-shimmer absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          />
        </motion.div>
      </div>
      <p className="mt-2 font-mono text-[10px] tracking-wider text-ink-muted">
        {skillInTraining.caption}
      </p>
    </div>
  )
}

function LockedChips() {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {nextUnlocks.map((unlock) => (
        <button
          key={unlock.label}
          type="button"
          className="group relative rounded-md border border-dashed border-white/15 bg-panel/50 px-3 py-1.5 transition-colors hover:border-white/30 focus:border-white/30"
        >
          <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-ink-muted">
            <Lock className="h-3 w-3" aria-hidden />
            {unlock.label}
          </span>
          <span
            role="tooltip"
            className="pointer-events-none absolute -top-9 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded border border-white/10 bg-deep px-2 py-1 font-mono text-[10px] text-ink-muted group-hover:block group-focus:block"
          >
            {unlock.tooltip}
          </span>
        </button>
      ))}
    </div>
  )
}

export default function Stats() {
  return (
    <section id="stats" className="scroll-mt-20 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="SKILL TREE" title="Character Stats" accent="violet" />
        <div className="grid gap-8 md:grid-cols-3">
          {skillCategories.map((category) => (
            <div key={category.title}>
              <h3
                className="mb-5 font-mono text-xs font-bold tracking-[0.25em]"
                style={{ color: accentTextHex[category.accent] }}
              >
                {category.title.toUpperCase()}
              </h3>
              <div className="space-y-4">
                {category.skills.map((skill) => (
                  <XPBar key={skill.name} skill={skill} accent={category.accent} />
                ))}
              </div>
              {category.title === 'Core Weapons' && (
                <>
                  <TrainingBar />
                  <LockedChips />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
