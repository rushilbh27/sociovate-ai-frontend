"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    q: "What is Sociovate AI?",
    a: "Sociovate AI is an AI-powered voice calling platform that automates outbound and inbound calls for businesses. Our AI agent talks like a real person — handling lead qualification, appointment booking, follow-ups, and customer support without any human callers.",
  },
  {
    q: "How does it work?",
    a: "You provide your call script, lead list, and business FAQ. Our AI agent automatically makes calls or receives inbound calls, has natural conversations in Hinglish, answers questions from your knowledge base, and takes actions like booking appointments — all in real-time.",
  },
  {
    q: "Does the AI actually sound human?",
    a: "Yes. Our agent speaks natural Hinglish with proper fillers like 'acha', 'bilkul', 'dekhiye'. The voice is warm and professional. Most callers don't realize they're speaking with AI.",
  },
  {
    q: "How long does setup take?",
    a: "Basic setup takes 24-48 hours. You provide your script, FAQ knowledge base, and phone number. We handle LLM tuning, voice selection, call flow configuration, and all integrations.",
  },
  {
    q: "What's the pricing?",
    a: "Starting plans begin at ₹4,999/month with 500 outbound minutes included. Per-minute rates decrease with volume. Custom enterprise plans are available with dedicated support and unlimited minutes.",
  },
  {
    q: "Which industries does it work for?",
    a: "Real estate, automobile dealerships, healthcare clinics, education institutes, insurance, financial services, e-commerce, event management — any business where phone calling is important. Our biggest verticals are automotive and real estate.",
  },
  {
    q: "Does it integrate with my existing tools?",
    a: "Yes. We support Google Calendar, Telegram notifications, WhatsApp messaging, and custom webhooks. Your CRM or booking system connects via webhooks — call data syncs automatically after every call.",
  },
  {
    q: "Do I get call recordings and transcripts?",
    a: "Yes, every call gets a full recording and detailed transcript. You can access them from the dashboard. Call summaries, caller intent, and outcome are automatically generated after each call.",
  },
  {
    q: "Can I run outbound campaigns?",
    a: "Absolutely. Upload leads from CSV, set your script, and launch. The AI calls everyone on schedule. You get real-time analytics — connections, interest level, appointments booked. Campaigns can be paused, resumed, or modified live.",
  },
  {
    q: "Is my data secure?",
    a: "We use enterprise-grade security. All calls are encrypted, data is stored on Indian servers, and we follow GDPR-compliant practices. Your data is never shared with third parties. Each tenant's data is fully isolated.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes! We offer a free live demo call where you can talk to our AI agent directly. After the demo, we provide a customized proposal for your use case. No commitment required to get started.",
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="w-full flex items-center justify-between py-5 text-left group"
        onClick={() => setOpen(!open)}
      >
        <span className="text-lg font-medium text-gray-900 group-hover:text-brand transition-colors pr-4">
          {q}
        </span>
        <ChevronDown
          size={20}
          className={cn(
            "text-gray-400 shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          open ? "max-h-96 pb-5" : "max-h-0"
        )}
      >
        <p className="text-gray-500 leading-relaxed pr-12">{a}</p>
      </div>
    </div>
  )
}

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-brand uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Got{" "}
            <span className="font-display italic text-brand">questions</span>?
          </h2>
          <p className="text-lg text-gray-500">
            Everything you need to know about Sociovate AI.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          {faqs.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  )
}
