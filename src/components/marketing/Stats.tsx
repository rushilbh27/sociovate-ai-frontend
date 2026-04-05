const stats = [
  { value: "50+", label: "Businesses" },
  { value: "1M+", label: "Calls Made" },
  { value: "92%", label: "Connection Rate" },
  { value: "3x", label: "Team Efficiency" },
]

export function Stats() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl md:text-5xl font-bold gradient-text mb-1">{s.value}</p>
              <p className="text-sm text-gray-500 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
