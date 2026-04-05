"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Play, Pause } from "lucide-react"

const DEMO_SRC =
  "https://yzgdpmcjzuqbvjprffme.supabase.co/storage/v1/object/public/call-recordings/recordings/919823108893_2026-03-04_12-28-38.ogg"

const BAR_COUNT = 40

function fmt(s: number) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, "0")}`
}

type Speed = 1 | 1.5 | 2
const NEXT_SPEED: Record<Speed, Speed> = { 1: 1.5, 1.5: 2, 2: 1 }

export function Demo() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<Speed>(1)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  // Random but stable bar heights for the waveform visualization
  const [bars] = useState(() =>
    Array.from({ length: BAR_COUNT }, () => 0.15 + Math.random() * 0.85)
  )

  const togglePlay = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    if (playing) a.pause()
    else a.play()
    setPlaying(!playing)
  }, [playing])

  const cycleSpeed = useCallback(() => {
    const next = NEXT_SPEED[speed]
    setSpeed(next)
    if (audioRef.current) audioRef.current.playbackRate = next
  }, [speed])

  const seekBar = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const a = audioRef.current
      if (!a || !duration) return
      const rect = e.currentTarget.getBoundingClientRect()
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      a.currentTime = pct * duration
    },
    [duration]
  )

  // Keep progress in sync
  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onTime = () => {
      if (a.duration) {
        setProgress(a.currentTime / a.duration)
        setCurrent(a.currentTime)
      }
    }
    const onMeta = () => setDuration(a.duration)
    const onEnd = () => {
      setPlaying(false)
      setProgress(0)
      setCurrent(0)
    }
    a.addEventListener("timeupdate", onTime)
    a.addEventListener("loadedmetadata", onMeta)
    a.addEventListener("ended", onEnd)
    return () => {
      a.removeEventListener("timeupdate", onTime)
      a.removeEventListener("loadedmetadata", onMeta)
      a.removeEventListener("ended", onEnd)
    }
  }, [])

  return (
    <section id="demo" className="py-24 bg-gradient-to-b from-[#FFF8F0] via-[#FFF8F0] to-white/50">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs uppercase tracking-widest text-[#FF8811] font-semibold mb-3">
            Live Demo
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Hear our AI agent <span className="font-script text-[#FF8811]">in action</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Listen to a real call handled by our AI. No fluff, no scripts - just a natural
            conversation with a lead.
          </p>
        </div>

        {/* Player card */}
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-3xl border border-orange-100 shadow-xl shadow-orange-100/40 p-6 sm:p-8">
            <audio ref={audioRef} src={DEMO_SRC} preload="metadata" />

            {/* Top row: play + waveform + speed */}
            <div className="flex items-center gap-4">
              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-br from-[#FF8811] to-[#F4D06F] text-white flex items-center justify-center shadow-lg shadow-orange-200/50 hover:shadow-orange-300/60 transition-all active:scale-95"
              >
                {playing ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
              </button>

              {/* Waveform bars */}
              <div
                className="flex-1 flex items-end gap-[2px] h-12 cursor-pointer group"
                onClick={seekBar}
              >
                {bars.map((h, i) => {
                  const pct = i / BAR_COUNT
                  const played = pct < progress
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-colors ${
                        played ? "bg-[#FF8811]" : "bg-orange-200 group-hover:bg-orange-300"
                      }`}
                      style={{ height: `${h * 100}%`, minWidth: 2 }}
                    />
                  )
                })}
              </div>

              {/* Speed toggle */}
              <button
                onClick={cycleSpeed}
                className="shrink-0 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl px-3 py-2 transition-colors tabular-nums min-w-[3rem] text-center"
              >
                {speed}x
              </button>
            </div>

            {/* Time display */}
            <div className="flex justify-between mt-3 px-[4.5rem] text-xs text-gray-400 tabular-nums">
              <span>{fmt(currentTime)}</span>
              <span>{duration ? fmt(duration) : "-:--"}</span>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Real AI-to-human call recording. No editing applied.
          </p>
        </div>
      </div>
    </section>
  )
}
