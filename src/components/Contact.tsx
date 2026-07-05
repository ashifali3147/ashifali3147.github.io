import { motion, useReducedMotion } from 'framer-motion'
import { FileDown, Github, Linkedin, Mail } from 'lucide-react'
import { contact, site } from '../content'

export default function Contact() {
  const reduced = useReducedMotion()
  const resumeHref = `${import.meta.env.BASE_URL}resume.pdf`

  return (
    <section id="contact" className="scroll-mt-20 px-4 pb-10 pt-16 sm:px-6">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center text-center"
      >
        <h2 className="gradient-text font-display text-4xl font-bold tracking-tight sm:text-6xl">
          {contact.headline}
        </h2>
        <p className="mt-6 max-w-xl text-ink-muted">{contact.sub}</p>
        <p className="anim-blink mt-8 font-mono text-sm font-bold tracking-[0.35em] text-accent-amber">
          {contact.prompt}
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-2 rounded-lg bg-accent-violet-deep px-5 py-3 font-mono text-sm font-bold text-white transition-shadow hover:shadow-[0_0_28px_rgba(139,92,246,0.55)]"
          >
            <Mail className="h-4 w-4" aria-hidden /> {site.email}
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-accent-cyan/60 px-5 py-3 font-mono text-sm font-bold text-accent-cyan transition-colors hover:bg-accent-cyan/10"
          >
            <Linkedin className="h-4 w-4" aria-hidden /> LinkedIn
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-accent-cyan/60 px-5 py-3 font-mono text-sm font-bold text-accent-cyan transition-colors hover:bg-accent-cyan/10"
          >
            <Github className="h-4 w-4" aria-hidden /> GitHub
          </a>
          <a
            href={resumeHref}
            download
            className="inline-flex items-center gap-2 rounded-lg border border-accent-mint/60 px-5 py-3 font-mono text-sm font-bold text-accent-mint transition-colors hover:bg-accent-mint/10"
          >
            <FileDown className="h-4 w-4" aria-hidden /> Download Resume
          </a>
        </div>
      </motion.div>

      <footer className="mt-20 border-t border-white/5 pt-8 text-center">
        <p className="font-mono text-[11px] leading-relaxed text-ink-muted">{contact.footer}</p>
      </footer>
    </section>
  )
}
