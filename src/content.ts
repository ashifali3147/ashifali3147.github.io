// ============================================================
// CONTENT SOURCE OF TRUTH — edit copy here, never in components.
// TODOs for Ashif:
//   - TODO_PR_LINK: paste the LiveKit PR URL
//   - TODO_LINK:    paste missing store links (iOS Daakia, Konnect)
//   - drop resume.pdf into public/
// ============================================================

export const TODO_PR_LINK = 'TODO_PR_LINK'
export const TODO_LINK = 'TODO_LINK'

export type Accent = 'violet' | 'cyan' | 'coral' | 'amber' | 'mint'

export const site = {
  name: 'ASHIF ALI',
  title: 'Ashif Ali — Android Developer | Real-time Comms Specialist',
  email: 'ashifali3147@gmail.com',
  github: 'https://github.com/ashifali3147',
  linkedin: 'https://www.linkedin.com/in/ashif-ali-b85b69215',
  nav: [
    { label: 'Journey', href: '#journey' },
    { label: 'Boss Fights', href: '#boss-fights' },
    { label: 'Projects', href: '#inventory' },
    { label: 'Contact', href: '#contact' },
  ],
}

// ---------- Section 1 — Hero ----------
export const hero = {
  eyebrow: 'PLAYER 1 — READY',
  headline: 'Ashif Ali',
  typewriter: [
    'builds Android apps',
    'tames WebRTC',
    'fixes the "unfixable"',
    'ships production SDKs',
  ],
  subline:
    "Senior Android Developer · 4+ years · Real-time communication specialist (LiveKit, WebRTC, CallKit). I don't just build features — I hunt down the bugs everyone else gave up on.",
  ctaPrimary: { label: '▶ Start Journey', href: '#journey' },
  ctaSecondary: { label: 'View GitHub', href: 'https://github.com/ashifali3147' },
  statCard: [
    { key: 'CLASS', value: 'Android Engineer' },
    { key: 'SPEC', value: 'Real-time Comms' },
    { key: 'LVL', value: 'Senior (SDE-2)' },
    { key: 'LOCATION', value: 'Bengaluru, IN' },
  ],
}

// ---------- Section 2 — Stats ----------
export interface Skill {
  name: string
  level: number
  icon?: string // devicon CDN url
}

