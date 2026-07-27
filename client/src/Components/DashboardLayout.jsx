// src/layouts/DashboardLayout.jsx
import React from "react";
import Sidebar from "../Components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Sidebar />
      {/* Offset by sidebar width (w-64) */}
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}