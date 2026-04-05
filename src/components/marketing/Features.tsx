import { Phone, BarChart3, Calendar, Globe, MessageSquare, Shield, Zap } from "lucide-react"
import { SpotlightCard } from "@/components/reactbits/SpotlightCard"
import { Orb } from "@/components/reactbits/Orb"

const barHeights = [40, 60, 45, 75, 55, 90, 70, 95, 65, 85, 88, 78]

export function Features() {
  return (
    <section id="features" className="py-28 bg-[#FFF8F0] relative overflow-hidden">
      <Orb className="left-[10%] top-[20%]" color="rgba(157,217,210,0.18)" size={500} blur={80} />
      <Orb className="right-[5%] bottom-[20%]" color="rgba(244,208,111,0.15)" size={400} blur={70} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-[#FF8811] uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
            Everything to{" "}
            <span className="font-script text-[#FF8811]" style={{ fontSize: "1.1em" }}>automate</span>
            {" "}your calling.
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            From first contact to closed deal - AI handles the entire workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Outbound - large */}
          <SpotlightCard
            className="md:col-span-2 bg-white rounded-2xl border border-orange-100 p-8 shadow-sm hover:shadow-xl hover:shadow-orange-200/30 transition-all duration-300 cursor-pointer group"
            spotlightColor="rgba(255, 136, 17, 0.07)"
          >
            <div className="w-11 h-11 rounded-xl bg-[#FF8811]/10 flex items-center justify-center mb-5 group-hover:bg-[#FF8811]/20 transition-colors">
              <Phone size={22} className="text-[#FF8811]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Outbound Campaigns</h3>
            <p className="text-gray-500 leading-relaxed mb-6 max-w-md">
              Upload your leads, set a script, and launch. Our AI calls hundreds of people automatically with human-like conversations.
            </p>
            <div className="bg-[#FFF8F0] rounded-xl p-4 border border-orange-100">
              <div className="flex justify-between text-xs mb-3">
                <span className="text-gray-400">Campaign: Real Estate Q1</span>
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Active
                </span>
              </div>
              {[
                { label: "Called", percent: 78, color: "bg-[#FF8811]" },
                { label: "Connected", percent: 62, color: "bg-[#9DD9D2]" },
                { label: "Interested", percent: 34, color: "bg-[#F4D06F]" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 mb-2 last:mb-0">
                  <span className="text-xs text-gray-400 w-16">{item.label}</span>
                  <div className="flex-1 bg-orange-100/60 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">{item.percent}%</span>
                </div>
              ))}
            </div>
          </SpotlightCard>

          {/* Inbound */}
          <SpotlightCard
            className="bg-white rounded-2xl border border-orange-100 p-8 shadow-sm hover:shadow-xl hover:shadow-teal-200/30 transition-all duration-300 cursor-pointer group"
            spotlightColor="rgba(157, 217, 210, 0.12)"
          >
            <div className="w-11 h-11 rounded-xl bg-[#9DD9D2]/20 flex items-center justify-center mb-5 group-hover:bg-[#9DD9D2]/35 transition-colors">
              <MessageSquare size={22} className="text-[#5BBDB5]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Inbound Handling</h3>
            <p className="text-gray-500 leading-relaxed">
              24/7 AI receptionist that answers calls, resolves queries from your knowledge base, and books appointments instantly.
            </p>
          </SpotlightCard>

          {/* Smart Booking */}
          <SpotlightCard
            className="bg-white rounded-2xl border border-orange-100 p-8 shadow-sm hover:shadow-xl hover:shadow-yellow-200/30 transition-all duration-300 cursor-pointer group"
            spotlightColor="rgba(244, 208, 111, 0.12)"
          >
            <div className="w-11 h-11 rounded-xl bg-[#F4D06F]/20 flex items-center justify-center mb-5 group-hover:bg-[#F4D06F]/35 transition-colors">
              <Calendar size={22} className="text-[#C9A030]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Booking</h3>
            <p className="text-gray-500 leading-relaxed">
              AI checks availability, proposes slots, and confirms bookings - all in the same call.
            </p>
          </SpotlightCard>

          {/* Analytics - large */}
          <SpotlightCard
            className="md:col-span-2 bg-white rounded-2xl border border-orange-100 p-8 shadow-sm hover:shadow-xl hover:shadow-orange-200/30 transition-all duration-300 cursor-pointer group"
            spotlightColor="rgba(255, 136, 17, 0.07)"
          >
            <div className="w-11 h-11 rounded-xl bg-[#F4D06F]/20 flex items-center justify-center mb-5 group-hover:bg-[#F4D06F]/35 transition-colors">
              <BarChart3 size={22} className="text-[#C9A030]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Analytics</h3>
            <p className="text-gray-500 leading-relaxed mb-6 max-w-md">
              Live dashboards with call transcripts, sentiment analysis, lead scoring, and conversion tracking across all campaigns.
            </p>
            <div className="bg-[#FFF8F0] rounded-xl px-4 pt-3 pb-2 border border-orange-100">
              <div className="flex items-end gap-1 h-14">
                {barHeights.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-[#FF8811]/30 group-hover:bg-[#FF8811]/55 transition-colors"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-2">Calls connected - last 12 weeks</p>
            </div>
          </SpotlightCard>

          {/* Hinglish */}
          <SpotlightCard
            className="bg-white rounded-2xl border border-orange-100 p-8 shadow-sm hover:shadow-xl hover:shadow-teal-200/30 transition-all duration-300 cursor-pointer group"
            spotlightColor="rgba(157, 217, 210, 0.12)"
          >
            <div className="w-11 h-11 rounded-xl bg-[#9DD9D2]/20 flex items-center justify-center mb-5 group-hover:bg-[#9DD9D2]/35 transition-colors">
              <Globe size={22} className="text-[#5BBDB5]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Hinglish AI</h3>
            <p className="text-gray-500 leading-relaxed">
              Natural conversations in Hindi, English, or a mix - adapts to how your customers speak.
            </p>
          </SpotlightCard>

          {/* Security */}
          <SpotlightCard
            className="bg-white rounded-2xl border border-orange-100 p-8 shadow-sm hover:shadow-xl hover:shadow-orange-200/30 transition-all duration-300 cursor-pointer group"
            spotlightColor="rgba(255, 136, 17, 0.07)"
          >
            <div className="w-11 h-11 rounded-xl bg-[#FF8811]/10 flex items-center justify-center mb-5 group-hover:bg-[#FF8811]/20 transition-colors">
              <Shield size={22} className="text-[#FF8811]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise Security</h3>
            <p className="text-gray-500 leading-relaxed">
              Encrypted calls, tenant isolation, role-based access, and full audit logs.
            </p>
          </SpotlightCard>

          {/* Setup */}
          <SpotlightCard
            className="bg-white rounded-2xl border border-orange-100 p-8 shadow-sm hover:shadow-xl hover:shadow-yellow-200/30 transition-all duration-300 cursor-pointer group"
            spotlightColor="rgba(244, 208, 111, 0.12)"
          >
            <div className="w-11 h-11 rounded-xl bg-[#F4D06F]/20 flex items-center justify-center mb-5 group-hover:bg-[#F4D06F]/35 transition-colors">
              <Zap size={22} className="text-[#C9A030]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">48-Hour Setup</h3>
            <p className="text-gray-500 leading-relaxed">
              From signup to live AI agent in 48 hours. No engineering required on your end.
            </p>
          </SpotlightCard>
        </div>
      </div>
    </section>
  )
}
