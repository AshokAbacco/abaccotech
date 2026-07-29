// src/pages/dashboard/RenewalsCancelled.jsx
import React from "react";
import { XCircle } from "lucide-react";
import DashboardLayout from "../../Components/DashboardLayout";

// TODO: replace with real data from your API
const cancelledRenewals = [
  {
    siNo: 1,
    clientName: "Greenfield Clinic",
    softwareName: "Abacco Hospital ERP",
    renewalDueDate: "10-Jun-2026",
    cancelledDate: "15-Jun-2026",
    lostCommission: "₹8,000",
    reason: "Switched to another vendor",
  },
  {
    siNo: 2,
    clientName: "Metro Traders",
    softwareName: "Abacco Retail ERP",
    renewalDueDate: "02-Jul-2026",
    cancelledDate: "06-Jul-2026",
    lostCommission: "₹4,500",
    reason: "Budget constraints",
  },
];

export default function RenewalsCancelled() {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Renewal Cancelled</h1>
          <p className="text-gray-400 text-sm mt-1">
            Renewals that clients chose not to continue.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 rounded-xl mb-4">
            <XCircle className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{cancelledRenewals.length}</div>
          <div className="text-gray-400 text-sm">Cancelled Renewals</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 rounded-xl mb-4">
            <XCircle className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">₹12,500</div>
          <div className="text-gray-400 text-sm">Lost Commission</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white mb-6">Cancelled Renewals</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">SI No</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Client Name</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Software Name</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Renewal Due Date</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Cancelled Date</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Lost Commission</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Reason</th>
              </tr>
            </thead>
            <tbody>
              {cancelledRenewals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500 text-sm">
                    No cancelled renewals.
                  </td>
                </tr>
              ) : (
                cancelledRenewals.map((c) => (
                  <tr
                    key={c.siNo}
                    className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-3 pr-4 text-gray-300">{c.siNo}</td>
                    <td className="py-3 pr-4 text-white font-medium whitespace-nowrap">{c.clientName}</td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">{c.softwareName}</td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">{c.renewalDueDate}</td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">{c.cancelledDate}</td>
                    <td className="py-3 pr-4 text-red-400 font-medium whitespace-nowrap">{c.lostCommission}</td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">{c.reason}</td>
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