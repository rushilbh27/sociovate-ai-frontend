import {
  Phone,
  BarChart3,
  Calendar,
  Globe,
  MessageSquare,
  Shield,
} from "lucide-react"

const features = [
  {
    icon: Phone,
    title: "Outbound Campaigns",
    description:
      "Upload your leads, set a script, and launch. Our AI calls hundreds of people automatically with human-like conversations.",
  },
  {
    icon: MessageSquare,
    title: "Inbound Handling",
    description:
      "24/7 AI receptionist that answers calls, resolves queries from your knowledge base, and books appointments instantly.",
  },
  {
    icon: Calendar,
    title: "Smart Booking",
    description:
      "Integrated calendar system. AI checks availability, proposes slots, and confirms bookings — all in the same call.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description:
      "Live dashboards with call transcripts, sentiment analysis, lead scoring, and conversion tracking across all campaigns.",
  },
  {
    icon: Globe,
    title: "Multilingual Hinglish",
    description:
      "Natural Hinglish conversations that feel real. Hindi, English, or a mix — our AI adapts to how your customers speak.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Encrypted calls, tenant isolation, role-based access, and full audit logs. Your data stays yours.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything you need to{" "}
            <span className="font-display italic text-brand">automate</span> calls
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            From first contact to closed deal — our AI handles the entire calling workflow.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="group p-8 rounded-2xl border border-gray-100 hover:border-brand/20 hover:shadow-xl hover:shadow-brand/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-5 group-hover:bg-brand group-hover:text-white transition-colors">
                <f.icon size={24} className="text-brand group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
