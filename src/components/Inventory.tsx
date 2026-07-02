import { motion, useReducedMotion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import SectionHeader from './SectionHeader'
import { projects, type Rarity } from '../content'

const rarityStyles: Record<Rarity, { border: string; glow: string; label: string }> = {
  LEGENDARY: {
    border: 'border-accent-amber/50',
    glow: 'hover:shadow-[0_0_36px_rgba(251,191,36,0.25)]',
    label: 'text-accent-amber',
  },
  EPIC: {
    border: 'border-accent-violet/50',
    glow: 'hover:shadow-[0_0_36px_rgba(139,92,246,0.28)]',
    label: 'text-accent-violet-light',
  },
  RARE: {
    border: 'border-accent-cyan/50',
    glow: 'hover:shadow-[0_0_36px_rgba(34,211,238,0.22)]',
    label: 'text-accent-cyan',
  },
}

export default function Inventory() {
  const reduced = useReducedMotion()

  return (
    <section id="inventory" className="scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <SectionHeader eyebrow="EQUIPPED ITEMS" title="Inventory" accent="amber" />
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => {
            const style = rarityStyles[project.rarity]
            // Links marked TODO_* in content.ts are hidden until filled in.
            const liveLinks = project.links.filter((l) => l.href.startsWith('http'))
            return (
              <motion.article
                key={project.name}
                initial={reduced ? false : { opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: reduced ? 0 : (i % 2) * 0.12 }}
                whileHover={reduced ? undefined : { y: -5 }}
                className={`flex flex-col rounded-xl border bg-panel/80 p-6 transition-shadow ${style.border} ${style.glow}`}
              >
                <p className={`font-mono text-[10px] font-bold tracking-[0.3em] ${style.label}`}>
                  ⚔ {project.rarity}
                </p>
                <h3 className="mt-2 font-display text-xl font-bold text-ink">{project.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{project.pitch}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-ink-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {liveLinks.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-3 border-t border-white/5 pt-4">
                    {liveLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-1.5 font-mono text-xs font-medium ${style.label} transition-opacity hover:opacity-75`}
                      >
                        {link.label}
                        <ExternalLink className="h-3 w-3" aria-hidden />
                      </a>
                    ))}
                  </div>
                )}
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
