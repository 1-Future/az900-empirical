import { useState, useRef, useEffect } from 'react'

// Math rock style: odd time, tapping patterns, major key with unexpected changes
// Kurt Travis vibe: melodic, slightly jazzy, catchy hooks over complex rhythm

const scales = {
  major: [0, 2, 4, 5, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],  // jazzy major feel
  lydian: [0, 2, 4, 6, 7, 9, 11],       // dreamy, math rock favorite
}

function buildMelody(pattern, baseNote = 60, scale = 'lydian') {
  const s = scales[scale]
  return pattern.map(p => ({
    note: baseNote + s[p.degree % s.length] + Math.floor(p.degree / s.length) * 12,
    duration: p.dur || 0.25,
    rest: p.rest || false,
  }))
}

// Each song has a melody pattern + lyrics synced to beats
const songs = {
  'cloud-models': {
    bpm: 155,
    scale: 'lydian',
    baseNote: 64,
    pattern: [
      { degree: 0, dur: 0.5 }, { degree: 2, dur: 0.25 }, { degree: 4, dur: 0.25 },
      { degree: 5, dur: 0.5 }, { degree: 4, dur: 0.25 }, { degree: 2, dur: 0.25 },
      { degree: 0, dur: 0.5 }, { degree: 7, dur: 0.25 }, { degree: 5, dur: 0.25 },
      { degree: 4, dur: 0.75 }, { degree: 2, dur: 0.25 },
      // repeat variation
      { degree: 0, dur: 0.5 }, { degree: 4, dur: 0.25 }, { degree: 5, dur: 0.25 },
      { degree: 7, dur: 0.5 }, { degree: 5, dur: 0.25 }, { degree: 4, dur: 0.25 },
      { degree: 9, dur: 0.5 }, { degree: 7, dur: 0.25 }, { degree: 5, dur: 0.25 },
      { degree: 4, dur: 0.5 }, { degree: 0, dur: 0.5 },
    ],
    lyrics: [
      { text: "Infrastructure — that's on you", time: 0 },
      { text: "Platform hides the mess from view", time: 2 },
      { text: "Software? Just log in and go", time: 4 },
      { text: "IaaS, PaaS, SaaS — now you know", time: 6 },
    ],
    hook: "IaaS you build, PaaS you code, SaaS you use — that's the road",
  },
  'shared-responsibility': {
    bpm: 145,
    scale: 'mixolydian',
    baseNote: 62,
    pattern: [
      { degree: 0, dur: 0.5 }, { degree: 3, dur: 0.25 }, { degree: 5, dur: 0.25 },
      { degree: 4, dur: 0.5 }, { degree: 2, dur: 0.5 },
      { degree: 0, dur: 0.25 }, { degree: 2, dur: 0.25 }, { degree: 4, dur: 0.25 }, { degree: 5, dur: 0.25 },
      { degree: 7, dur: 0.75 }, { degree: 5, dur: 0.25 },
      { degree: 4, dur: 0.5 }, { degree: 2, dur: 0.25 }, { degree: 0, dur: 0.25 },
      { degree: 2, dur: 0.5 }, { degree: 4, dur: 0.5 },
      { degree: 5, dur: 0.5 }, { degree: 7, dur: 0.25 }, { degree: 5, dur: 0.25 },
      { degree: 4, dur: 0.75 }, { degree: 0, dur: 0.25 },
    ],
    lyrics: [
      { text: "Data's always on your plate", time: 0 },
      { text: "Accounts and access — don't be late", time: 2 },
      { text: "Physical locks? That's Azure's game", time: 4 },
      { text: "The middle shifts but top stays the same", time: 6 },
    ],
    hook: "Your data, your accounts — always. Their datacenter, their locks — always.",
  },
  'regions': {
    bpm: 160,
    scale: 'lydian',
    baseNote: 65,
    pattern: [
      { degree: 0, dur: 0.25 }, { degree: 2, dur: 0.25 }, { degree: 4, dur: 0.25 }, { degree: 5, dur: 0.25 },
      { degree: 7, dur: 0.5 }, { degree: 5, dur: 0.5 },
      { degree: 4, dur: 0.25 }, { degree: 2, dur: 0.25 }, { degree: 0, dur: 0.25 }, { degree: 2, dur: 0.25 },
      { degree: 4, dur: 0.75 }, { degree: 5, dur: 0.25 },
      { degree: 7, dur: 0.5 }, { degree: 9, dur: 0.25 }, { degree: 7, dur: 0.25 },
      { degree: 5, dur: 0.5 }, { degree: 4, dur: 0.5 },
      { degree: 2, dur: 0.25 }, { degree: 4, dur: 0.25 }, { degree: 5, dur: 0.5 },
      { degree: 0, dur: 1 },
    ],
    lyrics: [
      { text: "Three zones minimum, standing tall", time: 0 },
      { text: "Separate power so they don't all fall", time: 2 },
      { text: "Paired regions catch you when one drops", time: 4 },
      { text: "Sovereign clouds where gov data stops", time: 6 },
    ],
    hook: "3 zones, 1 pair, data stays where you declare",
  },
  'resource-hierarchy': {
    bpm: 150,
    scale: 'major',
    baseNote: 60,
    pattern: [
      { degree: 7, dur: 0.5 }, { degree: 5, dur: 0.25 }, { degree: 4, dur: 0.25 },
      { degree: 2, dur: 0.5 }, { degree: 0, dur: 0.5 },
      { degree: 4, dur: 0.25 }, { degree: 5, dur: 0.25 }, { degree: 7, dur: 0.5 },
      { degree: 5, dur: 0.5 }, { degree: 4, dur: 0.5 },
      { degree: 7, dur: 0.5 }, { degree: 9, dur: 0.25 }, { degree: 7, dur: 0.25 },
      { degree: 5, dur: 0.5 }, { degree: 4, dur: 0.25 }, { degree: 2, dur: 0.25 },
      { degree: 0, dur: 0.5 }, { degree: 2, dur: 0.25 }, { degree: 4, dur: 0.25 },
      { degree: 5, dur: 0.75 }, { degree: 0, dur: 0.25 },
    ],
    lyrics: [
      { text: "Management group at the top of the tree", time: 0 },
      { text: "Subscriptions handle the billing for me", time: 2 },
      { text: "Resource groups hold the things that I make", time: 4 },
      { text: "Delete the group and everything breaks", time: 6 },
    ],
    hook: "MG > Sub > RG > Resource — policies flow down, always down",
  },
  'compute': {
    bpm: 165,
    scale: 'lydian',
    baseNote: 64,
    pattern: [
      { degree: 0, dur: 0.25 }, { degree: 4, dur: 0.25 }, { degree: 5, dur: 0.25 }, { degree: 7, dur: 0.25 },
      { degree: 5, dur: 0.5 }, { degree: 4, dur: 0.5 },
      { degree: 7, dur: 0.25 }, { degree: 5, dur: 0.25 }, { degree: 4, dur: 0.25 }, { degree: 2, dur: 0.25 },
      { degree: 0, dur: 0.75 }, { degree: 2, dur: 0.25 },
      { degree: 4, dur: 0.5 }, { degree: 7, dur: 0.25 }, { degree: 9, dur: 0.25 },
      { degree: 7, dur: 0.5 }, { degree: 5, dur: 0.25 }, { degree: 4, dur: 0.25 },
      { degree: 2, dur: 0.5 }, { degree: 0, dur: 0.5 },
    ],
    lyrics: [
      { text: "VMs when you need the control", time: 0 },
      { text: "Functions when events take their toll", time: 2 },
      { text: "Containers package up your app", time: 4 },
      { text: "App Service fills the PaaS gap", time: 6 },
    ],
    hook: "VM = you drive. Functions = autopilot. AKS = fleet manager.",
  },
  'networking': {
    bpm: 150,
    scale: 'mixolydian',
    baseNote: 62,
    pattern: [
      { degree: 0, dur: 0.5 }, { degree: 2, dur: 0.25 }, { degree: 4, dur: 0.25 },
      { degree: 5, dur: 0.5 }, { degree: 7, dur: 0.5 },
      { degree: 5, dur: 0.25 }, { degree: 4, dur: 0.25 }, { degree: 2, dur: 0.25 }, { degree: 0, dur: 0.25 },
      { degree: 2, dur: 0.75 }, { degree: 4, dur: 0.25 },
      { degree: 5, dur: 0.5 }, { degree: 7, dur: 0.25 }, { degree: 9, dur: 0.25 },
      { degree: 7, dur: 0.5 }, { degree: 5, dur: 0.25 }, { degree: 4, dur: 0.25 },
      { degree: 2, dur: 0.5 }, { degree: 0, dur: 0.5 },
    ],
    lyrics: [
      { text: "NSG checks the port and IP", time: 0 },
      { text: "Lowest priority's what it'll see", time: 2 },
      { text: "ExpressRoute's a private line", time: 4 },
      { text: "VPN goes through the web — that's fine", time: 6 },
    ],
    hook: "NSG = bouncer (IP + port). ExpressRoute = private jet. VPN = encrypted cab.",
  },
  'storage': {
    bpm: 155,
    scale: 'lydian',
    baseNote: 65,
    pattern: [
      { degree: 0, dur: 0.5 }, { degree: 2, dur: 0.25 }, { degree: 5, dur: 0.25 },
      { degree: 4, dur: 0.5 }, { degree: 7, dur: 0.5 },
      { degree: 5, dur: 0.25 }, { degree: 4, dur: 0.25 }, { degree: 2, dur: 0.5 },
      { degree: 0, dur: 0.5 }, { degree: 4, dur: 0.5 },
      { degree: 5, dur: 0.25 }, { degree: 7, dur: 0.25 }, { degree: 9, dur: 0.5 },
      { degree: 7, dur: 0.5 }, { degree: 5, dur: 0.25 }, { degree: 4, dur: 0.25 },
      { degree: 2, dur: 0.5 }, { degree: 0, dur: 0.5 },
    ],
    lyrics: [
      { text: "Blobs for images, files to share", time: 0 },
      { text: "Queues pass messages everywhere", time: 2 },
      { text: "LRS cheap, GRS goes far", time: 4 },
      { text: "Archive waits — that's where cold files are", time: 6 },
    ],
    hook: "Blob = bucket. Files = drive. Queue = mailbox. Table = spreadsheet.",
  },
  'identity': {
    bpm: 145,
    scale: 'mixolydian',
    baseNote: 63,
    pattern: [
      { degree: 0, dur: 0.5 }, { degree: 4, dur: 0.25 }, { degree: 5, dur: 0.25 },
      { degree: 7, dur: 0.75 }, { degree: 5, dur: 0.25 },
      { degree: 4, dur: 0.5 }, { degree: 2, dur: 0.25 }, { degree: 0, dur: 0.25 },
      { degree: 2, dur: 0.5 }, { degree: 4, dur: 0.5 },
      { degree: 5, dur: 0.5 }, { degree: 7, dur: 0.25 }, { degree: 9, dur: 0.25 },
      { degree: 7, dur: 0.5 }, { degree: 5, dur: 0.5 },
      { degree: 4, dur: 0.25 }, { degree: 2, dur: 0.25 }, { degree: 0, dur: 0.5 },
    ],
    lyrics: [
      { text: "Entra ID is what they renamed", time: 0 },
      { text: "Azure AD — same product, reframed", time: 2 },
      { text: "MFA means two proofs to show", time: 4 },
      { text: "Conditional Access says yes or no", time: 6 },
    ],
    hook: "Entra = cloud bouncer. MFA = two IDs at the door. SSO = one stamp, every bar.",
  },
  'rbac': {
    bpm: 160,
    scale: 'major',
    baseNote: 64,
    pattern: [
      { degree: 4, dur: 0.25 }, { degree: 5, dur: 0.25 }, { degree: 7, dur: 0.5 },
      { degree: 5, dur: 0.5 }, { degree: 4, dur: 0.5 },
      { degree: 2, dur: 0.25 }, { degree: 4, dur: 0.25 }, { degree: 5, dur: 0.5 },
      { degree: 0, dur: 0.75 }, { degree: 2, dur: 0.25 },
      { degree: 4, dur: 0.5 }, { degree: 5, dur: 0.25 }, { degree: 7, dur: 0.25 },
      { degree: 9, dur: 0.5 }, { degree: 7, dur: 0.25 }, { degree: 5, dur: 0.25 },
      { degree: 4, dur: 0.5 }, { degree: 0, dur: 0.5 },
    ],
    lyrics: [
      { text: "Owner does it all, assigns the roles", time: 0 },
      { text: "Contributor builds but can't control", time: 2 },
      { text: "Reader only gets to see", time: 4 },
      { text: "Least privilege — that's the key", time: 6 },
    ],
    hook: "Owner = god mode. Contributor = builder. Reader = tourist.",
  },
  'cost': {
    bpm: 150,
    scale: 'lydian',
    baseNote: 62,
    pattern: [
      { degree: 0, dur: 0.5 }, { degree: 2, dur: 0.25 }, { degree: 4, dur: 0.25 },
      { degree: 5, dur: 0.5 }, { degree: 4, dur: 0.25 }, { degree: 2, dur: 0.25 },
      { degree: 7, dur: 0.75 }, { degree: 5, dur: 0.25 },
      { degree: 4, dur: 0.5 }, { degree: 2, dur: 0.5 },
      { degree: 0, dur: 0.25 }, { degree: 4, dur: 0.25 }, { degree: 5, dur: 0.5 },
      { degree: 7, dur: 0.5 }, { degree: 5, dur: 0.25 }, { degree: 4, dur: 0.25 },
      { degree: 2, dur: 0.5 }, { degree: 0, dur: 0.5 },
    ],
    lyrics: [
      { text: "CapEx buys it, OpEx rents", time: 0 },
      { text: "Cloud shifts every single cent", time: 2 },
      { text: "Reserve for one or three years deep", time: 4 },
      { text: "Spot VMs are good but never keep", time: 6 },
    ],
    hook: "CapEx = buy the car. OpEx = take the Uber. Reserved = lease. Spot = hitchhike.",
  },
  'sla': {
    bpm: 155,
    scale: 'mixolydian',
    baseNote: 64,
    pattern: [
      { degree: 0, dur: 0.5 }, { degree: 5, dur: 0.25 }, { degree: 4, dur: 0.25 },
      { degree: 2, dur: 0.5 }, { degree: 4, dur: 0.5 },
      { degree: 5, dur: 0.25 }, { degree: 7, dur: 0.25 }, { degree: 5, dur: 0.5 },
      { degree: 4, dur: 0.75 }, { degree: 2, dur: 0.25 },
      { degree: 0, dur: 0.5 }, { degree: 4, dur: 0.25 }, { degree: 5, dur: 0.25 },
      { degree: 7, dur: 0.5 }, { degree: 5, dur: 0.25 }, { degree: 4, dur: 0.25 },
      { degree: 2, dur: 0.5 }, { degree: 0, dur: 0.5 },
    ],
    lyrics: [
      { text: "Ninety-nine point nine means eight hours down", time: 0 },
      { text: "Four nines? Fifty-two minutes around", time: 2 },
      { text: "Multiply services, composite drops", time: 4 },
      { text: "Add redundancy and the uptime pops", time: 6 },
    ],
    hook: "More nines = less downtime. Chain services = multiply (lower). Add redundancy = raise it back.",
  },
  'governance': {
    bpm: 150,
    scale: 'major',
    baseNote: 63,
    pattern: [
      { degree: 0, dur: 0.5 }, { degree: 2, dur: 0.25 }, { degree: 4, dur: 0.25 },
      { degree: 5, dur: 0.75 }, { degree: 4, dur: 0.25 },
      { degree: 2, dur: 0.5 }, { degree: 0, dur: 0.25 }, { degree: 2, dur: 0.25 },
      { degree: 4, dur: 0.5 }, { degree: 5, dur: 0.5 },
      { degree: 7, dur: 0.5 }, { degree: 5, dur: 0.25 }, { degree: 4, dur: 0.25 },
      { degree: 2, dur: 0.5 }, { degree: 4, dur: 0.5 },
      { degree: 5, dur: 0.5 }, { degree: 0, dur: 0.5 },
    ],
    lyrics: [
      { text: "Policy says what you can deploy", time: 0 },
      { text: "Locks protect what you enjoy", time: 2 },
      { text: "Tags are labels — track the cost", time: 4 },
      { text: "Blueprints stamp so nothing's lost", time: 6 },
    ],
    hook: "Policy = rules. Locks = seatbelts. Tags = name tags. Blueprints = cookie cutter.",
  },
}

