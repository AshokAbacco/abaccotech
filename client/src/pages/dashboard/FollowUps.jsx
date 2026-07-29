// src/pages/dashboard/FollowUps.jsx
import React, { useState } from "react";
import { PhoneCall, Clock, CheckCircle2, Search } from "lucide-react";
import DashboardLayout from "../../Components/DashboardLayout";

// TODO: replace with real data from your API
const followUps = [
  {
    id: 1,
    clientName: "ABC School",
    contactPerson: "Rakesh Sharma",
    phone: "+91 98765 43210",
    dueDate: "30-Jul-2026",
    status: "Pending",
  },
  {
    id: 2,
    clientName: "XYZ Hospital",
    contactPerson: "Dr. Meena Iyer",
    phone: "+91 91234 56789",
    dueDate: "01-Aug-2026",
    status: "Pending",
  },
  {
    id: 3,
    clientName: "Sunrise College",
    contactPerson: "Priya Nair",
    phone: "+91 90000 11223",
    dueDate: "27-Jul-2026",
    status: "Overdue",
  },
  {
    id: 4,
    clientName: "Greenfield Clinic",
    contactPerson: "Arjun Mehta",
    phone: "+91 99887 76655",
    dueDate: "22-Jul-2026",
    status: "Completed",
  },
];

const statusStyles = {
  Pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  Overdue: "bg-red-500/10 text-red-400 border border-red-500/20",
  Completed: "bg-green-500/10 text-green-400 border border-green-500/20",
};

export default function FollowUps() {
  const [search, setSearch] = useState("");

  const filtered = followUps.filter((f) =>
    f.clientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Follow Ups</h1>
          <p className="text-gray-400 text-sm mt-1">
            Track and manage pending client follow-ups.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client..."
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500/40"
          />
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-xl mb-4">
            <PhoneCall className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {followUps.filter((f) => f.status === "Pending").length}
          </div>
          <div className="text-gray-400 text-sm">Pending</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 rounded-xl mb-4">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {followUps.filter((f) => f.status === "Overdue").length}
          </div>
          <div className="text-gray-400 text-sm">Overdue</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-xl mb-4">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {followUps.filter((f) => f.status === "Completed").length}
          </div>
          <div className="text-gray-400 text-sm">Completed</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white mb-6">All Follow Ups</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Client Name</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Contact Person</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Phone</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Due Date</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Status</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500 text-sm">
                    No follow-ups found.
                  </td>
                </tr>
              ) : (
                filtered.map((f) => (
                  <tr
                    key={f.id}
                    className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-3 pr-4 text-white font-medium whitespace-nowrap">{f.clientName}</td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">{f.contactPerson}</td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">{f.phone}</td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">{f.dueDate}</td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[f.status]}`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <button className="text-green-400 hover:text-green-300 text-sm font-medium">
                        Mark Done
                      </button>
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