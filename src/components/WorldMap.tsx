import { Fragment, useLayoutEffect, useRef, useState } from 'react'
import { motion, useAnimationFrame, useInView, useReducedMotion } from 'framer-motion'
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

type Mode = 'TRAIN' | 'BUS' | 'FLIGHT'

// The three real-life legs of that route, each with its own transport mode.
// `ms` is the leg's share of the vehicle animation — the short train/bus hops
// get real screen time instead of flashing past at route-constant speed.
const LEGS: { d: string; mode: Mode; label: string; dash: string; ms: number }[] = [
  { d: 'M278 213 L289 232', mode: 'TRAIN', label: 'NALHATI → BARASAT', dash: '5 3', ms: 1700 },
  { d: 'M289 232 L282 243', mode: 'BUS', label: 'BARASAT → KOLKATA', dash: '1.5 4', ms: 1400 },
  { d: 'M282 243 C 255 297, 200 345, 155 385', mode: 'FLIGHT', label: 'KOLKATA → BENGALURU', dash: '6 6', ms: 2900 },
]
const TRAVEL_MS = LEGS.reduce((sum, leg) => sum + leg.ms, 0)
const PAUSE_MS = 2400
const ARRIVED_CAPTION = 'ARRIVED · BENGALURU — CURRENT BASE'
// Vehicle departs once the route reveal (2.5s) has finished drawing.
const START_DELAY_MS = 2700

// Not-yet-visited cities, dimmed like fog-of-war zones (same projection as
// the outline: x = 278 + Δlon·12, y = 213 − Δlat·15.2 from Nalhati).
const LOCKED_ZONES = [
  { name: 'DELHI', x: 151, y: 148 },
  { name: 'MUMBAI', x: 99, y: 292 },
  { name: 'HYDERABAD', x: 166, y: 318 },
  { name: 'CHENNAI', x: 187, y: 384 },
]

// On-map name offsets for the journey waypoints (legend carries the details).
const WP_LABELS: Record<string, { dx: number; dy: number; anchor?: 'end' }> = {
  'NALHATI, WB': { dx: 8, dy: -1 },
  'BARASAT, WB': { dx: 9, dy: 4 },
  'KOLKATA, WB': { dx: 8, dy: 11 },
  'BENGALURU, KA': { dx: -10, dy: 4, anchor: 'end' },
}

const MONO = '"JetBrains Mono", ui-monospace, monospace'

// Material Symbols "flight" silhouette (24×24, pointing up) — rotated along
// the route tangent so the plane always flies where it's headed.
const FLIGHT_ICON =
  'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z'

// Hand-drawn mini vehicle glyphs (currentColor on dark), centered at origin.
function VehicleGlyph({ mode }: { mode: Mode }) {
  if (mode === 'TRAIN')
    return (
      <g fill="currentColor">
        <path d="M0 -8.8 L0 -7.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <rect x="-5" y="-7.4" width="10" height="11.4" rx="2.5" />
        <rect x="-3.4" y="-5.4" width="6.8" height="4" rx="1" fill="#0B1026" />
        <circle cx="-2.6" cy="1.7" r="1.1" fill="#0B1026" />
        <circle cx="2.6" cy="1.7" r="1.1" fill="#0B1026" />
        <path
          d="M-4.6 4 L-6.2 6.6 M4.6 4 L6.2 6.6"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    )
  if (mode === 'BUS')
    return (
      <g fill="currentColor">
        <rect x="-5.5" y="-7" width="11" height="11.5" rx="2" />
        <rect x="-4" y="-5" width="8" height="4" rx="0.8" fill="#0B1026" />
        <circle cx="-3.2" cy="1.9" r="1" fill="#0B1026" />
        <circle cx="3.2" cy="1.9" r="1" fill="#0B1026" />
        <circle cx="-3.1" cy="6" r="1.7" />
        <circle cx="3.1" cy="6" r="1.7" />
      </g>
    )
  return (
    <g transform="scale(0.62) translate(-12 -12)">
      <path d={FLIGHT_ICON} fill="currentColor" />
    </g>
  )
}