function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

export function SongPlayer({ songId }) {
  const song = songs[songId]
  const [playing, setPlaying] = useState(false)
  const [currentLyric, setCurrentLyric] = useState(-1)
  const [progress, setProgress] = useState(0)
  const audioCtxRef = useRef(null)
  const animRef = useRef(null)
  const startTimeRef = useRef(0)
  const nodesRef = useRef([])

  if (!song) return null

  const totalDuration = song.lyrics.length > 0 ? (song.lyrics[song.lyrics.length - 1].time + 2) : 8
  const melody = buildMelody(song.pattern, song.baseNote, song.scale)

  const play = () => {
    if (playing) {
      stop()
      return
    }

    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    audioCtxRef.current = ctx

    // Master gain
    const master = ctx.createGain()
    master.gain.value = 0.15
    master.connect(ctx.destination)

    // Play melody with math-rock clean tone (slight chorus feel)
    let time = ctx.currentTime + 0.1
    const beatDur = 60 / song.bpm

    melody.forEach(note => {
      if (note.rest) {
        time += note.duration * beatDur
        return
      }

      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()

      // Clean tone + slight detune for math rock shimmer
      osc1.type = 'triangle'
      osc2.type = 'sine'
      osc1.frequency.value = midiToFreq(note.note)
      osc2.frequency.value = midiToFreq(note.note) * 1.002 // slight detune

      gain.gain.setValueAtTime(0, time)
      gain.gain.linearRampToValueAtTime(0.8, time + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.01, time + note.duration * beatDur * 0.9)

      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(master)

      osc1.start(time)
      osc1.stop(time + note.duration * beatDur)
      osc2.start(time)
      osc2.stop(time + note.duration * beatDur)

      nodesRef.current.push(osc1, osc2)
      time += note.duration * beatDur
    })

    // Simple kick pattern (math rock feel: emphasize odd beats)
    const kickTimes = []
    for (let i = 0; i < totalDuration / (beatDur * 2); i++) {
      kickTimes.push(ctx.currentTime + 0.1 + i * beatDur * 2)
      if (i % 2 === 0) kickTimes.push(ctx.currentTime + 0.1 + i * beatDur * 2 + beatDur * 1.5) // offbeat
    }
    kickTimes.forEach(t => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(120, t)
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.1)
      g.gain.setValueAtTime(0.4, t)
      g.gain.exponentialRampToValueAtTime(0.01, t + 0.15)
      osc.connect(g)
      g.connect(master)
      osc.start(t)
      osc.stop(t + 0.15)
      nodesRef.current.push(osc)
    })

    startTimeRef.current = ctx.currentTime
    setPlaying(true)
    setCurrentLyric(-1)

    // Animate
    const animate = () => {
      if (!audioCtxRef.current) return
      const elapsed = audioCtxRef.current.currentTime - startTimeRef.current
      setProgress(Math.min(elapsed / totalDuration, 1))

      // Find current lyric
      let lyricIdx = -1
      for (let i = song.lyrics.length - 1; i >= 0; i--) {
        if (elapsed >= song.lyrics[i].time) {
          lyricIdx = i
          break
        }
      }
      setCurrentLyric(lyricIdx)

      if (elapsed < totalDuration) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        setPlaying(false)
        setProgress(0)
        setCurrentLyric(-1)
      }
    }
    animRef.current = requestAnimationFrame(animate)
  }

  const stop = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    nodesRef.current.forEach(n => { try { n.stop() } catch {} })
    nodesRef.current = []
    if (audioCtxRef.current) {
      audioCtxRef.current.close()
      audioCtxRef.current = null
    }
    setPlaying(false)
    setProgress(0)
    setCurrentLyric(-1)
  }

  useEffect(() => () => stop(), [])

  return (
    <div className="bg-surface-2 rounded-lg overflow-hidden">
      {/* Waveform bar */}
      <div className="h-1 bg-surface-3">
        <div className="h-full bg-azure transition-all duration-100" style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="p-5">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={play}
            className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
              playing ? 'bg-danger hover:bg-danger/80' : 'bg-azure hover:bg-azure-dark'
            }`}>
            {playing ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><rect x="2" y="2" width="4" height="12" rx="1"/><rect x="10" y="2" width="4" height="12" rx="1"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><polygon points="3,1 14,8 3,15"/></svg>
            )}
          </button>
          <div>
            <div className="text-white font-medium text-sm">Concept Chorus</div>
            <div className="text-text-dim text-xs">Math rock mnemonic — listen, then demo</div>
          </div>
        </div>

        {/* Lyrics display */}
        <div className="space-y-2 mb-4">
          {song.lyrics.map((l, i) => (
            <div key={i} className={`text-sm transition-all duration-300 ${
              i === currentLyric ? 'text-white font-medium scale-[1.02] origin-left' :
              i < currentLyric ? 'text-text-dim' : 'text-text-dim/40'
            }`}>
              {l.text}
            </div>
          ))}
        </div>

        {/* Hook (always visible) */}
        <div className="bg-azure/10 border border-azure/20 rounded-lg px-4 py-3">
          <div className="text-azure text-xs font-medium mb-1 uppercase tracking-wide">Hook</div>
          <div className="text-white text-sm font-medium">{song.hook}</div>
        </div>
      </div>
    </div>
  )
}
