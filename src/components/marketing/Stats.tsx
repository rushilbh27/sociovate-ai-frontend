const stats = [
  { value: "50+", label: "Businesses", color: "text-[#FF8811]" },
  { value: "1M+", label: "Calls Made", color: "text-[#9DD9D2]" },
  { value: "92%", label: "Connection Rate", color: "text-[#F4D06F]" },
  { value: "3×", label: "Team Efficiency", color: "text-[#FF8811]" },
]

export function Stats() {
  return (
    <section className="py-16 bg-white/50 border-y border-orange-100/60">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-orange-100/40">
          {stats.map((s) => (
            <div key={s.label} className="text-center px-4">
              <p className={`text-4xl md:text-5xl font-bold mb-1 ${s.color}`}>{s.value}</p>
              <p className="text-sm text-gray-400 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