export default function WorldMap() {
  const reduced = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const inView = useInView(panelRef, { once: true, amount: 0.3 })

  // Measure the route once, then reveal it with a dashoffset-animated mask —
  // keeps the dotted styling and works reliably on every mobile engine.
  const routeRef = useRef<SVGPathElement>(null)
  const legRefs = useRef<(SVGPathElement | null)[]>([])
  const legLens = useRef<number[]>([])
  const [routeLen, setRouteLen] = useState(0)
  useLayoutEffect(() => {
    legLens.current = legRefs.current.map((p) => p?.getTotalLength() ?? 0)
    if (routeRef.current) setRouteLen(routeRef.current.getTotalLength())
  }, [])

  const revealed = reduced || (inView && routeLen > 0)

  // Vehicle + caption are driven imperatively (no re-renders at 60fps):
  // travel the three legs on their own clocks, rest at Bengaluru, respawn.
  const vehicleRef = useRef<SVGGElement>(null)
  const modeRefs = useRef<Record<Mode, SVGGElement | null>>({
    TRAIN: null,
    BUS: null,
    FLIGHT: null,
  })
  const captionRef = useRef<HTMLParagraphElement>(null)
  const startRef = useRef<number | null>(null)

  useAnimationFrame((t) => {
    if (reduced || !revealed || !routeLen) return
    const vehicle = vehicleRef.current
    const route = routeRef.current
    if (!vehicle || !route) return

    if (startRef.current === null) startRef.current = t + START_DELAY_MS
    const elapsed = t - startRef.current
    if (elapsed < 0) return

    const local = elapsed % (TRAVEL_MS + PAUSE_MS)
    let dist = routeLen
    let mode: Mode = 'FLIGHT'
    let caption = ARRIVED_CAPTION
    if (local < TRAVEL_MS) {
      let msBefore = 0
      let k = 0
      while (k < LEGS.length - 1 && local >= msBefore + LEGS[k].ms) {
        msBefore += LEGS[k].ms
        k += 1
      }
      const frac = (local - msBefore) / LEGS[k].ms
      const lenBefore = legLens.current.slice(0, k).reduce((a, b) => a + b, 0)
      dist = Math.min(routeLen, lenBefore + frac * (legLens.current[k] ?? 0))
      mode = LEGS[k].mode
      caption = `${LEGS[k].mode} · ${LEGS[k].label}`
    }

    const pt = route.getPointAtLength(dist)
    vehicle.setAttribute('transform', `translate(${pt.x} ${pt.y})`)
    if (vehicle.style.opacity !== '1') vehicle.style.opacity = '1'

    // Show only the active vehicle; keep the plane nosed along its heading.
    for (const m of Object.keys(modeRefs.current) as Mode[]) {
      const g = modeRefs.current[m]
      if (g) g.style.display = m === mode ? '' : 'none'
    }
    if (mode === 'FLIGHT') {
      const ahead = route.getPointAtLength(Math.min(routeLen, dist + 2))
      const behind = route.getPointAtLength(Math.max(0, dist - 2))
      const angle = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI
      modeRefs.current.FLIGHT?.setAttribute('transform', `rotate(${angle + 90})`)
    }

    const cap = captionRef.current
    if (cap && cap.textContent !== caption) cap.textContent = caption
  })

  return (
    <div className="mx-auto mb-20 max-w-xl">
      <div ref={panelRef} className="relative overflow-hidden rounded-xl border border-white/10 bg-panel p-4">
        <div aria-hidden className="star-grid pointer-events-none absolute inset-0" />
        <p className="relative mb-2 text-center font-mono text-[10px] tracking-[0.3em] text-ink-muted">
          FAST TRAVEL — WORLD MAP
        </p>

        {/* Floating-island wrapper: gentle bob + perspective tilt on the map */}
        <motion.div
          className="relative"
          animate={reduced ? undefined : { y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
        >
          <svg
            viewBox="30 5 370 465"
            className="relative mx-auto max-h-[340px] w-full [transform:perspective(1100px)_rotateX(14deg)]"
            role="img"
            aria-label="Stylized map of India showing the journey from Nalhati to Barasat by train, Barasat to Kolkata by bus, and Kolkata to Bengaluru by flight"
          >
            <defs>
              <linearGradient id="route-grad" x1="278" y1="213" x2="155" y2="385" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
              <linearGradient id="land-grad" x1="0" y1="20" x2="0" y2="460" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(139,92,246,0.14)" />
                <stop offset="100%" stopColor="rgba(34,211,238,0.05)" />
              </linearGradient>
              <radialGradient id="island-shadow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="rgba(0,0,0,0.55)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </radialGradient>
              <clipPath id="india-clip">
                <path d={INDIA_OUTLINE} />
              </clipPath>
              <pattern id="map-dots" width="11" height="11" patternUnits="userSpaceOnUse">
                <circle cx="1.2" cy="1.2" r="0.9" fill="rgba(139,92,246,0.14)" />
              </pattern>
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

            {/* Ground shadow + extruded base plate → floating 3D island */}
            <ellipse cx="200" cy="452" rx="150" ry="16" fill="url(#island-shadow)" />
            <path d={INDIA_OUTLINE} transform="translate(0 7)" fill="#060A1E" stroke="rgba(139,92,246,0.22)" strokeWidth="1.5" strokeLinejoin="round" />

            {/* Landmass */}
            <path
              d={INDIA_OUTLINE}
              fill="url(#land-grad)"
              stroke="rgba(139,92,246,0.45)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            {/* Terrain texture + graticule, clipped to the landmass */}
            <g clipPath="url(#india-clip)" aria-hidden>
              <rect x="40" y="10" width="360" height="460" fill="url(#map-dots)" />
              {[110, 170, 230, 290, 350].map((x) => (
                <line key={`v${x}`} x1={x} y1="10" x2={x} y2="470" stroke="rgba(139,92,246,0.08)" strokeWidth="1" />
              ))}
              {[80, 150, 220, 290, 360, 430].map((y) => (
                <line key={`h${y}`} x1="40" y1={y} x2="400" y2={y} stroke="rgba(139,92,246,0.08)" strokeWidth="1" />
              ))}
            </g>

            {/* Compass rose */}
            <g transform="translate(372 52)" opacity="0.75" aria-hidden>
              <circle r="10" fill="none" stroke="rgba(148,163,184,0.35)" strokeWidth="1" />
              <path d="M0 -7 L2.6 4 L0 1.6 L-2.6 4 Z" fill="#22D3EE" />
              <text y="-15" textAnchor="middle" fontSize="9" fill="#94A3B8" fontFamily={MONO}>
                N
              </text>
            </g>

            {/* Fog-of-war zones — cities not yet unlocked */}
            {LOCKED_ZONES.map((z) => (
              <g key={z.name} opacity="0.55" aria-hidden>
                <circle cx={z.x} cy={z.y} r="2.5" fill="none" stroke="rgba(148,163,184,0.6)" strokeWidth="1" strokeDasharray="1.5 1.5" />
                <text x={z.x + 6} y={z.y + 2.5} fontSize="7.5" letterSpacing="1" fill="rgba(148,163,184,0.55)" fontFamily={MONO}>
                  {z.name}
                </text>
              </g>
            ))}

            {/* Invisible full route — measured for the reveal mask and sampled
                by the vehicle animation */}
            <path ref={routeRef} d={TRAVEL_ROUTE} fill="none" stroke="none" />

            {/* One dotted leg per transport mode, revealed by the animated mask */}
            {LEGS.map((leg, i) => (
              <path
                key={leg.mode}
                ref={(el) => {
                  legRefs.current[i] = el
                }}
                d={leg.d}
                fill="none"
                stroke="url(#route-grad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={leg.dash}
                mask="url(#route-mask)"
                opacity={reduced || routeLen ? 1 : 0}
                style={{ filter: 'drop-shadow(0 0 3px rgba(139,92,246,0.6))' }}
              />
            ))}

            {worldMap.waypoints.map((wp, i) => {
              const lbl = WP_LABELS[wp.place]
              const short = wp.place.split(',')[0]
              return (
                <g key={wp.place}>
                  {wp.pulse && !reduced && (
                    <circle cx={wp.x} cy={wp.y} r="6" fill="none" stroke={accentHex[wp.accent]} strokeWidth="1.5">
                      <animate attributeName="r" values="6;14" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <motion.g
                    initial={false}
                    animate={{ opacity: revealed ? 1 : 0 }}
                    transition={reduced ? { duration: 0 } : { delay: 0.3 + i * 0.55, duration: 0.35 }}
                  >
                    <circle cx={wp.x} cy={wp.y} r="5" fill={accentHex[wp.accent]} stroke="#0B1026" strokeWidth="1.5">
                      <title>{`${wp.place} — ${wp.role}`}</title>
                    </circle>
                    {lbl && (
                      <text
                        x={wp.x + lbl.dx}
                        y={wp.y + lbl.dy}
                        fontSize="8"
                        letterSpacing="1"
                        fontFamily={MONO}
                        fill={accentHex[wp.accent]}
                        textAnchor={lbl.anchor}
                        opacity="0.9"
                      >
                        {short}
                      </text>
                    )}
                  </motion.g>
                </g>
              )
            })}

            {/* Traveling vehicle badge — glyph swaps per leg, positioned each frame */}
            {!reduced && (
              <g
                ref={vehicleRef}
                style={{ opacity: 0, color: '#F1F5F9', filter: 'drop-shadow(0 0 5px rgba(34,211,238,0.8))' }}
                aria-hidden
              >
                <circle r="10" fill="#0B1026" stroke="url(#route-grad)" strokeWidth="1.5" />
                <g
                  ref={(el) => {
                    modeRefs.current.TRAIN = el
                  }}
                >
                  <VehicleGlyph mode="TRAIN" />
                </g>
                <g
                  ref={(el) => {
                    modeRefs.current.BUS = el
                  }}
                  style={{ display: 'none' }}
                >
                  <VehicleGlyph mode="BUS" />
                </g>
                <g
                  ref={(el) => {
                    modeRefs.current.FLIGHT = el
                  }}
                  style={{ display: 'none' }}
                >
                  <VehicleGlyph mode="FLIGHT" />
                </g>
              </g>
            )}
          </svg>
        </motion.div>

        {/* Live travel log — updated by the vehicle loop */}
        <p
          ref={captionRef}
          className="relative mt-2 h-4 text-center font-mono text-[10px] tracking-[0.25em] text-accent-cyan"
        >
          {reduced ? 'TRAIN + BUS + FLIGHT · NALHATI TO BENGALURU' : 'CALCULATING ROUTE…'}
        </p>

        {/* Waypoint legend with transport connectors (always visible) */}
        <ul className="relative mt-2 flex flex-wrap items-center justify-center gap-1.5">
          {worldMap.waypoints.map((wp, i) => (
            <Fragment key={wp.place}>
              <li className="rounded border border-white/5 bg-deep/50 px-2.5 py-1 text-center">
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
              {i < LEGS.length && (
                <li aria-hidden className="text-ink-muted" title={`${LEGS[i].mode}: ${LEGS[i].label}`}>
                  <svg width="16" height="16" viewBox="-11 -11 22 22" className="block">
                    <VehicleGlyph mode={LEGS[i].mode} />
                  </svg>
                </li>
              )}
            </Fragment>
          ))}
        </ul>
      </div>
      <p className="mt-3 text-center font-mono text-[10px] leading-relaxed tracking-wider text-ink-muted">
        {worldMap.statLine}
      </p>
    </div>
  )
}
