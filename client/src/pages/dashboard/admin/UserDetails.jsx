// \src\pages\dashboard\UserDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Gift,
  Calendar,
  Building2,
  Globe,
  CreditCard,
  Landmark,
  Hash,
  MapPin,
  KeyRound,
  FileText,
  Image as ImageIcon,
  Download,
  Loader2,
  ShieldAlert,
  Inbox,
} from "lucide-react";
import DashboardLayout from "../../../Components/DashboardLayout";

const API_URL = import.meta.env.VITE_API_URL ;

// Small read-only "label + value" row used across every section
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-9 h-9 flex items-center justify-center bg-gray-800/60 rounded-lg shrink-0 mt-0.5">
      <Icon className="w-4 h-4 text-green-500" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm text-white font-medium break-words">
        {value || <span className="text-gray-600">—</span>}
      </p>
    </div>
  </div>
);

const SectionCard = ({ title, children }) => (
  <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
    <h2 className="text-lg font-bold text-white border-l-4 border-green-500 pl-3 mb-6">
      {title}
    </h2>
    {children}
  </div>
);

const docTypeLabels = {
  AADHAAR: "Aadhaar Card",
  PAN: "PAN Card",
  OTHER: "Other Document",
};

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/auth/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load user.");
        }

        setUser(data.user);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const vendor = user?.vendor;

  return (
    <DashboardLayout>
      <div className="min-h-screen text-white py-6 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Back link */}
          <button
            onClick={() => navigate("/admin")}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Users
          </button>

          {loading && (
            <div className="flex items-center justify-center gap-2 text-gray-400 py-16">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading user details...
            </div>
          )}

          {!loading && error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {!loading && !error && user && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-2xl text-2xl font-bold shrink-0">
                  {user.username?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {user.username}
                  </h1>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
                 
              </div>

              {/* Personal Details */}
              <SectionCard title="Personal Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoRow icon={User} label="Username" value={user.username} />
                  <InfoRow icon={Mail} label="Email" value={user.email} />
                  <InfoRow icon={Phone} label="Phone Number" value={user.phone} />
                  <InfoRow
                    icon={Gift}
                    label="Referral Code"
                    value={user.referralCode}
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Joined On"
                    value={
                      user.createdAt &&
                      new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    }
                  />
                </div>
              </SectionCard>

              {!vendor && (
                <div className="bg-gray-900/50 border border-dashed border-gray-700 rounded-2xl p-10 text-center">
                  <Inbox className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">
                    This user hasn't submitted their vendor details yet.
                  </p>
                </div>
              )}

              {vendor && (
                <>
                  {/* Business Details */}
                  <SectionCard title="Business Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoRow
                        icon={Building2}
                        label="Full Name (submitted)"
                        value={vendor.fullName}
                      />
                      <InfoRow
                        icon={Globe}
                        label="Website URL"
                        value={vendor.websiteUrl}
                      />
                      <InfoRow
                        icon={CreditCard}
                        label="Aadhaar Number"
                        value={vendor.aadhaarNumber}
                      />
                      <InfoRow
                        icon={CreditCard}
                        label="PAN Number"
                        value={vendor.panNumber}
                      />
                    </div>
                  </SectionCard>

                  {/* Bank Account Details */}
                  <SectionCard title="Bank Account Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoRow
                        icon={Hash}
                        label="Account Number"
                        value={vendor.bankAccountNumber}
                      />
                      <InfoRow
                        icon={Landmark}
                        label="Bank Name"
                        value={vendor.bankName}
                      />
                      <InfoRow
                        icon={KeyRound}
                        label="IFSC Code"
                        value={vendor.ifscCode}
                      />
                      <InfoRow
                        icon={MapPin}
                        label="Branch"
                        value={vendor.branchName}
                      />
                    </div>
                  </SectionCard>

                  {/* Uploaded Documents */}
                  <SectionCard title="Uploaded Documents">
                    {vendor.files?.length ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {vendor.files.map((file) => {
                          const isImage = file.fileType?.startsWith("image/");
                          return (
                            <a
                              key={file.id}
                              href={`${API_URL}${file.filePath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between gap-3 bg-gray-800/50 border border-gray-700 hover:border-green-500/50 rounded-xl px-4 py-3 transition-colors"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {isImage ? (
                                  <ImageIcon className="w-5 h-5 text-green-500 shrink-0" />
                                ) : (
                                  <FileText className="w-5 h-5 text-green-500 shrink-0" />
                                )}
                                <div className="min-w-0">
                                  <p className="text-xs text-green-400 font-medium uppercase tracking-wide">
                                    {docTypeLabels[file.docType] ||
                                      file.docType}
                                  </p>
                                  <p className="text-sm text-white truncate">
                                    {file.fileName}
                                  </p>
                                </div>
                              </div>
                              <Download className="w-4 h-4 text-gray-500 shrink-0" />
                            </a>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No documents uploaded.
                      </p>
                    )}
                  </SectionCard>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}