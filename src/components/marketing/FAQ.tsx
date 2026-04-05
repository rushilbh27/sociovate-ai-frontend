"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  { q: "What is Sociovate AI?", a: "Sociovate AI is an AI-powered voice calling platform that automates outbound and inbound calls for businesses. Our AI agent talks like a real person - handling lead qualification, appointment booking, follow-ups, and customer support without any human callers." },
  { q: "How does it work?", a: "You provide your call script, lead list, and business FAQ. Our AI agent automatically makes calls or receives inbound calls, has natural conversations in Hinglish, answers questions from your knowledge base, and takes actions like booking appointments - all in real-time." },
  { q: "Does the AI actually sound human?", a: "Yes. Our agent speaks natural Hinglish with proper fillers like 'acha', 'bilkul', 'dekhiye'. The voice is warm and professional. Most callers don't realize they're speaking with AI." },
  { q: "How long does setup take?", a: "Basic setup takes 24-48 hours. You provide your script, FAQ knowledge base, and phone number. We handle LLM tuning, voice selection, call flow configuration, and all integrations." },
  { q: "What's the pricing?", a: "Starting plans begin at ₹4,999/month with 500 outbound minutes included. Per-minute rates decrease with volume. Custom enterprise plans are available with dedicated support and unlimited minutes." },
  { q: "Which industries does it work for?", a: "Real estate, automobile dealerships, healthcare clinics, education institutes, insurance, financial services, e-commerce, event management - any business where phone calling is important." },
  { q: "Does it integrate with my existing tools?", a: "Yes. We support Google Calendar, Telegram notifications, WhatsApp messaging, and custom webhooks. Call data syncs automatically after every call." },
  { q: "Do I get call recordings and transcripts?", a: "Yes, every call gets a full recording and detailed transcript. Call summaries, caller intent, and outcome are automatically generated after each call." },
  { q: "Is there a free trial?", a: "Yes! We offer a free live demo call where you can talk to our AI agent directly. No commitment required to get started." },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={cn("border-b border-orange-100 last:border-0", open && "border-orange-200/70")}>
      <button
        className="w-full flex items-center justify-between py-5 text-left group cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span className="text-base font-medium text-gray-800 group-hover:text-[#FF8811] transition-colors pr-4">{q}</span>
        <span className={cn(
          "w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all",
          open
            ? "border-[#FF8811] bg-[#FF8811]/10 text-[#FF8811]"
            : "border-orange-200 text-gray-400 group-hover:border-[#FF8811]/50 group-hover:text-[#FF8811]"
        )}>
          {open ? <Minus size={13} /> : <Plus size={13} />}
        </span>
      </button>
      <div className={cn("overflow-hidden transition-all duration-300", open ? "max-h-96 pb-5" : "max-h-0")}>
        <p className="text-gray-500 leading-relaxed pr-10">{a}</p>
      </div>
    </div>
  )
}

export function FAQ() {
  return (
    <section id="faq" className="py-28 bg-[#FFF8F0]">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-[#FF8811] uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
            Got{" "}
            <span className="font-script text-[#FF8811]" style={{ fontSize: "1.1em" }}>questions?</span>
          </h2>
          <p className="text-lg text-gray-500">Everything you need to know about Sociovate AI.</p>
        </div>
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm px-8 py-2 hover:shadow-lg hover:shadow-orange-200/20 transition-shadow">
          {faqs.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
        </div>
      </div>
    </section>
  )
}
