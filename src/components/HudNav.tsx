import { Gamepad2, Github, Linkedin } from 'lucide-react'
import { site } from '../content'

export default function HudNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-deep/70 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a
          href="#top"
          className="flex items-center gap-2 font-mono text-sm font-bold tracking-widest text-ink transition-colors hover:text-accent-violet"
        >
          <Gamepad2 className="h-5 w-5 text-accent-violet" aria-hidden />
          {site.name}
        </a>
        <div className="flex items-center gap-4 sm:gap-6">
          <ul className="hidden items-center gap-6 md:flex">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group relative font-mono text-xs tracking-wider text-ink-muted transition-colors hover:text-ink"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent-cyan transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-ink-muted transition-colors hover:text-accent-cyan"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-ink-muted transition-colors hover:text-accent-cyan"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
}
