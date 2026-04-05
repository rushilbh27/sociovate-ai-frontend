import Link from "next/link"
import { ArrowRight, Play, Phone, TrendingUp, Calendar } from "lucide-react"
import { Aurora } from "@/components/reactbits/Aurora"
import { Orb } from "@/components/reactbits/Orb"

const recentCalls = [
  { name: "Rajesh Kumar", company: "PropTech Delhi", status: "Appointment Booked", statusColor: "bg-teal-100 text-teal-700" },
  { name: "Sneha Patel", company: "AutoHaus Mumbai", status: "Follow-up Scheduled", statusColor: "bg-amber-100 text-amber-700" },
  { name: "Amit Singh", company: "EduReach Bangalore", status: "Qualified", statusColor: "bg-orange-100 text-orange-700" },
  { name: "Meera Joshi", company: "FinServe Pune", status: "Voicemail Left", statusColor: "bg-yellow-100 text-yellow-700" },
]

const dashboardStats = [
  { label: "Calls Made", value: "1,247", change: "+12%", icon: Phone, color: "text-[#FF8811]" },
  { label: "Connected", value: "92%", change: "+3%", icon: TrendingUp, color: "text-[#9DD9D2]" },
  { label: "Booked", value: "84", change: "+21%", icon: Calendar, color: "text-emerald-500" },
  { label: "Conversion", value: "6.7%", change: "+1.2%", icon: TrendingUp, color: "text-[#F4D06F]" },
]

export function Hero() {
  return (
    <div style={{ background: "linear-gradient(160deg, #FFF3DC 0%, #FFF8F0 30%, #E8F7F6 55%, #FFF0DC 80%, #FFF8F0 100%)" }}>
      <Aurora className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grain">
        {/* Central warm orb */}
        <Orb
          className="left-1/2 top-[35%]"
          color="rgba(255, 136, 17, 0.15)"
          size={700}
          blur={100}
        />

        {/* Floating blobs */}
        <div className="absolute top-32 left-12 w-48 h-48 rounded-full bg-[#9DD9D2]/20 blur-3xl animate-float pointer-events-none" />
        <div className="absolute top-48 right-16 w-64 h-64 rounded-full bg-[#F4D06F]/20 blur-3xl animate-float-slow pointer-events-none" />
        <div className="absolute bottom-32 left-1/4 w-56 h-56 rounded-full bg-[#FF8811]/15 blur-3xl animate-float pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-32 pb-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-orange-200/60 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up shadow-sm">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600">Live with 50+ businesses across India</span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.93] tracking-tight mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="font-script text-[#FF8811]" style={{ fontSize: "1.05em" }}>Voice</span>{" "}
            <span className="text-gray-900">agents</span>
            <br />
            <span className="text-gray-900">that sound</span>{" "}
            <span className="font-script text-[#FF8811]" style={{ fontSize: "1.05em" }}>human</span>
          </h1>

          <p
            className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            AI-powered calling that handles lead qualification, appointment booking,
            and follow-ups — so your team can focus on closing.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href="/signup"
              className="group bg-[#FF8811] hover:bg-[#E07300] text-white px-8 py-4 rounded-full font-semibold text-base transition-all animate-pulse-glow flex items-center gap-2 cursor-pointer"
            >
              Start Free Trial
              <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#demo"
              className="group flex items-center gap-3 px-6 py-4 rounded-full text-gray-600 hover:text-[#FF8811] transition-colors text-base cursor-pointer"
            >
              <span className="w-11 h-11 rounded-full bg-white shadow-md shadow-orange-200 flex items-center justify-center group-hover:shadow-orange-300 transition-shadow">
                <Play size={16} className="text-[#FF8811] ml-0.5" fill="currentColor" />
              </span>
              Listen to a demo
            </a>
          </div>

          {/* Trusted by */}
          <div className="mb-12 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-5">Trusted by forward-thinking teams</p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 opacity-40">
              {["AutoHaus", "MedConnect", "EduReach", "PropertyPro", "FinServe"].map((name) => (
                <span key={name} className="text-base font-semibold text-gray-500">{name}</span>
              ))}
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="relative mx-auto max-w-4xl animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#FFF8F0] via-[#FFF8F0]/70 to-transparent z-10 pointer-events-none" />
            <div className="absolute -inset-4 bg-[#FF8811]/6 rounded-3xl blur-3xl" />

            <div className="relative bg-white/85 backdrop-blur-md rounded-2xl border border-orange-200/50 shadow-2xl shadow-orange-200/30 overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-orange-50 bg-[#FFF8F0]/80">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                  <div className="w-3 h-3 rounded-full bg-green-400/70" />
                </div>
                <span className="text-xs text-gray-400 ml-2 font-mono">Sociovate Dashboard — Q1 Outbound</span>
              </div>

              {/* Stat row */}
              <div className="grid grid-cols-4 gap-3 p-5 pb-3">
                {dashboardStats.map((stat) => (
                  <div key={stat.label} className="bg-[#FFF8F0] rounded-xl p-4 border border-orange-100/60 hover:border-orange-200 transition-all">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs text-gray-400">{stat.label}</p>
                      <stat.icon size={13} className={stat.color} />
                    </div>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-emerald-600 mt-0.5">{stat.change} this week</p>
                  </div>
                ))}
              </div>

              {/* Call list */}
              <div className="px-5 pb-5">
                <div className="bg-[#FFF8F0]/80 rounded-xl border border-orange-100/60 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-orange-50">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">Recent Calls</span>
                      <span className="flex items-center gap-1 bg-emerald-100 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full font-medium">
                        <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />Live
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">1,247 total</span>
                  </div>
                  {recentCalls.map((call) => (
                    <div
                      key={call.name}
                      className="flex items-center justify-between px-4 py-3 border-b border-orange-50/60 last:border-0 hover:bg-white/60 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#FF8811]/10 flex items-center justify-center text-xs font-semibold text-[#FF8811] shrink-0">
                          {call.name.charAt(0)}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-800">{call.name}</p>
                          <p className="text-xs text-gray-400">{call.company}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${call.statusColor}`}>
                        {call.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Aurora>
    </div>
  )
}
