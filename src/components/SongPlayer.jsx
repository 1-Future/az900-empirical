import { useState, useRef, useEffect, useCallback } from 'react'

// ── Song data: just lyrics + hook + chord progression per topic ──
const songs = {
  'cloud-models': {
    chords: [0, 5, 7, 4],  // scale degrees for power chords
    key: 40, // E2 base
    bpm: 155,
    lyrics: [
      "Infrastructure — that's on you",
      "Platform hides the mess from view",
      "Software? Just log in and go",
      "IaaS, PaaS, SaaS — now you know",
    ],
    hook: "IaaS you build, PaaS you code, SaaS you use — that's the road",
  },
  'shared-responsibility': {
    chords: [0, 3, 5, 7],
    key: 38, // D2
    bpm: 145,
    lyrics: [
      "Data's always on your plate",
      "Accounts and access — don't be late",
      "Physical locks? That's Azure's game",
      "The middle shifts but top stays the same",
    ],
    hook: "Your data, your accounts — always. Their datacenter, their locks — always.",
  },
  'regions': {
    chords: [0, 5, 3, 7],
    key: 41, // F2
    bpm: 160,
    lyrics: [
      "Three zones minimum, standing tall",
      "Separate power so they don't all fall",
      "Paired regions catch you when one drops",
      "Sovereign clouds where gov data stops",
    ],
    hook: "3 zones, 1 pair, data stays where you declare",
  },
  'resource-hierarchy': {
    chords: [0, 7, 5, 3],
    key: 40,
    bpm: 150,
    lyrics: [
      "Management group at the top of the tree",
      "Subscriptions handle the billing for me",
      "Resource groups hold the things that I make",
      "Delete the group and everything breaks",
    ],
    hook: "MG > Sub > RG > Resource — policies flow down, always down",
  },
  'compute': {
    chords: [0, 5, 3, 7],
    key: 43, // G2
    bpm: 165,
    lyrics: [
      "VMs when you need the control",
      "Functions when events take their toll",
      "Containers package up your app",
      "App Service fills the PaaS gap",
    ],
    hook: "VM = you drive. Functions = autopilot. AKS = fleet manager.",
  },
  'networking': {
    chords: [0, 3, 5, 4],
    key: 38,
    bpm: 150,
    lyrics: [
      "NSG checks the port and IP",
      "Lowest priority's what it'll see",
      "ExpressRoute's a private line",
      "VPN goes through the web — that's fine",
    ],
    hook: "NSG = bouncer. ExpressRoute = private jet. VPN = encrypted cab.",
  },
  'storage': {
    chords: [0, 5, 7, 3],
    key: 41,
    bpm: 155,
    lyrics: [
      "Blobs for images, files to share",
      "Queues pass messages everywhere",
      "LRS cheap, GRS goes far",
      "Archive waits — that's where cold files are",
    ],
    hook: "Blob = bucket. Files = drive. Queue = mailbox. Table = spreadsheet.",
  },
  'identity': {
    chords: [0, 4, 5, 7],
    key: 39, // Eb2
    bpm: 145,
    lyrics: [
      "Entra ID is what they renamed",
      "Azure AD — same product, reframed",
      "MFA means two proofs to show",
      "Conditional Access says yes or no",
    ],
    hook: "Entra = cloud bouncer. MFA = two IDs at the door. SSO = one stamp, every bar.",
  },
  'rbac': {
    chords: [0, 5, 3, 7],
    key: 40,
    bpm: 160,
    lyrics: [
      "Owner does it all, assigns the roles",
      "Contributor builds but can't control",
      "Reader only gets to see",
      "Least privilege — that's the key",
    ],
    hook: "Owner = god mode. Contributor = builder. Reader = tourist.",
  },
  'cost': {
    chords: [0, 7, 5, 3],
    key: 43,
    bpm: 150,
    lyrics: [
      "CapEx buys it, OpEx rents",
      "Cloud shifts every single cent",
      "Reserve for one or three years deep",
      "Spot VMs are good but never keep",
    ],
    hook: "CapEx = buy the car. OpEx = Uber. Reserved = lease. Spot = hitchhike.",
  },
  'sla': {
    chords: [0, 3, 7, 5],
    key: 40,
    bpm: 155,
    lyrics: [
      "Ninety-nine point nine means eight hours down",
      "Four nines? Fifty-two minutes around",
      "Multiply services, composite drops",
      "Add redundancy and the uptime pops",
    ],
    hook: "More nines = less downtime. Chain = multiply down. Redundancy = raise it back.",
  },
  'governance': {
    chords: [0, 5, 4, 7],
    key: 38,
    bpm: 150,
    lyrics: [
      "Policy says what you can deploy",
      "Locks protect what you enjoy",
      "Tags are labels — track the cost",
      "Blueprints stamp so nothing's lost",
    ],
    hook: "Policy = rules. Locks = seatbelts. Tags = name tags. Blueprints = cookie cutter.",
  },
}

