import { Upload, Bot, TrendingUp } from "lucide-react"
import { Orb } from "@/components/reactbits/Orb"

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Leads",
    description: "Import contacts from CSV, Excel, or your CRM. Set your script, define variables, and configure the AI agent persona.",
    iconBg: "bg-[#FF8811]/10",
    iconColor: "text-[#FF8811]",
    badge: "bg-[#FF8811] text-white",
    hoverBorder: "hover:border-orange-200",
    hoverShadow: "hover:shadow-orange-200/30",
  },
  {
    icon: Bot,
    step: "02",
    title: "AI Makes the Calls",
    description: "Our AI agent calls each lead, handles objections, answers questions from your knowledge base, and qualifies interest — all naturally.",
    iconBg: "bg-[#9DD9D2]/20",
    iconColor: "text-[#5BBDB5]",
    badge: "bg-[#9DD9D2] text-white",
    hoverBorder: "hover:border-teal-200",
    hoverShadow: "hover:shadow-teal-200/30",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Get Results",
    description: "Real-time dashboard shows call outcomes, lead scores, booked appointments, and full transcripts. Follow up on hot leads instantly.",
    iconBg: "bg-[#F4D06F]/20",
    iconColor: "text-[#C9A030]",
    badge: "bg-[#F4D06F] text-gray-800",
    hoverBorder: "hover:border-yellow-200",
    hoverShadow: "hover:shadow-yellow-200/30",
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-28 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FFF8F0 0%, #FFF3DC 50%, #FFF8F0 100%)" }}
    >
      <Orb className="left-1/2 top-1/2" color="rgba(244,208,111,0.15)" size={600} blur={90} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-[#FF8811] uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
            Three steps to{" "}
            <span className="font-script text-[#FF8811]" style={{ fontSize: "1.1em" }}>autopilot</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Go from leads list to booked meetings in minutes, not months.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-14 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-orange-200/50 via-yellow-200/60 to-teal-200/50" />

          {steps.map((s) => (
            <div
              key={s.step}
              className={`relative bg-white rounded-2xl border border-orange-100 ${s.hoverBorder} p-8 shadow-sm hover:shadow-xl ${s.hoverShadow} transition-all duration-300 cursor-pointer`}
            >
              <div className="relative mb-6 w-fit">
                <div className={`w-12 h-12 rounded-xl ${s.iconBg} flex items-center justify-center`}>
                  <s.icon size={22} className={s.iconColor} />
                </div>
                <span className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${s.badge} flex items-center justify-center text-[10px] font-bold`}>
                  {s.step.slice(1)}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{s.title}</h3>
              <p className="text-gray-500 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
