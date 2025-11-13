import React from "react";
import { ShieldCheck, FileCheck, Users, Scale, Briefcase, Mail, Globe, Award, Lock } from "lucide-react";
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

export default function TermsOfService() {
  return (
    <Layout>
      <main className="min-h-screen">
        <div className="pointer-events-none fixed inset-0 -z-10 [mask-image:radial-gradient(55%_40%_at_50%_0%,black,transparent)]">
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-emerald-500/20 to-transparent" />
        </div>

        <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
          {/* Hero */}
          <header className="pt-24 md:pt-32 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs text-white/80">
              <ShieldCheck className="h-4 w-4 text-green-400" /> Abacco Technology — Legal Terms
            </div>
            <h1 className="mt-5 text-4xl md:text-6xl font-bold tracking-tight text-white">
              Terms of Service
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-white/70 text-base md:text-lg">
              By using our services, you agree to the following terms. Please read carefully.
            </p>
          </header>

          {/* Quick Navigation */}
          <nav className="flex flex-wrap justify-center gap-2 mt-8">
            {[
              { id: "services", label: "Services" },
              { id: "users", label: "User Conduct" },
              { id: "payments", label: "Payments" },
              { id: "ip", label: "Intellectual Property" },
              { id: "confidentiality", label: "Confidentiality" },
              { id: "law", label: "Legal" },
              { id: "contact", label: "Contact" }
            ].map((item) => (
              <Anchor key={item.id} href={`#${item.id}`}>{item.label}</Anchor>
            ))}
          </nav>

          <div className="my-14" />

          {/* Sections */}
          <div className="grid grid-cols-1 gap-6 md:gap-8 pb-24">
            <Section id="services" icon={Briefcase} title="1. Scope of Services">
              <p>
                We provide IT development, digital marketing, software solutions, and technical consulting. Specific
                project deliverables, timelines, and payment terms are defined in individual agreements.
              </p>
            </Section>

            <Section id="users" icon={Users} title="2. User Responsibilities">
              <ul className="list-disc pl-5 space-y-2 text-white/90">
                <li>Provide accurate information & project details</li>
                <li>Use services lawfully & professionally</li>
                <li>Not misuse, modify, hack, or abuse our systems or data</li>
                <li>Respect business boundaries and intellectual property</li>
              </ul>
            </Section>

            <Section id="payments" icon={FileCheck} title="3. Payments & Refund Terms">
              <p>
                Payments must be completed as agreed in your contract. Refund policies follow our
                <a href="/refund-policy" className="text-green-400 underline ml-1">Refund Policy</a>.
              </p>
            </Section>

            <Section id="ip" icon={Award} title="4. Intellectual Property">
              <p>
                Work delivered remains Abacco Technology’s property until full payment is received. Client-provided
                data always remains client property.
              </p>
            </Section>

            <Section id="confidentiality" icon={Lock} title="5. Confidentiality & NDA">
              <p>
                All shared business data is confidential. Both parties agree not to disclose private information
                without written consent.
              </p>
            </Section>

            <Section id="law" icon={Scale} title="6. Governing Law & Disputes">
              <p>
                All services are governed by Indian law. Jurisdiction: Bangalore, Karnataka. Disputes will be
                resolved professionally through discussion or legal channels.
              </p>
            </Section>

            <Section id="contact" icon={Mail} title="7. Contact & Support">
              <p>
                For any legal or service questions, contact us at:
                <br /><strong>Email:</strong> info@abaccotech.com
              </p>
              <p className="mt-2 text-sm text-white/60">We usually respond within 24 hours.</p>
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