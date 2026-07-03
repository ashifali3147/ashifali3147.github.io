import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { worldMap, type Accent } from '../content'

const accentHex: Record<Accent, string> = {
  violet: '#8B5CF6',
  cyan: '#22D3EE',
  coral: '#FB7185',
  amber: '#FBBF24',
  mint: '#34D399',
}

// Stylized low-poly India silhouette. Vertices are real landmarks projected
// from lat/lon (12 px/°lon, 15.2 px/°lat) — recognizable shape, game-map detail.
const INDIA_OUTLINE = `
  M148 20
  L112 50 L105 80 L112 111
  L88 140 L64 172 L46 222 L64 236 L56 251 L82 268 L98 262
  L98 294 L112 350 L122 386 L154 459
  L188 383 L208 332 L244 288 L280 254
  L281 218 L285 185
  L330 178 L382 158 L388 172
  L350 212 L340 243 L322 205 L300 192
  L250 168 L205 142 L175 115
  L160 95 L155 55 Z
`

// Travel route through the four waypoints (Nalhati → Barasat → Kolkata → Bengaluru).
const TRAVEL_ROUTE = 'M278 213 L289 232 L282 243 C 255 297, 200 345, 155 385'

export default function WorldMap() {
  const reduced = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const inView = useInView(panelRef, { once: true, amount: 0.3 })

  // Measure the route once, then reveal it with a dashoffset-animated mask —
  // keeps the dotted styling and works reliably on every mobile engine.
  const routeRef = useRef<SVGPathElement>(null)
  const [routeLen, setRouteLen] = useState(0)
  useLayoutEffect(() => {
    if (routeRef.current) setRouteLen(routeRef.current.getTotalLength())
  }, [])

  const revealed = reduced || (inView && routeLen > 0)

  return (
    <div className="mx-auto mb-20 max-w-xl">
      <div ref={panelRef} className="relative overflow-hidden rounded-xl border border-white/10 bg-panel p-4">
        <div aria-hidden className="star-grid pointer-events-none absolute inset-0" />
        <p className="relative mb-2 text-center font-mono text-[10px] tracking-[0.3em] text-ink-muted">
          FAST TRAVEL — WORLD MAP
        </p>
        <svg
          viewBox="30 5 370 465"
          className="relative mx-auto max-h-[340px] w-full"
          role="img"
          aria-label="Stylized map of India showing the journey from Nalhati to Barasat to Kolkata to Bengaluru"
        >
          <defs>
            <linearGradient id="route-grad" x1="278" y1="213" x2="155" y2="385" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
            <mask id="route-mask" maskUnits="userSpaceOnUse">
              <motion.path
                d={TRAVEL_ROUTE}
                fill="none"
                stroke="#fff"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={routeLen || 1}
                initial={false}
                animate={{ strokeDashoffset: revealed ? 0 : routeLen || 1 }}
                transition={reduced ? { duration: 0 } : { duration: 2.5, ease: 'easeInOut' }}
              />
            </mask>
          </defs>

          <path
            d={INDIA_OUTLINE}
            fill="rgba(139,92,246,0.06)"
            stroke="rgba(139,92,246,0.35)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Dotted travel line, revealed by the animated mask */}
          <path
            ref={routeRef}
            d={TRAVEL_ROUTE}
            fill="none"
            stroke="url(#route-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="6 6"
            mask="url(#route-mask)"
            opacity={reduced || routeLen ? 1 : 0}
          />

          {worldMap.waypoints.map((wp, i) => (
            <g key={wp.place}>
              {wp.pulse && !reduced && (
                <circle cx={wp.x} cy={wp.y} r="6" fill="none" stroke={accentHex[wp.accent]} strokeWidth="1.5">
                  <animate attributeName="r" values="6;14" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <motion.circle
                cx={wp.x}
                cy={wp.y}
                r="5"
                fill={accentHex[wp.accent]}
                stroke="#0B1026"
                strokeWidth="1.5"
                initial={false}
                animate={{ opacity: revealed ? 1 : 0 }}
                transition={
                  reduced ? { duration: 0 } : { delay: 0.3 + i * 0.55, duration: 0.35 }
                }
              >
                <title>{`${wp.place} — ${wp.role}`}</title>
              </motion.circle>
            </g>
          ))}
        </svg>

        {/* Waypoint legend (always visible; tooltips are a desktop bonus) */}
        <ul className="relative mt-3 flex flex-wrap justify-center gap-1.5">
          {worldMap.waypoints.map((wp) => (
            <li
              key={wp.place}
              className="rounded border border-white/5 bg-deep/50 px-2.5 py-1 text-center"
            >
              <p
                className="whitespace-nowrap font-mono text-[9px] font-bold tracking-wider"
                style={{ color: accentHex[wp.accent] }}
              >
                📍 {wp.place}
              </p>
              <p className="whitespace-nowrap font-mono text-[8px] tracking-widest text-ink-muted">
                {wp.role}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-3 text-center font-mono text-[10px] leading-relaxed tracking-wider text-ink-muted">
        {worldMap.statLine}
      </p>
    </div>
  )
}
