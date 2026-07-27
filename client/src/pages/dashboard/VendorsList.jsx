// \src\pages\dashboard\VendorsList.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Globe,
  User,
  ExternalLink,
  ClipboardCheck,
  ArrowUpRight,
  Building2,
} from "lucide-react";
import DashboardLayout from "../../Components/DashboardLayout";
import ReferralCodeBadge from "../../Components/ReferralCodeBadge";

// 🟡 UI-only placeholder data — swap with real API data later
const cards = [
  {
    type: "Referral Website",
    icon: Globe,
    name: "TechPartners.io",
    meta: "128 referrals this month",
    footer: "techpartners.io",
  },
  {
    type: "Referral Website",
    icon: Globe,
    name: "BizConnect Hub",
    meta: "76 referrals this month",
    footer: "bizconnecthub.com",
  },
  {
    type: "Client Details",
    icon: Building2,
    name: "Acme Retail Pvt Ltd",
    meta: "Contact: Rajesh Kumar",
    footer: "Active since Jan 2026",
  },
  {
    type: "Client Details",
    icon: Building2,
    name: "Sharma Textiles",
    meta: "Contact: Priya Sharma",
    footer: "Active since Mar 2026",
  },
];

export default function VendorsList() {
  return (
    <DashboardLayout>
      <div className="min-h-screen text-white py-10 px-2 relative overflow-hidden">
        {/* Background glow accents matching site theme */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-white">Vendors</h1>
              <p className="text-gray-400 text-sm mt-1">
                Referral websites and client details at a glance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <ReferralCodeBadge />

              <Link
                to="/vendors"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 rounded-full font-semibold text-sm hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-300 hover:scale-105 self-start sm:self-auto"
              >
                <ClipboardCheck className="w-4 h-4" />
                Complete Your Details
              </Link>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map(({ type, icon: Icon, name, meta, footer }, idx) => (
              <div
                key={idx}
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-green-500/40 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[11px] font-medium uppercase tracking-wide text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                    {type}
                  </span>
                </div>

                <h3 className="font-semibold text-white text-lg mb-1">
                  {name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{meta}</p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-800">
                  <span className="text-xs text-gray-500">{footer}</span>
                  {type === "Referral Website" ? (
                    <ExternalLink className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}