function midi(note) { return 440 * Math.pow(2, (note - 69) / 12) }

// ── Distortion curve for rock guitar ──
function makeDistortion(amount = 80) {
  const samples = 44100
  const curve = new Float32Array(samples)
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1
    curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x))
  }
  return curve
}

// ── Rock jingle engine ──
function playRockJingle(ctx, song, onEnd) {
  const beat = 60 / song.bpm
  const barLen = beat * 4  // 4 beats per bar
  const totalBars = 4      // one bar per lyric line
  const totalDur = totalBars * barLen

  // ── Master chain ──
  const master = ctx.createGain()
  master.gain.value = 0.6
  const compressor = ctx.createDynamicsCompressor()
  compressor.threshold.value = -20
  compressor.ratio.value = 8
  master.connect(compressor)
  compressor.connect(ctx.destination)

  const t0 = ctx.currentTime + 0.05

  // ── Distorted power chords (rhythm guitar) ──
  const distCurve = makeDistortion(100)
  song.chords.forEach((degree, bar) => {
    const root = song.key + degree
    // 8th note palm-muted chugs with chord hits on 1 and 3
    for (let eighth = 0; eighth < 8; eighth++) {
      const t = t0 + bar * barLen + eighth * (beat / 2)
      const isChordHit = eighth === 0 || eighth === 4

      const gain = ctx.createGain()
      const dist = ctx.createWaveShaper()
      dist.curve = distCurve
      dist.oversample = '4x'
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = isChordHit ? 3500 : 1800 // brighter on hits
      filter.Q.value = 1

      // Power chord: root + fifth + octave
      const notes = isChordHit ? [root, root + 7, root + 12] : [root]
      notes.forEach(n => {
        const osc = ctx.createOscillator()
        osc.type = 'sawtooth'
        osc.frequency.value = midi(n)
        // Slight detune on doubled notes for thickness
        if (notes.length > 1) osc.detune.value = (Math.random() - 0.5) * 15
        osc.connect(dist)
        osc.start(t)
        osc.stop(t + (isChordHit ? beat * 1.5 : beat * 0.4))
      })

      dist.connect(filter)
      filter.connect(gain)
      gain.connect(master)
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(isChordHit ? 0.35 : 0.15, t + 0.01)
      gain.gain.setValueAtTime(isChordHit ? 0.35 : 0.15, t + (isChordHit ? beat * 1 : beat * 0.25))
      gain.gain.exponentialRampToValueAtTime(0.001, t + (isChordHit ? beat * 1.5 : beat * 0.4))
    }
  })

  // ── Bass (follows chord roots, 8th note pattern) ──
  song.chords.forEach((degree, bar) => {
    const root = song.key - 12 + degree // one octave below
    for (let eighth = 0; eighth < 8; eighth++) {
      const t = t0 + bar * barLen + eighth * (beat / 2)
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()
      osc.type = 'sawtooth'
      osc.frequency.value = midi(root)
      filter.type = 'lowpass'
      filter.frequency.value = 400
      osc.connect(filter)
      filter.connect(gain)
      gain.connect(master)
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(eighth % 2 === 0 ? 0.3 : 0.15, t + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, t + beat * 0.45)
      osc.start(t)
      osc.stop(t + beat * 0.5)
    }
  })

  // ── Drums ──
  for (let bar = 0; bar < totalBars; bar++) {
    for (let b = 0; b < 4; b++) {
      const t = t0 + bar * barLen + b * beat

      // Kick on 1 and 3
      if (b === 0 || b === 2) {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(150, t)
        osc.frequency.exponentialRampToValueAtTime(35, t + 0.12)
        gain.gain.setValueAtTime(0.7, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
        osc.connect(gain)
        gain.connect(master)
        osc.start(t)
        osc.stop(t + 0.2)
      }

      // Snare on 2 and 4
      if (b === 1 || b === 3) {
        // Noise burst
        const bufLen = ctx.sampleRate * 0.1
        const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate)
        const data = buf.getChannelData(0)
        for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1
        const noise = ctx.createBufferSource()
        noise.buffer = buf
        const noiseFilter = ctx.createBiquadFilter()
        noiseFilter.type = 'highpass'
        noiseFilter.frequency.value = 1500
        const noiseGain = ctx.createGain()
        noiseGain.gain.setValueAtTime(0.5, t)
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1)
        noise.connect(noiseFilter)
        noiseFilter.connect(noiseGain)
        noiseGain.connect(master)
        noise.start(t)
        noise.stop(t + 0.1)
        // Body
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(200, t)
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.05)
        gain.gain.setValueAtTime(0.4, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
        osc.connect(gain)
        gain.connect(master)
        osc.start(t)
        osc.stop(t + 0.1)
      }

      // Hi-hat on every 8th note
      for (let e = 0; e < 2; e++) {
        const ht = t + e * (beat / 2)
        const bufLen = ctx.sampleRate * 0.04
        const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate)
        const data = buf.getChannelData(0)
        for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1
        const noise = ctx.createBufferSource()
        noise.buffer = buf
        const hpf = ctx.createBiquadFilter()
        hpf.type = 'highpass'
        hpf.frequency.value = 7000
        const gain = ctx.createGain()
        const isOpen = (b === 0 && e === 1) // open hat for flavor
        gain.gain.setValueAtTime(isOpen ? 0.15 : 0.1, ht)
        gain.gain.exponentialRampToValueAtTime(0.001, ht + (isOpen ? 0.06 : 0.03))
        noise.connect(hpf)
        hpf.connect(gain)
        gain.connect(master)
        noise.start(ht)
        noise.stop(ht + (isOpen ? 0.06 : 0.03))
      }
    }
  }

  // ── Lead melody (tapping-style clean tone over the top) ──
  const leadNotes = [
    [0, 4, 7, 12], [5, 9, 12, 7], [7, 11, 14, 12], [4, 7, 12, 9]
  ]
  song.chords.forEach((degree, bar) => {
    const pattern = leadNotes[bar % leadNotes.length]
    pattern.forEach((interval, i) => {
      const t = t0 + bar * barLen + i * beat
      const note = song.key + 24 + degree + interval // 2 octaves up
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.value = midi(note)
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.12, t + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.001, t + beat * 0.8)
      osc.connect(gain)
      gain.connect(master)
      osc.start(t)
      osc.stop(t + beat)
    })
  })

  return { t0, totalDur }
}

