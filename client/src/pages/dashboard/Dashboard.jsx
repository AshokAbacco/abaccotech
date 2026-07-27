// src/pages/Dashboard.jsx
import React from "react";
import { Users, ShieldCheck, TrendingUp, Activity } from "lucide-react";
import DashboardLayout from "../../Components/DashboardLayout";
import ReferralCodeBadge from "../../Components/ReferralCodeBadge";

const stats = [
  { icon: Users, label: "Total Vendors", value: "128" },
  { icon: ShieldCheck, label: "Approved Vendors", value: "94" },
  { icon: TrendingUp, label: "Referral ", value: "3" },
  { icon: Activity, label: "Active Sessions", value: "3" }, 
];

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back{user?.username ? `, ${user.username}` : ""} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Here's what's happening with your platform today.
          </p>
        </div>
        <ReferralCodeBadge />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-green-500/40 transition-all duration-300"
          >
            <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-xl mb-4">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-gray-400 text-sm">{label}</div>
          </div>
        ))}
      </div>

      {/* Placeholder content area */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
        <h2 className="text-lg font-semibold text-white mb-2">
          Recent Activity
        </h2>
        <p className="text-gray-400 text-sm">
          Hook this section up to your real data (recent vendor sign-ups,
          payments, etc.) whenever it's ready.
        </p>
      </div>
    </DashboardLayout>
  );
}