import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Check, Skull } from 'lucide-react'
import SectionHeader from './SectionHeader'
import { bosses, type Boss } from '../content'

function Stars({ count }: { count: number }) {
  return (
    <span className="font-mono text-sm tracking-widest" aria-label={`Difficulty ${count} out of 5`}>
      <span className="text-accent-amber">{'★'.repeat(count)}</span>
      <span className="text-white/20">{'★'.repeat(5 - count)}</span>
    </span>
  )
}

function BossCard({ boss }: { boss: Boss }) {
  const [flipped, setFlipped] = useState(false)
  const reduced = useReducedMotion()

  return (
    // Hover lives on this non-rotating wrapper: mid-flip the button's hit area
    // collapses to a sliver, so hover on the button itself cancels immediately.
    <div
      className="[perspective:1400px]"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setFlipped(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setFlipped(false)}
    >
      <motion.button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        className="relative block min-h-[340px] w-full text-left [transform-style:preserve-3d]"
        aria-expanded={flipped}
      >
        {/* Front */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl border border-accent-coral/30 bg-panel p-6 text-center [backface-visibility:hidden]">
          <Skull className="h-9 w-9 text-accent-coral" aria-hidden />
          <h3 className="font-display text-2xl font-bold text-ink">{boss.name}</h3>
          <div className="font-mono text-xs tracking-widest text-ink-muted">
            DIFFICULTY: <Stars count={boss.difficulty} />
          </div>
          <p className="max-w-[34ch] text-sm italic leading-relaxed text-ink-muted">
            {boss.teaser}
          </p>
          <span className="mt-1 font-mono text-[10px] tracking-[0.25em] text-accent-coral">
            HOVER / TAP TO FIGHT
          </span>
        </div>

        {/* Back */}
        <div className="absolute inset-0 flex flex-col rounded-xl border border-accent-coral/50 bg-panel p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <h3 className="font-display text-lg font-bold text-accent-coral">{boss.name}</h3>
          <p className="mt-2.5 text-[13px] leading-relaxed text-ink-muted">
            <span className="font-mono text-[10px] font-bold tracking-widest text-accent-coral">
              THE FIGHT ·{' '}
            </span>
            {boss.fight}
          </p>
          <p className="mt-2.5 text-[13px] leading-relaxed text-ink-muted">
            <span className="font-mono text-[10px] font-bold tracking-widest text-accent-cyan">
              THE WINNING MOVE ·{' '}
            </span>
            {boss.winningMove}
          </p>
          <span className="mt-auto inline-flex items-center gap-1.5 self-start rounded border border-accent-mint/50 bg-accent-mint/10 px-2.5 py-1 pt-1 font-mono text-xs font-bold tracking-widest text-accent-mint">
            <Check className="h-3.5 w-3.5" aria-hidden /> DEFEATED
          </span>
        </div>
      </motion.button>
    </div>
  )
}

export default function BossFights() {
  return (
    <section id="boss-fights" className="scroll-mt-20 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <SectionHeader eyebrow="LEGENDARY BUGS DEFEATED" title="Boss Fights" accent="coral" />
        <div className="grid gap-6 md:grid-cols-2">
          {bosses.map((boss) => (
            <BossCard key={boss.name} boss={boss} />
          ))}
        </div>
      </div>
    </section>
  )
}
