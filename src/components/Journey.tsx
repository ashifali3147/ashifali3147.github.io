import { useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import SectionHeader from './SectionHeader'
import WorldMap from './WorldMap'
import { levels, nextLevel, type Level } from '../content'

// The snaking journey path lives in a fixed-width column: left rail on mobile,
// centered on md+. A faint dotted base path sits underneath; a glowing solid
// path draws over it as the user scrolls (the signature animation).
const SNAKE_PATH =
  'M40 0 C 64 60, 16 120, 40 180 C 64 240, 16 300, 40 360 C 64 420, 16 480, 40 540 C 64 600, 16 660, 40 720 C 64 780, 16 840, 40 900 C 58 945, 40 975, 40 1000'

function LevelNode({ level, index }: { level: Level; index: number }) {
  const ref = useRef<HTMLLIElement>(null)
  const inView = useInView(ref, { once: true, margin: '-120px' })
  const reduced = useReducedMotion()
  const onLeft = index % 2 === 0

  return (
    <li ref={ref} className="relative md:grid md:grid-cols-2 md:gap-x-24">
      {/* Node badge on the path */}
      <div
        className={`absolute left-5 top-1 z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border-2 bg-deep font-mono text-sm font-bold transition-all duration-500 md:left-1/2 ${
          inView
            ? 'anim-pulse-glow border-accent-violet text-accent-violet shadow-[0_0_18px_rgba(139,92,246,0.5)]'
            : 'border-white/20 text-ink-muted'
        }`}
        aria-hidden
      >
        {level.number}
      </div>

      <motion.div
        initial={reduced ? false : { opacity: 0, x: onLeft ? -40 : 40 }}
        animate={inView ? { opacity: 1, x: 0 } : undefined}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`ml-14 rounded-xl border border-white/10 bg-panel/80 p-6 backdrop-blur-sm md:ml-0 ${
          onLeft ? 'md:col-start-1' : 'md:col-start-2'
        }`}
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-mono text-[10px] font-bold tracking-[0.25em] text-accent-cyan">
            LEVEL {level.number}
          </span>
          <span className="font-mono text-[10px] tracking-wider text-ink-muted">{level.period}</span>
          <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-ink-muted">
            {level.location}
          </span>
        </div>
        <h3 className="mt-2 font-display text-xl font-bold text-ink">{level.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{level.body}</p>
        <p className="mt-4 inline-block rounded-md border border-accent-amber/40 bg-accent-amber/10 px-3 py-1 font-mono text-[11px] font-medium tracking-wider text-accent-amber">
          🏆 {level.badge}
        </p>
      </motion.div>
    </li>
  )
}

export default function Journey() {
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 0.75', 'end 0.55'],
  })
  const pathLength = useSpring(scrollYProgress, { stiffness: 70, damping: 22 })

  return (
    <section id="journey" className="scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <SectionHeader eyebrow="CAMPAIGN MAP" title="The Journey" accent="cyan" />

        <WorldMap />

        <div ref={trackRef} className="relative">
          {/* Journey path column */}
          <svg
            className="absolute left-5 top-0 h-full w-10 -translate-x-1/2 md:left-1/2 md:w-20"
            viewBox="0 0 80 1000"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="journey-grad" x1="0" y1="0" x2="0" y2="1000" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
            {/* Faint dotted base */}
            <path
              d={SNAKE_PATH}
              fill="none"
              stroke="rgba(139,92,246,0.25)"
              strokeWidth="2"
              strokeDasharray="1 8"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            {/* Glowing draw-on-scroll overlay */}
            <motion.path
              d={SNAKE_PATH}
              fill="none"
              stroke="url(#journey-grad)"
              strokeWidth="3"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={reduced ? { pathLength: 1 } : { pathLength }}
              filter="drop-shadow(0 0 6px rgba(139,92,246,0.7))"
            />
          </svg>

          <ol className="space-y-16 pb-16 md:space-y-24">
            {levels.map((level, i) => (
              <LevelNode key={level.number} level={level} index={i} />
            ))}
          </ol>

          {/* Final node: NEXT LEVEL ??? */}
          <div className="relative flex justify-center pb-4">
            <a
              href={nextLevel.href}
              className="anim-pulse-glow-cyan group flex flex-col items-center gap-3 rounded-xl border border-accent-cyan/40 bg-panel/80 px-8 py-5 text-center transition-colors hover:border-accent-cyan"
            >
              <span className="font-mono text-sm font-bold tracking-[0.25em] text-accent-cyan">
                {nextLevel.label}
              </span>
              <span className="text-sm italic text-ink-muted group-hover:text-ink">
                {nextLevel.text}
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