// ── MP3 support: drop files in public/songs/ to auto-upgrade ──
const songFiles = {
  'cloud-models': '01-cloud-models.mp3',
  'shared-responsibility': '02-shared-responsibility.mp3',
  'regions': '03-regions.mp3',
  'resource-hierarchy': '04-resource-hierarchy.mp3',
  'compute': '05-compute.mp3',
  'networking': '06-networking.mp3',
  'storage': '07-storage.mp3',
  'identity': '08-identity.mp3',
  'rbac': '09-rbac.mp3',
  'cost': '10-cost.mp3',
  'sla': '11-sla.mp3',
  'governance': '12-governance.mp3',
}

export function SongPlayer({ songId }) {
  const song = songs[songId]
  const [playing, setPlaying] = useState(false)
  const [currentLyric, setCurrentLyric] = useState(-1)
  const [progress, setProgress] = useState(0)
  const [hasMp3, setHasMp3] = useState(false)
  const ctxRef = useRef(null)
  const audioElRef = useRef(null)
  const animRef = useRef(null)
  const jingleRef = useRef(null)

  if (!song) return null

  const base = import.meta.env.BASE_URL || '/'
  const mp3Path = `${base}songs/${songFiles[songId]}`

  // Check for MP3 on mount
  useEffect(() => {
    if (songFiles[songId]) {
      fetch(mp3Path, { method: 'HEAD' }).then(r => setHasMp3(r.ok)).catch(() => {})
    }
  }, [songId])

  const beat = 60 / song.bpm
  const totalDur = beat * 4 * 4 // 4 bars

  const stop = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    if (audioElRef.current) { audioElRef.current.pause(); audioElRef.current = null }
    if (ctxRef.current) { ctxRef.current.close().catch(() => {}); ctxRef.current = null }
    setPlaying(false)
    setProgress(0)
    setCurrentLyric(-1)
  }, [])

  const animate = useCallback((getElapsed, dur) => {
    const tick = () => {
      const elapsed = getElapsed()
      if (elapsed < 0) { animRef.current = requestAnimationFrame(tick); return }
      setProgress(Math.min(elapsed / dur, 1))

      // Lyric per bar
      const barDur = dur / song.lyrics.length
      let idx = Math.floor(elapsed / barDur)
      if (idx >= song.lyrics.length) idx = song.lyrics.length - 1
      setCurrentLyric(idx)

      if (elapsed < dur) {
        animRef.current = requestAnimationFrame(tick)
      } else {
        setPlaying(false)
        setProgress(0)
        setCurrentLyric(-1)
      }
    }
    animRef.current = requestAnimationFrame(tick)
  }, [song.lyrics.length])

  const play = useCallback(() => {
    if (playing) { stop(); return }
    setPlaying(true)
    setCurrentLyric(-1)

    if (hasMp3) {
      const audio = new Audio(mp3Path)
      audioElRef.current = audio
      audio.play()
      audio.addEventListener('loadedmetadata', () => {
        animate(() => audio.currentTime, audio.duration)
      })
      audio.addEventListener('ended', stop)
    } else {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      ctxRef.current = ctx
      const { t0, totalDur: dur } = playRockJingle(ctx, song)
      animate(() => ctx.currentTime - t0, dur)
    }
  }, [playing, hasMp3, song, stop, animate])

  useEffect(() => () => stop(), [stop])

  return (
    <div className="bg-surface-2 rounded-lg overflow-hidden">
      <div className="h-1.5 bg-surface-3">
        <div className="h-full bg-azure transition-all duration-75" style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="p-5">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={play}
            className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all ${
              playing
                ? 'bg-danger hover:bg-danger/80 scale-95'
                : 'bg-azure hover:bg-azure-dark hover:scale-105'
            }`}>
            {playing ? (
              <svg width="18" height="18" viewBox="0 0 16 16" fill="white"><rect x="2" y="2" width="4" height="12" rx="1"/><rect x="10" y="2" width="4" height="12" rx="1"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 16 16" fill="white"><polygon points="4,1 14,8 4,15"/></svg>
            )}
          </button>
          <div>
            <div className="text-white font-medium">Concept Jingle</div>
            <div className="text-text-dim text-xs">
              {hasMp3 ? 'AI generated rock' : 'Rock riff — hit play, read along'}
            </div>
          </div>
        </div>

        {/* Karaoke lyrics */}
        <div className="space-y-1.5 mb-4">
          {song.lyrics.map((line, i) => (
            <div key={i} className={`text-sm px-3 py-1.5 rounded transition-all duration-200 ${
              i === currentLyric
                ? 'bg-azure/15 text-white font-semibold border-l-2 border-azure'
                : i < currentLyric
                  ? 'text-text-dim'
                  : 'text-text-dim/30'
            }`}>
              {line}
            </div>
          ))}
        </div>

        {/* Hook */}
        <div className="bg-azure/10 border border-azure/20 rounded-lg px-4 py-3">
          <div className="text-azure text-xs font-medium mb-1 uppercase tracking-wide">Hook — remember this</div>
          <div className="text-white text-sm font-medium">{song.hook}</div>
        </div>
      </div>
    </div>
  )
}
