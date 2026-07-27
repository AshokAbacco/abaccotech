// \src\pages\dashboard\Admin.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2, Users, Loader2, ShieldAlert } from "lucide-react";
import DashboardLayout from "../../../Components/DashboardLayout";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load users.");
      }

      setUsers(data.users);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Delete "${username}"? This cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/auth/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete user.");
      }

      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert(err.message || "Something went wrong while deleting.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen text-white py-6 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Users className="w-7 h-7 text-green-500" />
              All Users
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage every registered account on the platform.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center gap-2 text-gray-400 py-16">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading users...
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 uppercase text-xs tracking-wide">
                      <th className="px-6 py-4 font-medium">User Name</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Phone Number</th>
                      <th className="px-6 py-4 font-medium">Referred Count</th>
                      <th className="px-6 py-4 font-medium text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-10 text-center text-gray-500"
                        >
                          No users found.
                        </td>
                      </tr>
                    )}
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-800/60 last:border-0 hover:bg-gray-800/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">
                              {user.username}
                            </span>
                            {user.role === "admin" && (
                              <span className="text-[10px] uppercase font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                                Admin
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {user.phone || "—"}
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {user.referredCount ?? 0}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                navigate(`/admin/users/${user.id}`)
                              }
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-green-400 hover:text-white bg-green-500/10 hover:bg-green-500/80 border border-green-500/20 px-3 py-2 rounded-lg transition-all duration-200"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(user.id, user.username)
                              }
                              disabled={deletingId === user.id}
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/80 border border-red-500/20 px-3 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {deletingId === user.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}