const devicon = (path: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${path}`

export const skillCategories: {
  title: string
  accent: Accent
  skills: Skill[]
}[] = [
  {
    title: 'Core Weapons',
    accent: 'violet',
    skills: [
      { name: 'Kotlin', level: 95, icon: devicon('kotlin/kotlin-original.svg') },
      { name: 'Java', level: 90, icon: devicon('java/java-original.svg') },
      { name: 'Android SDK', level: 95, icon: devicon('android/android-original.svg') },
      { name: 'Flutter / Dart', level: 80, icon: devicon('flutter/flutter-original.svg') },
    ],
  },
  {
    title: 'Special Abilities',
    accent: 'cyan',
    skills: [
      { name: 'WebRTC / LiveKit', level: 92 },
      { name: 'CallKit & PushKit', level: 88, icon: devicon('swift/swift-original.svg') },
      { name: 'MVVM / Clean Architecture', level: 90 },
      { name: 'Coroutines', level: 88, icon: devicon('kotlin/kotlin-original.svg') },
    ],
  },
  {
    title: 'Support Gear',
    accent: 'mint',
    skills: [
      { name: 'Firebase', level: 85, icon: devicon('firebase/firebase-plain.svg') },
      { name: 'Retrofit / REST', level: 90 },
      { name: 'Room DB', level: 85, icon: devicon('android/android-original.svg') },
      { name: 'Git', level: 90, icon: devicon('git/git-original.svg') },
      { name: 'Hilt DI', level: 85 },
      { name: 'Sentry', level: 80 },
    ],
  },
]

export const skillInTraining = {
  label: '⚡ LEVELING UP — Jetpack Compose',
  caption: 'Active training arc · building ComposePlayground',
  level: 45,
  icon: devicon('jetpackcompose/jetpackcompose-original.svg'),
}

export const nextUnlocks = [
  { label: 'NEXT UNLOCK — Compose Multiplatform (CMP)', tooltip: 'Unlocks after Jetpack Compose mastery' },
  { label: 'NEXT UNLOCK — Kotlin Multiplatform (KMP)', tooltip: 'Unlocks after Jetpack Compose mastery' },
]

// ---------- Section 3 — The Journey ----------
export const worldMap = {
  waypoints: [
    { place: 'NALHATI, WB', role: 'SPAWN POINT', accent: 'amber' as Accent, x: 278, y: 213, pulse: false },
    { place: 'BARASAT, WB', role: 'TRAINING GROUNDS', accent: 'violet' as Accent, x: 289, y: 232, pulse: false },
    { place: 'KOLKATA, WB', role: 'FIRST GUILD', accent: 'cyan' as Accent, x: 282, y: 243, pulse: false },
    { place: 'BENGALURU, KA', role: 'CURRENT BASE', accent: 'mint' as Accent, x: 155, y: 385, pulse: true },
  ],
  statLine:
    'DISTANCE TRAVELED: ~1,900 KM · REGIONS UNLOCKED: 2 STATES · ZONE: TECH CAPITAL OF INDIA',
}

export interface Level {
  number: number
  name: string
  period: string
  location: string
  body: string
  badge: string
}

export const levels: Level[] = [
  {
    number: 1,
    name: 'Tutorial Zone: Self-Taught Origins',
    period: '2017–2021',
    location: '📍 NALHATI → BARASAT',
    body: 'Started in Nalhati, a small town in West Bengal. No mentor. No bootcamp. Just documentation, broken builds, and stubbornness. Completed BCA → MCA at Brainware University while teaching myself Android development from scratch.',
    badge: 'ACHIEVEMENT: Self-Taught +500 XP',
  },
  {
    number: 2,
    name: 'First Guild: eWards, Kolkata',
    period: 'Feb 2022 – Feb 2024',
    location: '📍 KOLKATA',
    body: 'Led end-to-end development of a white-label Android platform for F&B and retail brands — one codebase, many branded apps. Migrated legacy Java apps to Kotlin + MVVM, modernized to AndroidX, and shipped features across PING (Shiraz), Loop Insights, and SmartBillVerifier.',
    badge: 'UNLOCKED: Production Apps at Scale',
  },
  {
    number: 3,
    name: 'Level Up: Daakia, Bengaluru',
    period: 'Apr 2024 – Present',
    location: '📍 BENGALURU',
    body: 'Joined as SDE-2 / Senior Android Developer. Built a full video conferencing & webinar platform (think Zoom-class) on LiveKit — screen sharing, host controls, live translation, chat, recording.',
    badge: 'CLASS UPGRADE: Real-time Comms Specialist',
  },
  {
    number: 4,
    name: 'Multiplayer Mode: The SDK Era',
    period: 'Nov 2024 – Present',
    location: '📍 BENGALURU',
    body: 'Became core contributor to the daakia_vc_flutter_sdk — a production Flutter SDK other companies embed in their apps. Shipped v4.x releases: CallKit/PushKit calling, Sentry health monitoring, audio output switching, secure credential handling.',
    badge: 'RARE SKILL: SDK Author',
  },
  {
    number: 5,
    name: 'Open World: Open Source',
    period: '2025 – Present',
    location: '📍 EVERYWHERE',
    body: "Contributed a fix to LiveKit's Flutter SDK used by thousands of developers worldwide. (Full story in the Rare Drop section below.)",
    badge: 'LEGENDARY: Upstream Contributor',
  },
]

export const nextLevel = {
  label: 'NEXT LEVEL: ???',
  text: 'Currently accepting new quests.',
  href: '#contact',
}

// ---------- Section 4 — Boss Fights ----------
export interface Boss {
  name: string
  difficulty: number // out of 5
  fight: string
  winningMove: string
}

export const bosses: Boss[] = [
  {
    name: '"The Android 16 Crasher"',
    difficulty: 4,
    fight:
      'Screen sharing crashed on Android 16 devices in production. Users blocked, no obvious stack-trace culprit.',
    winningMove:
      'Traced it to the foreground service declaring microphone|camera service types alongside mediaProjection. Stripped the service down to mediaProjection only — crash eliminated, fix shipped in v4.4.1.',
  },
  {
    name: '"The Silent iOS Audio Killer"',
    difficulty: 5,
    fight:
      'On iOS 16+, audio never recovered after a cellular call interrupted a video meeting — the system\'s "interruption ended" signal simply doesn\'t arrive reliably. Users sat in silent meetings.',
    winningMove:
      "Built a multi-source recovery system listening on three independent notification channels so no interruption end goes unnoticed. Contributed the fix upstream to LiveKit's open-source Flutter SDK.",
  },
  {
    name: '"The Vanishing Webhook"',
    difficulty: 5,
    fight:
      'iOS terminated-state call events were unreliable — the OS gives apps only seconds of background execution, so client-side HTTPS calls silently died and call state desynced.',
    winningMove:
      'Redesigned the architecture to be server-authoritative — webhooks emitted from the signaling layer with a join-timeout fallback, mirroring how Agora and CometChat solve it. Client can die; the truth survives on the server.',
  },
  {
    name: '"The Doppelgänger"',
    difficulty: 3,
    fight:
      'Duplicate participant identities in LiveKit rooms caused ghost users and broken sessions.',
    winningMove:
      'Designed a server-side pre-join identity check pattern that blocks duplicates before they ever enter the room.',
  },
]

// ---------- Section 5 — Inventory ----------
export type Rarity = 'LEGENDARY' | 'EPIC' | 'RARE'

export interface Project {
  rarity: Rarity
  name: string
  pitch: string
  tags: string[]
  links: { label: string; href: string }[]
}

export const projects: Project[] = [
  {
    rarity: 'LEGENDARY',
    name: 'Daakia VC Flutter SDK',
    pitch:
      'A production video-conferencing SDK other companies embed: prebuilt meeting UI, chat, live transcription & translation, CallKit/PushKit native calling, Sentry health monitoring.',
    tags: ['Flutter', 'Dart', 'LiveKit', 'WebRTC', 'CallKit', 'PushKit', 'Sentry'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Daakia-Org/daakia_vc_flutter_sdk' },
      { label: 'pub.dev', href: 'https://pub.dev/packages/daakia_vc_flutter_sdk' },
    ],
  },
  {
    rarity: 'EPIC',
    name: 'Daakia: Meeting & Webinar',
    pitch:
      'Zoom-class conferencing app: screen share, host controls, recording, live translation, low-latency AV on LiveKit.',
    tags: ['Kotlin', 'Android', 'LiveKit', 'MVVM'],
    links: [
      { label: 'Android', href: 'https://play.google.com/store/apps/details?id=com.daakia.meeting' },
      { label: 'iOS', href: TODO_LINK },
    ],
  },
  {
    rarity: 'EPIC',
    name: 'Konnect: Chat, Call, Conference',
    pitch:
      'Cross-platform collaboration suite — chat, events, live translation. Leading Android performance overhaul + new UI.',
    tags: ['Android', 'Kotlin', 'Real-time'],
    links: [],
  },
  {
    rarity: 'RARE',
    name: 'eWards White-Label Platform',
    pitch:
      'One codebase → many branded F&B/retail apps. Led end-to-end development; Kotlin migration, AndroidX modernization, loyalty & insights features.',
    tags: ['Kotlin', 'Java', 'MVVM', 'White-label'],
    links: [],
  },
]

// ---------- Section 6 — Rare Drop ----------
export const rareDrop = {
  eyebrow: '★ RARE DROP ACQUIRED ★',
  title: 'Upstream Fix to LiveKit — used by thousands of developers',
  body: "Fixed iOS 16+ audio session recovery in LiveKit's open-source Flutter SDK (v2.4.1): after a cellular call interrupts a meeting, iOS's AVAudioSessionInterruptionTypeEnded never reliably fires — so audio stayed dead. My fix listens across three independent notification channels and exposes two new Flutter RoomEvents so every app on the SDK recovers gracefully.",
  chips: ['IMPACT: Global', 'TYPE: Core Audio', 'STATUS: Merged'],
  cta: { label: 'View the PR →', href: TODO_PR_LINK },
}

// ---------- Section 7 — Side Quests ----------
export const sideQuests = [
  {
    name: 'PING (Shiraz)',
    line: 'F&B app revamp — wishlist, dine-in, QR, analytics.',
    year: '2023',
    tags: ['Kotlin', 'F&B'],
  },
  {
    name: 'Loop Insights',
    line: 'Customer feedback & issue-resolution app.',
    year: '2022',
    tags: ['Android', 'MVVM'],
  },
  {
    name: 'eWards SmartBillVerifier',
    line: 'QR-based digital bill verification.',
    year: '2022',
    tags: ['Kotlin', 'QR'],
  },
]

// ---------- Section 8 — Contact ----------
export const contact = {
  headline: 'NEW QUEST AVAILABLE',
  sub: "Looking for an Android engineer who ships and fixes what others can't? Let's talk.",
  prompt: 'PRESS START ▸',
  footer:
    '© 2026 Ashif Ali · Crafted with caffeine and stubbornness · No bugs were spared in the making of this site',
}
