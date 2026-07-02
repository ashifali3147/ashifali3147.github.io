import { motion, useReducedMotion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import { sideQuests } from '../content'

export default function SideQuests() {
  const reduced = useReducedMotion()

  return (
    <section id="side-quests" className="scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <SectionHeader eyebrow="OPTIONAL OBJECTIVES" title="Side Quests" accent="mint" />
        <div className="grid gap-4 sm:grid-cols-3">
          {sideQuests.map((quest, i) => (
            <motion.article
              key={quest.name}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: reduced ? 0 : i * 0.1 }}
              className="rounded-lg border border-accent-mint/20 bg-panel/60 p-5"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-display text-sm font-bold text-ink">{quest.name}</h3>
                <span className="font-mono text-[10px] text-accent-mint">{quest.year}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">{quest.line}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {quest.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-white/5 bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-ink-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
