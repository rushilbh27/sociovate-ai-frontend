import { SpotlightCard } from "@/components/reactbits/SpotlightCard"

const testimonials = [
  {
    quote: "Sociovate AI replaced 5 telecallers for us. The AI handles 200+ calls daily with better conversion than our human team.",
    name: "Rahul Mehta",
    role: "Sales Head",
    company: "AutoHaus Motors",
    initial: "R",
    avatarBg: "bg-[#FF8811]/15 text-[#FF8811]",
  },
  {
    quote: "Setup took less than 2 days. Now our AI agent handles all inbound queries 24/7 and books appointments automatically.",
    name: "Priya Sharma",
    role: "Operations Manager",
    company: "MedConnect",
    initial: "P",
    avatarBg: "bg-[#9DD9D2]/30 text-[#5BBDB5]",
  },
  {
    quote: "The Hinglish conversations are incredibly natural. Our customers have no idea they're talking to AI. Game changer for follow-ups.",
    name: "Aditya Kulkarni",
    role: "Founder",
    company: "PropertyPro Realty",
    initial: "A",
    avatarBg: "bg-[#F4D06F]/30 text-[#C9A030]",
  },
]

export function Testimonials() {
  return (
    <section className="py-28 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-[#FF8811] uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Loved by{" "}
            <span className="font-script text-[#FF8811]" style={{ fontSize: "1.1em" }}>teams</span>
            {" "}across India
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <SpotlightCard
              key={t.name}
              className="bg-white rounded-2xl border border-orange-100 p-8 shadow-sm hover:shadow-xl hover:shadow-orange-200/25 hover:border-orange-200 transition-all duration-300 cursor-pointer group"
              spotlightColor="rgba(255, 136, 17, 0.06)"
            >
              <div className="text-5xl font-display text-[#FF8811]/20 leading-none mb-4 group-hover:text-[#FF8811]/35 transition-colors">"</div>
              <p className="text-gray-600 leading-relaxed mb-8 text-[15px]">{t.quote}</p>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${t.avatarBg} flex items-center justify-center text-sm font-semibold shrink-0`}>
                  {t.initial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}, {t.company}</p>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  )
}
