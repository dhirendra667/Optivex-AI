import { Sparkles } from "lucide-react"
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="sm:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Sparkles className="h-5 w-5 text-violet-400" />
            </div>

            <span className="text-xl font-semibold">Optivex AI</span>
          </div>

          <p className="mt-5 max-w-md text-sm leading-7 text-white/60">
            AI stack optimization platform helping teams reduce redundant
            subscriptions, streamline workflows, and make smarter AI tooling
            decisions.
          </p>

          {/* Socials */}
          <div className="mt-6 flex items-center gap-4">
            <a
              href="#"
              className="rounded-lg border border-white/10 p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <FaTwitter className="h-4 w-4" />
            </a>

            <a
              href="#"
              className="rounded-lg border border-white/10 p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <FaGithub className="h-4 w-4" />
            </a>

            <a
              href="#"
              className="rounded-lg border border-white/10 p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <FaLinkedin className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Product */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Product
          </h3>

          <ul className="mt-5 space-y-3 text-sm text-white/60">
            <li>
              <a href="#" className="transition hover:text-white">
                AI Audit
              </a>
            </li>

            <li>
              <a href="#" className="transition hover:text-white">
                Dashboard
              </a>
            </li>

            <li>
              <a href="#" className="transition hover:text-white">
                AI Consultant
              </a>
            </li>

            <li>
              <a href="#" className="transition hover:text-white">
                Reports
              </a>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Company
          </h3>

          <ul className="mt-5 space-y-3 text-sm text-white/60">
            <li>
              <a href="#" className="transition hover:text-white">
                About
              </a>
            </li>

            <li>
              <a href="#" className="transition hover:text-white">
                Privacy
              </a>
            </li>

            <li>
              <a href="#" className="transition hover:text-white">
                Terms
              </a>
            </li>

            <li>
              <a href="#" className="transition hover:text-white">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-center text-sm text-white/50 md:flex-row md:text-left">
          <p>© 2026 Optivex AI. All rights reserved.</p>

          <p>Built for AI workflow optimization and spend intelligence.</p>
        </div>
      </div>
    </footer>
  )
}