import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer
      className="text-gray-500 pt-16 pb-8 border-t border-orange-100"
      style={{ background: "linear-gradient(180deg, #FFF3DC 0%, #FFF8F0 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <span className="font-script text-3xl text-[#FF8811] leading-none">Sociovate</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">
              AI voice agents that sound human. Automate your calls, multiply your team.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-gray-800 font-semibold mb-5 text-xs uppercase tracking-widest">Product</h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
                { label: "How It Works", href: "#how-it-works" },
                { label: "FAQ", href: "#faq" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-[#FF8811] transition-colors cursor-pointer">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-gray-800 font-semibold mb-5 text-xs uppercase tracking-widest">Company</h4>
            <ul className="space-y-3 text-sm">
              {["About", "Blog", "Careers", "Contact"].map((label) => (
                <li key={label}>
                  <a href="#" className="hover:text-[#FF8811] transition-colors cursor-pointer">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gray-800 font-semibold mb-5 text-xs uppercase tracking-widest">Get in Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Mail size={13} className="text-[#FF8811] shrink-0" />
                <a href="mailto:hello@sociovate.com" className="hover:text-[#FF8811] transition-colors">hello@sociovate.com</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={13} className="text-[#9DD9D2] shrink-0" />
                <span>+91 81494 83065</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin size={13} className="text-[#F4D06F] shrink-0" />
                <span>Pune, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-orange-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Sociovate AI. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs">
            <a href="#" className="hover:text-[#FF8811] transition-colors cursor-pointer">Privacy Policy</a>
            <a href="#" className="hover:text-[#FF8811] transition-colors cursor-pointer">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
