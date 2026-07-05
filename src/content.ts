// ============================================================
// CONTENT SOURCE OF TRUTH — edit copy here, never in components.
// Facts sourced from the PORTFOLIO_HIGHLIGHTS docs (verified against
// code + git history). Don't invent metrics.
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
    'ships production SDKs',
    'tames WebRTC',
    'puts AI interpreters in live calls',
    'fixes the "unfixable"',
  ],
  subline:
    "Senior Android Developer · 4+ years · Real-time communication specialist (LiveKit, WebRTC, CallKit). I build the SDKs other companies embed — and hunt down the bugs everyone else gave up on.",
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
      { name: 'Flutter / Dart', level: 85, icon: devicon('flutter/flutter-original.svg') },
    ],
  },
  {
    title: 'Special Abilities',
    accent: 'cyan',
    skills: [
      { name: 'WebRTC / LiveKit', level: 92 },
      { name: 'CallKit & PushKit', level: 88, icon: devicon('swift/swift-original.svg') },
      { name: 'AI Meeting Agents / Live Translation', level: 82 },
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
      { name: 'Sentry / Datadog', level: 80 },
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
    body: 'Joined as SDE-2 / Senior Android Developer. Built a Zoom-class video conferencing & webinar platform on LiveKit as sole mobile engineer — native iOS Picture-in-Picture, ReplayKit screen share, host controls, live translation, recording. 570+ commits, 20+ store releases.',
    badge: 'CLASS UPGRADE: Real-time Comms Specialist',
  },
  {
    number: 4,
    name: 'Multiplayer Mode: The SDK Era',
    period: 'Nov 2024 – Present',
    location: '📍 BENGALURU',
    body: 'Became sole maintainer of Daakia\'s Flutter SDK suite: the video-conferencing SDK (v1.0 → v4.5.1 across 875+ commits and 15 releases), a CallKit/VoIP plugin that survives killed apps, and an AI note-taker with real-time speech-to-speech translation.',
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
  teaser: string // one-line hook shown on the card front
  fight: string
  winningMove: string
}

export const bosses: Boss[] = [
  {
    name: '"The Silent iOS Audio Killer"',
    difficulty: 5,
    teaser: 'iOS 16 ate the "interruption ended" signal — meetings stayed mute.',
    fight:
      'On iOS 16+, audio never recovered after a cellular call interrupted a video meeting — the system\'s "interruption ended" signal simply doesn\'t arrive reliably. Users sat in silent meetings.',
    winningMove:
      "Built a multi-source recovery system listening on three independent notification channels so no interruption end goes unnoticed. Contributed the fix upstream to LiveKit's open-source Flutter SDK.",
  },
  {
    name: '"The Webhook That Outlived Its App"',
    difficulty: 4,
    teaser: 'A killed iOS app still had to tell the backend "call declined."',
    fight:
      'Declining a call from the lock screen of a killed iOS app gives you seconds of runtime — an in-process HTTP request silently dies, and every other device keeps ringing.',
    winningMove:
      "Rebuilt delivery on a background URLSession: the request body is staged to a file, the upload handed to the system daemon nsurlsessiond, and the outcome recovered later — possibly in a freshly relaunched process — from the task's taskDescription.",
  },
  {
    name: '"The Android 16 Gauntlet"',
    difficulty: 4,
    teaser: 'One OS update, three foreground-service crashes in production.',
    fight:
      'Targeting Android 16 turned screen share into a crash factory: SecurityException from foreground-service type masks, a race on rapid share toggling, and an older camera-type crash — all one root cause.',
    winningMove:
      'Rebuilt the native meeting service to compute its foreground-service type bitmask per call from the permissions actually granted, and made mediaProjection type changes synchronous and idempotent. Shipped in v4.4.1.',
  },
  {
    name: '"The Secret Nobody Could Grep"',
    difficulty: 4,
    teaser: 'How do you ship secrets inside a package anyone can unzip?',
    fight:
      'A distributed SDK needs Sentry/Datadog credentials to report its own crashes — but any string shipped in a published package can be unzipped and grepped out in minutes.',
    winningMove:
      'Moved credential issuance server-side, keyed to each license: AES-256-GCM payloads decrypted client-side with an HKDF-derived key. The package itself never contains a usable secret.',
  },
  {
    name: '"The Timezone Hydra"',
    difficulty: 3,
    teaser: 'Cut off one timezone bug, two more grew back.',
    fight:
      "Every fix for event times left calendar sync an hour off — the server sends wall-clock time in the event's own timezone, and DateTime.timeZoneName doesn't map to an IANA identifier at all.",
    winningMove:
      'Standardized on the IANA timezone database via flutter_timezone and rebuilt calendar sync to construct TZDateTime from UTC epoch instead of trusting device-local wall-clock math. The third fix held.',
  },
  {
    name: '"The Ghost in the Caption Stream"',
    difficulty: 3,
    teaser: 'Live captions haunted by duplicate voices — only in production.',
    fight:
      'LiveKit can emit multiple concurrent transcription tracks (agent restarts, reconnects) and the UI rendered them all — duplicated, interleaved captions that never reproduced in a clean local demo.',
    winningMove:
      'Latched the first transcribed-track ID seen per session and silently dropped chunks from every other track — turning an ambiguous multi-source stream into a deterministic single source of truth.',
  },
]

// ---------- Section 5 — Inventory ----------
export type Rarity = 'LEGENDARY' | 'EPIC' | 'RARE'

export interface Project {
  rarity: Rarity
  name: string
  meta?: string // compact stats line under the name
  pitch: string
  highlights?: string[] // max 3 skimmable loot lines
  tags: string[]
  links: { label: string; href: string }[]
}

export const projects: Project[] = [
  {
    rarity: 'LEGENDARY',
    name: 'Daakia VC Flutter SDK',
    meta: '875+ commits · v1.0.0 → v4.5.1 · 15 releases · sole maintainer',
    pitch:
      'Production video-conferencing SDK other companies embed: prebuilt meeting UI, chat, live transcription & translation, annotations, native calling.',
    highlights: [
      'License-gated credential pipeline — per-tenant Sentry/Datadog secrets decrypted with AES-256-GCM + HKDF; nothing greppable ships in the package',
      'Cross-participant screen-share annotations that stay pixel-aligned while the video resizes mid-draw',
      'Android 10 → 16 foreground-service crash hardening with permission-aware type masks',
    ],
    tags: ['Flutter', 'LiveKit', 'WebRTC', 'AES-GCM', 'Sentry', 'Datadog'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Daakia-Org/daakia_vc_flutter_sdk' },
      { label: 'pub.dev', href: 'https://pub.dev/packages/daakia_vc_flutter_sdk' },
    ],
  },
  {
    rarity: 'LEGENDARY',
    name: 'Daakia CallKit Plugin',
    meta: 'v1.0.0 → v1.1.2 · sole author · iOS CallKit + Android FGS',
    pitch:
      'Flutter VoIP plugin that solves the hardest problem in mobile calling: the call event must reach the backend even when the app is suspended or killed.',
    highlights: [
      'Webhooks delivered from a dead iOS app — file-staged uploads handed to nsurlsessiond, recovered across process relaunch',
      'Dual-path (native + Dart) reporting that never double-fires and never silently drops — confirm-then-mark dedup on both platforms',
      'Fixed lock-screen accept failing on cold start by removing the Android service-to-activity trampoline',
    ],
    tags: ['Flutter', 'CallKit', 'PushKit', 'URLSession', 'Foreground Service'],
    links: [],
  },
  {
    rarity: 'EPIC',
    name: 'Daakia Note Taker SDK',
    meta: 'Real-time AI translation · LiveKit agents · sole author',
    pitch:
      'Meeting-recording SDK with a live AI interpreter: dispatches a speech-to-speech translation agent into the room so two people speaking different languages understand each other — face to face, in real time.',
    highlights: [
      'Agent lifecycle tracked by a defensive identity-heuristic state machine — LiveKit gives no join/fail signal',
      'Partial → final transcription state machine that auto-translates only finalized text',
      'Hand-rolled 60fps waveform envelope follower — no DSP library',
    ],
    tags: ['Flutter', 'LiveKit', 'AI Agents', 'Speech-to-Speech', 'Transcription'],
    links: [],
  },
  {
    rarity: 'EPIC',
    name: 'Daakia: Meeting & Webinar',
    meta: '570+ commits · 20+ store releases · sole engineer',
    pitch:
      'Zoom-class conferencing app on LiveKit — screen share, host controls, recording, live translation, scheduling.',
    highlights: [
      'Native iOS Picture-in-Picture: Flutter engine re-parented into AVPictureInPictureController so calls keep rendering in the background',
      'ReplayKit screen share streamed out of its sandboxed extension over a Unix-domain socket',
    ],
    tags: ['Flutter', 'Kotlin', 'Swift', 'LiveKit', 'AVKit', 'ReplayKit'],
    links: [
      { label: 'Android', href: 'https://play.google.com/store/apps/details?id=com.daakia.meeting' },
      { label: 'iOS', href: TODO_LINK },
    ],
  },
  {
    rarity: 'RARE',
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
    name: 'DailyBrief',
    line: 'Native Android practice — chained WorkManager sync (fetch → notify), Hilt assisted-injected workers, Clean Architecture.',
    year: '2025',
    tags: ['Kotlin', 'WorkManager', 'Hilt'],
  },
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
