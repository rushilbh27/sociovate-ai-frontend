import { Quote } from "lucide-react"

const testimonials = [
  {
    quote: "Sociovate AI replaced 5 telecallers for us. The AI handles 200+ calls daily with better conversion than our human team.",
    name: "Rahul Mehta",
    role: "Sales Head, AutoHaus Motors",
  },
  {
    quote: "Setup took less than 2 days. Now our AI agent handles all inbound queries 24/7 and books appointments automatically.",
    name: "Priya Sharma",
    role: "Operations Manager, MedConnect",
  },
  {
    quote: "The Hinglish conversations are incredibly natural. Our customers have no idea they're talking to AI. Game changer for follow-ups.",
    name: "Aditya Kulkarni",
    role: "Founder, PropertyPro Realty",
  },
]

export function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Loved by{" "}
            <span className="font-display italic text-brand">teams</span>{" "}
            across India
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <Quote size={24} className="text-brand/30 mb-4" />
              <p className="text-gray-600 leading-relaxed mb-6">{t.quote}</p>
              <div>
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
