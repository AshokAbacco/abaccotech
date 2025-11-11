import React from "react";
import { ShieldCheck, User, Lock, Globe, Mail, Database, History } from "lucide-react";
import Layout from "../Components/Layout";

const Section = ({ id, icon: Icon, title, children }) => (
  <section id={id} className="scroll-mt-28">
    <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_16px_40px_rgba(0,0,0,0.2)] hover:bg-white/10">
      <div className="flex items-start gap-4">
        <div className="rounded-xl p-3 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-white">{title}</h2>
          <div className="mt-4 text-gray-100/90 leading-relaxed">{children}</div>
        </div>
      </div>
      <div className="pointer-events-none absolute -top-3 -right-3 h-12 w-12 rounded-full bg-gradient-to-br from-green-500/40 to-emerald-600/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  </section>
);

const Anchor = ({ href, children }) => (
  <a href={href} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs md:text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors">
    {children}
  </a>
);

export default function PrivacyPolicy() {
  return (
    <Layout>
      <main className="min-h-screen ">
        <div className="pointer-events-none fixed inset-0 -z-10 [mask-image:radial-gradient(55%_40%_at_50%_0%,black,transparent)]">
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-emerald-500/20 to-transparent" />
        </div>
        

        <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
          <header className="pt-20 md:pt-28">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                  <ShieldCheck className="h-4 w-4 text-green-400" /> Privacy & Data Protection
                </div>
                <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight text-white">Privacy Policy</h1>
                <p className="mt-3 max-w-2xl text-white/80">
                  We respect your privacy and are committed to protecting your personal information.
                </p>
              </div>

              <nav className="flex flex-wrap gap-2">
                <Anchor href="#collect">Data We Collect</Anchor>
                <Anchor href="#use">How We Use Data</Anchor>
                <Anchor href="#protect">Data Protection</Anchor>
                <Anchor href="#cookies">Cookies</Anchor>
                <Anchor href="#rights">Your Rights</Anchor>
                <Anchor href="#contact">Contact</Anchor>
              </nav>
            </div>
          </header>

          <div className="my-12" />

          <div className="grid grid-cols-1 gap-6 md:gap-8 pb-24">
            <Section id="collect" icon={User} title="1. Information We Collect">
              <ul className="list-disc pl-5 space-y-2 text-white/90">
                <li>Personal details (name, email, phone, company, job title)</li>
                <li>Project or business details shared for service delivery</li>
                <li>Technical data (IP, browser, device, pages visited)</li>
                <li>Payment data (processed securely by third‑party gateways)</li>
              </ul>
            </Section>

            <Section id="use" icon={Database} title="2. How We Use Your Information">
              <ul className="list-disc pl-5 space-y-2 text-white/90">
                <li>To provide and improve our services</li>
                <li>To communicate regarding support or inquiries</li>
                <li>To send updates or marketing (with consent)</li>
                <li>To comply with legal and operational requirements</li>
              </ul>
            </Section>

            <Section id="protect" icon={Lock} title="3. How We Protect Data">
              <p>
                We use secure servers, encryption, restricted access, and regular monitoring to prevent unauthorized
                access or misuse of your information.
              </p>
            </Section>

            <Section id="cookies" icon={Globe} title="4. Cookies & Tracking">
              <p>
                Our website uses cookies to improve user experience and analyze traffic. You may disable cookies in
                your browser settings, but some features may not function properly.
              </p>
            </Section>

            <Section id="rights" icon={History} title="5. Your Rights">
              <ul className="list-disc pl-5 space-y-2 text-white/90">
                <li>Access, update, or delete your data</li>
                <li>Withdraw consent for communications</li>
                <li>Request a copy of stored personal information</li>
              </ul>
            </Section>

            <Section id="contact" icon={Mail} title="6. Contact Us">
              <p>
                For privacy queries or data requests, contact us at
                <br />
                <strong>Email:</strong> info@abaccotech.com
              </p>
            </Section>
          </div>
        </div>
        {/* Bottom wave divider */}
      <div className="  bg-gradient-to-t from-black/40 to-transparent">
        <svg aria-hidden viewBox="0 0 1440 120" className="w-full opacity-40">
          <path
            fill="currentColor"
            className="text-emerald-500/40"
            d="M0,64L60,80C120,96,240,128,360,133.3C480,139,600,117,720,112C840,107,960,117,1080,101.3C1200,85,1320,43,1380,21.3L1440,0L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
          />
        </svg>
      </div>
      </main>
    </Layout>
  );
}
