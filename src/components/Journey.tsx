import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import SectionHeader from './SectionHeader'
import WorldMap from './WorldMap'
import { levels, nextLevel, type Level } from '../content'

// The journey path is generated at the container's real pixel size (no viewBox
// stretching) and revealed via measured stroke-dashoffset — the only SVG
// draw-on technique that behaves identically across engines and screen sizes.
function buildSnakePath(height: number): string {
  if (height <= 0) return ''
  const cx = 40
  const seg = 240
  let d = `M${cx} 0`
  for (let y = 0; y < height; y += seg) {
    const end = Math.min(y + seg, height)
    const s = end - y
    const amp = Math.min(24, s / 4)
    d += ` C ${cx + amp} ${(y + s / 3).toFixed(1)} ${cx - amp} ${(y + (2 * s) / 3).toFixed(1)} ${cx} ${end.toFixed(1)}`
  }
  return d
}

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
            ? 'anim-pulse-glow border-accent-violet text-accent-violet-light shadow-[0_0_18px_rgba(139,92,246,0.5)]'
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
  const pathRef = useRef<SVGPathElement>(null)
  const reduced = useReducedMotion()

  // Track the real rendered height so the path is built in 1:1 pixel units.
  const [trackHeight, setTrackHeight] = useState(0)
  useLayoutEffect(() => {
    const el = trackRef.current
    if (!el) return
    const update = () => setTrackHeight(el.offsetHeight)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const snakePath = useMemo(() => buildSnakePath(trackHeight), [trackHeight])

  // Measure the generated path, then drive dashoffset from scroll progress.
  const [pathLen, setPathLen] = useState(0)
  useLayoutEffect(() => {
    if (pathRef.current && snakePath) setPathLen(pathRef.current.getTotalLength())
  }, [snakePath])

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 0.75', 'end 0.55'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 24 })
  // Clamp so spring overshoot can never draw past the end and retract.
  const dashOffset = useTransform(smooth, (v) => pathLen * (1 - Math.min(1, Math.max(0, v))))

  return (
    <section id="journey" className="scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <SectionHeader eyebrow="CAMPAIGN MAP" title="The Journey" accent="cyan" />

        <WorldMap />

        <div ref={trackRef} className="relative">
          {/* Journey path column — fixed 80px wide, 1:1 units, no stretching */}
          {trackHeight > 0 && (
            <svg
              className="absolute left-5 top-0 -translate-x-1/2 md:left-1/2"
              width={80}
              height={trackHeight}
              viewBox={`0 0 80 ${trackHeight}`}
              fill="none"
              aria-hidden
            >
              <defs>
                <linearGradient
                  id="journey-grad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2={trackHeight}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
              {/* Faint dotted base */}
              <path
                d={snakePath}
                stroke="rgba(139,92,246,0.25)"
                strokeWidth="2"
                strokeDasharray="2 10"
                strokeLinecap="round"
              />
              {/* Glowing draw-on-scroll overlay */}
              <motion.path
                ref={pathRef}
                d={snakePath}
                stroke="url(#journey-grad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={pathLen || undefined}
                opacity={pathLen ? 1 : 0}
                style={{
                  strokeDashoffset: reduced ? 0 : dashOffset,
                  filter: 'drop-shadow(0 0 6px rgba(139,92,246,0.7))',
                }}
              />
            </svg>
          )}

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
