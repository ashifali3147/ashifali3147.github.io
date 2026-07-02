// CSS-only decorative background: faint grid + two twinkling star layers.
// Stars are a single div with many box-shadows — cheap to paint, zero JS after mount.

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function makeStars(count: number, seed: number): string {
  const rand = seededRandom(seed)
  const shadows: string[] = []
  for (let i = 0; i < count; i++) {
    shadows.push(`${(rand() * 100).toFixed(1)}vw ${(rand() * 100).toFixed(1)}vh 0 currentColor`)
  }
  return shadows.join(', ')
}

const STARS_SMALL = makeStars(70, 7)
const STARS_BIG = makeStars(30, 42)

export default function Starfield() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div className="star-grid absolute inset-0" />
      <div
        className="star-dot anim-twinkle text-slate-400/60"
        style={{ width: 1, height: 1, boxShadow: STARS_SMALL }}
      />
      <div
        className="star-dot anim-twinkle-slow text-slate-300/70"
        style={{ width: 2, height: 2, boxShadow: STARS_BIG }}
      />
    </div>
  )
}
