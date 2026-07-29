// src/pages/dashboard/Reports.jsx
import React, { useState } from "react";
import { TrendingUp, IndianRupee, Users, Percent } from "lucide-react";
import DashboardLayout from "../../Components/DashboardLayout";

// TODO: replace with real data from your API
const summary = [
  { icon: IndianRupee, label: "Total Revenue", value: "₹18,45,000" },
  { icon: TrendingUp, label: "Total Commission", value: "₹1,84,500" },
  { icon: Users, label: "Active Clients", value: "42" },
  { icon: Percent, label: "Renewal Rate", value: "87%" },
];

const monthlyReport = [
  { month: "Feb 2026", deals: 14, revenue: "₹2,10,000", commission: "₹21,000" },
  { month: "Mar 2026", deals: 18, revenue: "₹2,85,000", commission: "₹28,500" },
  { month: "Apr 2026", deals: 11, revenue: "₹1,60,000", commission: "₹16,000" },
  { month: "May 2026", deals: 22, revenue: "₹3,40,000", commission: "₹34,000" },
  { month: "Jun 2026", deals: 19, revenue: "₹2,95,000", commission: "₹29,500" },
  { month: "Jul 2026", deals: 24, revenue: "₹3,55,000", commission: "₹35,500" },
];

const maxDeals = Math.max(...monthlyReport.map((m) => m.deals));

export default function Reports() {
  const [range, setRange] = useState("6m");

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-gray-400 text-sm mt-1">
            Performance overview across deals, revenue and commissions.
          </p>
        </div>

        <div className="flex bg-gray-900/50 border border-gray-800 rounded-xl p-1 w-fit">
          {["3m", "6m", "1y"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                range === r
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summary.map(({ icon: Icon, label, value }) => (
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

      {/* Simple bar chart (UI only) */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8 mb-8">
        <h2 className="text-lg font-semibold text-white mb-6">Deals Closed by Month</h2>
        <div className="flex items-end gap-4 h-48">
          {monthlyReport.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
              <div className="text-xs text-gray-400">{m.deals}</div>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-green-600 to-green-400"
                style={{ height: `${(m.deals / maxDeals) * 100}%` }}
              />
              <div className="text-xs text-gray-500 whitespace-nowrap">{m.month.split(" ")[0]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white mb-6">Monthly Breakdown</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Month</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Deals Closed</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Revenue</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Commission</th>
              </tr>
            </thead>
            <tbody>
              {monthlyReport.map((m) => (
                <tr
                  key={m.month}
                  className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors"
                >
                  <td className="py-3 pr-4 text-white font-medium whitespace-nowrap">{m.month}</td>
                  <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">{m.deals}</td>
                  <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">{m.revenue}</td>
                  <td className="py-3 pr-4 text-green-400 font-medium whitespace-nowrap">{m.commission}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}