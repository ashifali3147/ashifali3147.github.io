import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from 'react'
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { Bus, Plane, TrainFront, type LucideIcon } from 'lucide-react'
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

const MODE_ICON: Record<Mode, LucideIcon> = { TRAIN: TrainFront, BUS: Bus, FLIGHT: Plane }

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
  'NALHATI, WB': { dx: 10, dy: -1 },
  'BARASAT, WB': { dx: 11, dy: 4 },
  'KOLKATA, WB': { dx: 10, dy: 12 },
  'BENGALURU, KA': { dx: -12, dy: 4, anchor: 'end' },
}

const MONO = '"JetBrains Mono", ui-monospace, monospace'
const VIEWBOX = '30 5 370 465'

// The scene is built from stacked SVG layers lifted to different translateZ
// heights inside one preserve-3d space — the route hovers above the landmass
// like a hologram, and mouse tilt makes the layers parallax apart.
const Z_LAND = 22
const Z_ROUTE = 40
const Z_SKY = 70

export default function WorldMap() {
  const reduced = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const inView = useInView(panelRef, { once: true, amount: 0.3 })

  // Interactive tilt: normalized cursor position drives spring-smoothed
  // rotation. At rest the scene sits at the isometric midpoint (26°, 0°).
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const spring = { stiffness: 110, damping: 16, mass: 0.4 }
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [34, 18]), spring)
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-11, 11]), spring)

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (reduced || e.pointerType === 'touch') return
    const r = panelRef.current?.getBoundingClientRect()
    if (!r) return
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  function onPointerLeave() {
    px.set(0)
    py.set(0)
  }

  // Gyroscope tilt for touch devices (WhatsApp-wallpaper style): device
  // orientation drives the same px/py springs the cursor uses on desktop.
  // The baseline drifts slowly toward the current reading, so however the
  // phone is held becomes "neutral" and tilting away from it moves the map.
  // 'ask' = iOS, which only exposes the sensor after a user-gesture prompt.
  // 'denied' = the prompt was refused or blocked — iOS also blocks the sensor
  // entirely (no prompt) on pages with certificate errors, e.g. self-signed
  // dev certs, so surface that instead of failing silently.
  const [gyro, setGyro] = useState<'none' | 'ask' | 'on' | 'denied'>('none')
  const gyroBase = useRef<{ beta: number; gamma: number } | null>(null)
  const detachRef = useRef<(() => void) | null>(null)
  const GYRO_RANGE = 16 // degrees of device tilt for full parallax

  const attachGyro = useCallback(() => {
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return
      const base = (gyroBase.current ??= { beta: e.beta, gamma: e.gamma })
      base.beta += (e.beta - base.beta) * 0.008
      base.gamma += (e.gamma - base.gamma) * 0.008
      py.set(Math.max(-0.5, Math.min(0.5, (e.beta - base.beta) / (GYRO_RANGE * 2))))
      px.set(Math.max(-0.5, Math.min(0.5, (e.gamma - base.gamma) / (GYRO_RANGE * 2))))
      setGyro('on')
    }
    window.addEventListener('deviceorientation', onOrient)
    const detach = () => window.removeEventListener('deviceorientation', onOrient)
    detachRef.current = detach
    return detach
  }, [px, py])

  useEffect(() => {
    if (reduced || typeof window === 'undefined') return
    if (!('DeviceOrientationEvent' in window)) return
    if (!window.matchMedia('(hover: none)').matches) return // touch devices only
    const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }
    if (typeof DOE.requestPermission === 'function') {
      setGyro('ask')
      return () => detachRef.current?.()
    }
    return attachGyro()
  }, [reduced, attachGyro])

  async function enableGyro() {
    try {
      const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }
      const res = await DOE.requestPermission?.()
      if (res === 'granted') attachGyro()
      else setGyro('denied')
    } catch {
      setGyro('denied')
    }
  }

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
  const trailRef = useRef<SVGPathElement>(null)
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

    // Solid energy trail fills in behind the vehicle over the dotted legs.
    trailRef.current?.setAttribute('stroke-dasharray', `${dist} 10000`)

    // Show only the active vehicle; keep the plane nosed along its heading.
    for (const m of Object.keys(modeRefs.current) as Mode[]) {
      const g = modeRefs.current[m]
      if (g) g.style.display = m === mode ? '' : 'none'
    }
    if (mode === 'FLIGHT') {
      const ahead = route.getPointAtLength(Math.min(routeLen, dist + 2))
      const behind = route.getPointAtLength(Math.max(0, dist - 2))
      const angle = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI
      // Lucide's plane glyph points north-east, i.e. 45° ahead of the tangent.
      modeRefs.current.FLIGHT?.setAttribute('transform', `rotate(${angle + 45})`)
    }

    const cap = captionRef.current
    if (cap && cap.textContent !== caption) cap.textContent = caption
  })

  return (
    <div className="mx-auto mb-20 max-w-xl">
      <div
        ref={panelRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="relative rounded-xl border border-white/10 bg-panel p-4"
      >
        <div aria-hidden className="star-grid pointer-events-none absolute inset-0 rounded-xl" />
        <p className="relative mb-2 text-center font-mono text-[10px] tracking-[0.3em] text-ink-muted">
          FAST TRAVEL — WORLD MAP
        </p>

        {/* Floating-island wrapper: gentle bob, then the interactive 3D scene */}
        <motion.div
          animate={reduced ? undefined : { y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
          style={{ perspective: 1200 }}
        >
          <motion.div
            role="img"
            aria-label="Stylized 3D map of India showing the journey from Nalhati to Barasat by train, Barasat to Kolkata by bus, and Kolkata to Bengaluru by flight"
            className="relative mx-auto aspect-[370/465] w-full max-w-[320px]"
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          >
            {/* ── Layer 0 · ground shadow + extruded island slab ── */}
            <svg viewBox={VIEWBOX} className="absolute inset-0 h-full w-full" aria-hidden>
              <defs>
                <radialGradient id="island-shadow" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="rgba(0,0,0,0.6)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </radialGradient>
              </defs>
              <ellipse cx="200" cy="452" rx="155" ry="17" fill="url(#island-shadow)" />
              <ellipse cx="200" cy="452" rx="130" ry="13" fill="none" stroke="rgba(34,211,238,0.12)" strokeWidth="1" />
              {[12, 9.6, 7.2, 4.8, 2.4].map((dy) => (
                <path
                  key={dy}
                  d={INDIA_OUTLINE}
                  transform={`translate(0 ${dy})`}
                  fill="#05091C"
                  stroke="rgba(139,92,246,0.18)"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              ))}
            </svg>

            {/* ── Layer 1 · landmass, terrain, fog-of-war ── */}
            <svg
              viewBox={VIEWBOX}
              className="absolute inset-0 h-full w-full"
              style={{ transform: `translateZ(${Z_LAND}px)` }}
              aria-hidden
            >
              <defs>
                <linearGradient id="land-grad" x1="0" y1="20" x2="0" y2="460" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="rgba(139,92,246,0.18)" />
                  <stop offset="100%" stopColor="rgba(34,211,238,0.06)" />
                </linearGradient>
                <clipPath id="india-clip">
                  <path d={INDIA_OUTLINE} />
                </clipPath>
                <pattern id="map-dots" width="11" height="11" patternUnits="userSpaceOnUse">
                  <circle cx="1.2" cy="1.2" r="0.9" fill="rgba(139,92,246,0.16)" />
                </pattern>
              </defs>

              <path
                d={INDIA_OUTLINE}
                fill="url(#land-grad)"
                stroke="rgba(139,92,246,0.55)"
                strokeWidth="1.5"
                strokeLinejoin="round"
                style={{ filter: 'drop-shadow(0 0 7px rgba(139,92,246,0.3))' }}
              />

              <g clipPath="url(#india-clip)">
                <rect x="40" y="10" width="360" height="460" fill="url(#map-dots)" />
                {[110, 170, 230, 290, 350].map((x) => (
                  <line key={`v${x}`} x1={x} y1="10" x2={x} y2="470" stroke="rgba(139,92,246,0.08)" strokeWidth="1" />
                ))}
                {[80, 150, 220, 290, 360, 430].map((y) => (
                  <line key={`h${y}`} x1="40" y1={y} x2="400" y2={y} stroke="rgba(139,92,246,0.08)" strokeWidth="1" />
                ))}
              </g>

              {/* Compass rose */}
              <g transform="translate(372 52)" opacity="0.75">
                <circle r="10" fill="none" stroke="rgba(148,163,184,0.35)" strokeWidth="1" />
                <path d="M0 -7 L2.6 4 L0 1.6 L-2.6 4 Z" fill="#22D3EE" />
                <text y="-15" textAnchor="middle" fontSize="9" fill="#94A3B8" fontFamily={MONO}>
                  N
                </text>
              </g>

              {/* Fog-of-war zones — cities not yet unlocked */}
              {LOCKED_ZONES.map((z) => (
                <g key={z.name} opacity="0.55">
                  <circle cx={z.x} cy={z.y} r="2.5" fill="none" stroke="rgba(148,163,184,0.6)" strokeWidth="1" strokeDasharray="1.5 1.5" />
                  <text x={z.x + 6} y={z.y + 2.5} fontSize="7.5" letterSpacing="1" fill="rgba(148,163,184,0.55)" fontFamily={MONO}>
                    {z.name}
                  </text>
                </g>
              ))}

              {/* Ground-contact shadows anchoring the floating waypoints above */}
              {worldMap.waypoints.map((wp) => (
                <g key={wp.place}>
                  <ellipse cx={wp.x} cy={wp.y} rx="4.5" ry="2" fill="rgba(0,0,0,0.55)" />
                  <circle cx={wp.x} cy={wp.y} r="1.6" fill={accentHex[wp.accent]} opacity="0.55" />
                </g>
              ))}
            </svg>

            {/* ── Layer 2 · holographic route, waypoints, vehicle ── */}
            <svg
              viewBox={VIEWBOX}
              className="absolute inset-0 h-full w-full"
              style={{ transform: `translateZ(${Z_ROUTE}px)` }}
              aria-hidden
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

              {/* Invisible full route — measured for the reveal mask and sampled
                  by the vehicle animation */}
              <path ref={routeRef} d={TRAVEL_ROUTE} fill="none" stroke="none" />

              {/* One dotted leg per transport mode, revealed by the animated
                  mask, with a slow marching-ants energy flow */}
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
                  className={reduced ? undefined : 'anim-dash-flow'}
                  style={{ filter: 'drop-shadow(0 0 3px rgba(139,92,246,0.6))' }}
                />
              ))}

              {/* Solid trail behind the vehicle — dasharray updated per frame */}
              {!reduced && (
                <path
                  ref={trailRef}
                  d={TRAVEL_ROUTE}
                  fill="none"
                  stroke="url(#route-grad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="0 10000"
                  opacity="0.9"
                  style={{ filter: 'drop-shadow(0 0 4px rgba(34,211,238,0.7))' }}
                />
              )}

              {worldMap.waypoints.map((wp, i) => {
                const lbl = WP_LABELS[wp.place]
                const short = wp.place.split(',')[0]
                const hex = accentHex[wp.accent]
                return (
                  <g key={wp.place}>
                    {wp.pulse && !reduced && (
                      <circle cx={wp.x} cy={wp.y} r="7" fill="none" stroke={hex} strokeWidth="1.5">
                        <animate attributeName="r" values="7;16" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.8;0" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <motion.g
                      initial={false}
                      animate={{ opacity: revealed ? 1 : 0 }}
                      transition={reduced ? { duration: 0 } : { delay: 0.3 + i * 0.55, duration: 0.35 }}
                    >
                      <circle cx={wp.x} cy={wp.y} r="9" fill={hex} opacity="0.18" />
                      <circle cx={wp.x} cy={wp.y} r="6.5" fill="#0B1026" stroke={hex} strokeWidth="1.5">
                        <title>{`${wp.place} — ${wp.role}`}</title>
                      </circle>
                      <circle cx={wp.x} cy={wp.y} r="4" fill={hex} />
                      <text
                        x={wp.x}
                        y={wp.y + 2}
                        fontSize="5.5"
                        fontWeight="bold"
                        textAnchor="middle"
                        fill="#0B1026"
                        fontFamily={MONO}
                      >
                        {i + 1}
                      </text>
                      {lbl && (
                        <text
                          x={wp.x + lbl.dx}
                          y={wp.y + lbl.dy}
                          fontSize="8.5"
                          letterSpacing="1"
                          fontFamily={MONO}
                          fill={hex}
                          textAnchor={lbl.anchor}
                          stroke="#0B1026"
                          strokeWidth="3"
                          paintOrder="stroke"
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
                >
                  <circle r="10" fill="#0B1026" stroke="url(#route-grad)" strokeWidth="1.5" />
                  <g
                    ref={(el) => {
                      modeRefs.current.TRAIN = el
                    }}
                  >
                    <TrainFront x={-7} y={-7} size={14} strokeWidth={2.2} />
                  </g>
                  <g
                    ref={(el) => {
                      modeRefs.current.BUS = el
                    }}
                    style={{ display: 'none' }}
                  >
                    <Bus x={-7} y={-7} size={14} strokeWidth={2.2} />
                  </g>
                  <g
                    ref={(el) => {
                      modeRefs.current.FLIGHT = el
                    }}
                    style={{ display: 'none' }}
                  >
                    <Plane x={-7} y={-7} size={14} strokeWidth={2.2} />
                  </g>
                </g>
              )}
            </svg>

            {/* ── Layer 3 · drifting clouds high above the island ── */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ transform: `translateZ(${Z_SKY}px)` }}
            >
              <motion.div
                className="absolute left-[8%] top-[26%] h-7 w-24 rounded-full"
                style={{ background: 'radial-gradient(ellipse, rgba(241,245,249,0.11), transparent 70%)', filter: 'blur(2px)' }}
                animate={reduced ? undefined : { x: [0, 30, 0] }}
                transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute right-[6%] top-[55%] h-6 w-20 rounded-full"
                style={{ background: 'radial-gradient(ellipse, rgba(241,245,249,0.09), transparent 70%)', filter: 'blur(2px)' }}
                animate={reduced ? undefined : { x: [0, -24, 0] }}
                transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Live travel log — updated by the vehicle loop */}
        <p
          ref={captionRef}
          className="relative mt-2 h-4 text-center font-mono text-[10px] tracking-[0.25em] text-accent-cyan"
        >
          {reduced ? 'TRAIN + BUS + FLIGHT · NALHATI TO BENGALURU' : 'CALCULATING ROUTE…'}
        </p>
        {!reduced && (
          <div className="relative text-center font-mono text-[8px] tracking-[0.3em] text-ink-muted/60">
            <p className="hidden [@media(hover:hover)]:block">✦ MOVE CURSOR TO TILT THE MAP ✦</p>
            {gyro === 'on' && <p className="[@media(hover:hover)]:hidden">✦ TILT YOUR PHONE TO MOVE THE MAP ✦</p>}
            {gyro === 'ask' && (
              <button
                type="button"
                onClick={enableGyro}
                className="mt-0.5 rounded border border-accent-cyan/40 px-2 py-1 tracking-[0.25em] text-accent-cyan [@media(hover:hover)]:hidden"
              >
                ◈ TAP TO ENABLE 3D TILT
              </button>
            )}
            {gyro === 'denied' && (
              <p className="text-amber-400/80 [@media(hover:hover)]:hidden">
                ⚠ MOTION ACCESS BLOCKED — ALLOW IT IN SETTINGS OR OPEN THE LIVE SITE
              </p>
            )}
          </div>
        )}

        {/* Waypoint legend with transport connectors (always visible) */}
        <ul className="relative mt-2 flex flex-wrap items-center justify-center gap-1.5">
          {worldMap.waypoints.map((wp, i) => {
            const Icon = i < LEGS.length ? MODE_ICON[LEGS[i].mode] : null
            return (
              <Fragment key={wp.place}>
                <li
                  className="rounded border border-white/5 border-l-2 bg-deep/50 px-2.5 py-1 text-center"
                  style={{ borderLeftColor: accentHex[wp.accent] }}
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
                {Icon && (
                  <li
                    aria-hidden
                    className="flex flex-col items-center text-ink-muted"
                    title={`${LEGS[i].mode}: ${LEGS[i].label}`}
                  >
                    <Icon size={13} strokeWidth={2} />
                    <span className="font-mono text-[6.5px] tracking-widest">{LEGS[i].mode}</span>
                  </li>
                )}
              </Fragment>
            )
          })}
        </ul>
      </div>
      <p className="mt-3 text-center font-mono text-[10px] leading-relaxed tracking-wider text-ink-muted">
        {worldMap.statLine}
      </p>
    </div>
  )
}
