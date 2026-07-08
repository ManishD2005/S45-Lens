import { COMPENSATION_DISCLOSURE, LEGAL_DISCLAIMER } from '../lib/disclosures'

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#003A36] to-[#055D56]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="label-caps mb-2.5 text-white/50">About S45 Lens</p>
            <p className="text-xs leading-relaxed text-white/70">
              S45 Lens gives you plain-language, source-verified facts on IPOs led by S45 — no verdicts, no
              recommendations, just what&rsquo;s disclosed and where it comes from.
            </p>
          </div>
          <div>
            <p className="label-caps mb-2.5 text-white/50">How S45 is compensated</p>
            <p className="text-xs leading-relaxed text-white/70">{COMPENSATION_DISCLOSURE}</p>
          </div>
          <div>
            <p className="label-caps mb-2.5 text-white/50">Disclaimers &amp; legal</p>
            <p className="text-xs leading-relaxed text-white/70">{LEGAL_DISCLAIMER}</p>
          </div>
          <div>
            <p className="label-caps mb-2.5 text-white/50">Contact</p>
            <p className="text-xs leading-relaxed text-white/70">
              <a href="mailto:hello@s45lens.example" className="hover:text-white hover:underline">
                hello@s45lens.example
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
