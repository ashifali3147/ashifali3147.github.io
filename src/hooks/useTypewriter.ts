import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

// Type → pause → delete → next phrase, forever.
// Under reduced motion, just shows the first phrase statically.
export function useTypewriter(
  phrases: string[],
  typeMs = 65,
  deleteMs = 35,
  pauseMs = 1500,
) {
  const [text, setText] = useState('')
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) {
      setText(phrases[0])
      return
    }
    let phraseIndex = 0
    let charCount = 0
    let deleting = false
    let timer: number

    const tick = () => {
      const phrase = phrases[phraseIndex]
      if (!deleting) {
        charCount++
        setText(phrase.slice(0, charCount))
        if (charCount === phrase.length) {
          deleting = true
          timer = window.setTimeout(tick, pauseMs)
        } else {
          timer = window.setTimeout(tick, typeMs)
        }
      } else {
        charCount--
        setText(phrase.slice(0, charCount))
        if (charCount === 0) {
          deleting = false
          phraseIndex = (phraseIndex + 1) % phrases.length
        }
        timer = window.setTimeout(tick, deleteMs)
      }
    }

    timer = window.setTimeout(tick, 400)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrases.join('|'), reduced, typeMs, deleteMs, pauseMs])

  return text
}
