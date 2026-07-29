// src/pages/dashboard/Renewals.jsx
import React from "react";
import { RefreshCw, IndianRupee, CalendarClock } from "lucide-react";
import DashboardLayout from "../../Components/DashboardLayout";

// TODO: replace with real data from your API
const renewals = [
  {
    siNo: 1,
    clientName: "ABC School",
    softwareName: "Abacco Edu ERP",
    lastRenewalDate: "28-Jul-2025",
    renewalDate: "28-Jul-2026",
    renewalAmount: "₹50,000",
    renewalCommission: "₹5,000",
    daysLeft: 12,
  },
  {
    siNo: 2,
    clientName: "XYZ Hospital",
    softwareName: "Abacco Hospital ERP",
    lastRenewalDate: "29-Jul-2025",
    renewalDate: "29-Jul-2026",
    renewalAmount: "₹1,20,000",
    renewalCommission: "₹12,000",
    daysLeft: 13,
  },
  {
    siNo: 3,
    clientName: "Sunrise College",
    softwareName: "Abacco Edu ERP",
    lastRenewalDate: "05-Aug-2025",
    renewalDate: "05-Aug-2026",
    renewalAmount: "₹75,000",
    renewalCommission: "₹7,500",
    daysLeft: 20,
  },
];

export default function Renewals() {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Renewals</h1>
          <p className="text-gray-400 text-sm mt-1">
            Upcoming subscription renewals across all clients.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-xl mb-4">
            <RefreshCw className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{renewals.length}</div>
          <div className="text-gray-400 text-sm">Upcoming Renewals</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-xl mb-4">
            <IndianRupee className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">₹24,500</div>
          <div className="text-gray-400 text-sm">Expected Commission</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl mb-4">
            <CalendarClock className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {Math.min(...renewals.map((r) => r.daysLeft))} days
          </div>
          <div className="text-gray-400 text-sm">Nearest Renewal</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white mb-6">Renewal Schedule</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">SI No</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Client Name</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Software Name</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Last Renewal</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Renewal Date</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Renewal Amount</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Commission</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Days Left</th>
              </tr>
            </thead>
            <tbody>
              {renewals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-gray-500 text-sm">
                    No renewals coming up.
                  </td>
                </tr>
              ) : (
                renewals.map((r) => (
                  <tr
                    key={r.siNo}
                    className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-3 pr-4 text-gray-300">{r.siNo}</td>
                    <td className="py-3 pr-4 text-white font-medium whitespace-nowrap">{r.clientName}</td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">{r.softwareName}</td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">{r.lastRenewalDate}</td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">{r.renewalDate}</td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">{r.renewalAmount}</td>
                    <td className="py-3 pr-4 text-green-400 font-medium whitespace-nowrap">{r.renewalCommission}</td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          r.daysLeft <= 15
                            ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                            : "bg-green-500/10 text-green-400 border border-green-500/20"
                        }`}
                      >
                        {r.daysLeft} days
                      </span>
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