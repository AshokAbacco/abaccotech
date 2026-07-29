// src/pages/Dashboard.jsx
import React from "react";
import { Briefcase, PhoneCall, RefreshCw, Gift } from "lucide-react";
import DashboardLayout from "../../Components/DashboardLayout";
import ReferralCodeBadge from "../../Components/ReferralCodeBadge";

const stats = [
  { icon: Briefcase, label: "Total Deals", value: "128" },
  { icon: PhoneCall, label: "Pending Follow-ups", value: "12" },
  { icon: RefreshCw, label: "Upcoming Renewals", value: "8" },
  { icon: Gift, label: "Total Referral Users", value: "3" },
];

// TODO: replace with real data from your API
const recentDeals = [
  {
    siNo: 1,
    date: "28-Jul-2026",
    clientName: "ABC School",
    softwareName: "Abacco Edu ERP",
    totalAmount: "₹50,000",
    commissionAmount: "₹5,000",
    renewalDate: "28-Jul-2027",
    renewalCommission: "₹5,000",
  },
  {
    siNo: 2,
    date: "29-Jul-2026",
    clientName: "XYZ Hospital",
    softwareName: "Abacco Hospital ERP",
    totalAmount: "₹1,20,000",
    commissionAmount: "₹12,000",
    renewalDate: "29-Jul-2027",
    renewalCommission: "₹12,000",
  },
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

      {/* Recent Deals Table */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Recent Deals</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">
                  SI No
                </th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">
                  Date
                </th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">
                  Company / Client Name
                </th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">
                  Software Name
                </th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">
                  Total Amount
                </th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">
                  Commission Amount
                </th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">
                  Renewal Date
                </th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">
                  Renewal Commission Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {recentDeals.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-6 text-center text-gray-500 text-sm"
                  >
                    No deals to show yet.
                  </td>
                </tr>
              ) : (
                recentDeals.map((deal) => (
                  <tr
                    key={deal.siNo}
                    className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-3 pr-4 text-gray-300">{deal.siNo}</td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                      {deal.date}
                    </td>
                    <td className="py-3 pr-4 text-white font-medium whitespace-nowrap">
                      {deal.clientName}
                    </td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                      {deal.softwareName}
                    </td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                      {deal.totalAmount}
                    </td>
                    <td className="py-3 pr-4 text-green-400 font-medium whitespace-nowrap">
                      {deal.commissionAmount}
                    </td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                      {deal.renewalDate}
                    </td>
                    <td className="py-3 pr-4 text-green-400 font-medium whitespace-nowrap">
                      {deal.renewalCommission}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}