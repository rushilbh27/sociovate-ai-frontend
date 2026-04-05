import { Upload, Bot, TrendingUp } from "lucide-react"

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Leads",
    description:
      "Import contacts from CSV, Excel, or your CRM. Set your script, define variables, and configure the AI agent persona.",
  },
  {
    icon: Bot,
    step: "02",
    title: "AI Makes the Calls",
    description:
      "Our AI agent calls each lead, handles objections, answers questions from your knowledge base, and qualifies interest — all naturally.",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Get Results",
    description:
      "Real-time dashboard shows call outcomes, lead scores, booked appointments, and full transcripts. Follow up on hot leads instantly.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Three steps to{" "}
            <span className="font-display italic text-brand">autopilot</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Go from leads list to booked meetings in minutes, not months.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-brand/20 via-brand to-brand/20" />

          {steps.map((s) => (
            <div key={s.step} className="relative text-center">
              {/* Step circle */}
              <div className="relative mx-auto w-20 h-20 rounded-2xl bg-white shadow-lg shadow-brand/10 flex items-center justify-center mb-6 border border-brand/10">
                <s.icon size={32} className="text-brand" />
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-brand text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {s.step}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
