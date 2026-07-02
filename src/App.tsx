import { Suspense, lazy } from 'react'
import Starfield from './components/Starfield'
import HudNav from './components/HudNav'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Journey from './components/Journey'

// Below-the-fold sections are code-split so the first paint stays light.
const BossFights = lazy(() => import('./components/BossFights'))
const Inventory = lazy(() => import('./components/Inventory'))
const RareDrop = lazy(() => import('./components/RareDrop'))
const SideQuests = lazy(() => import('./components/SideQuests'))
const Contact = lazy(() => import('./components/Contact'))

export default function App() {
  return (
    <>
      <Starfield />
      <HudNav />
      <main>
        <Hero />
        <Stats />
        <Journey />
        <Suspense fallback={<div className="min-h-[60vh]" aria-hidden />}>
          <BossFights />
          <Inventory />
          <RareDrop />
          <SideQuests />
          <Contact />
        </Suspense>
      </main>
    </>
  )
}
