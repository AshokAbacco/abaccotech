// \src\pages\dashboard\Vendors.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  X,
  CheckCircle2,
  Loader2,
  CreditCard,
  Landmark,
  Hash,
  MapPin,
  KeyRound,
  Paperclip,
  Lock,
} from "lucide-react";
import DashboardLayout from "../../Components/DashboardLayout";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const MAX_FILES = 10;
const MAX_SIZE_MB = 10;
const ACCEPTED_TYPES =
  ".jpg,.jpeg,.png,.webp,.gif,.pdf,.doc,.docx,.xls,.xlsx";
const SINGLE_DOC_TYPES = ".jpg,.jpeg,.png,.webp,.pdf";

/**
 * IMPORTANT: These field components are defined OUTSIDE the Vendors component.
 * Defining input components INSIDE a parent component's render body causes
 * React to re-create a brand-new component type on every keystroke/re-render,
 * which unmounts and remounts the <input>, wiping focus and the cursor
 * position after the first character. Keeping them outside (or using
 * React.memo) fixes the "loses focus after 2nd letter" bug.
 */
const InputField = ({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
  uppercase = false,
  disabled = false,
  helperText,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label} {required && <span className="text-green-500">*</span>}
    </label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        disabled={disabled}
        className={`w-full border rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 outline-none transition-colors ${
          disabled
            ? "bg-gray-900/30 border-gray-800 text-gray-400 cursor-not-allowed"
            : "bg-gray-900/60 border-gray-700 focus:border-green-500"
        } ${uppercase ? "uppercase" : ""}`}
        required={required}
      />
      {disabled && (
        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
      )}
    </div>
    {helperText && (
      <p className="text-xs text-gray-500 mt-1.5">{helperText}</p>
    )}
  </div>
);

const SingleDocUpload = ({ label, file, onPick, onRemove, inputRefLocal }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label} <span className="text-gray-500 font-normal">(optional upload)</span>
    </label>
    <div
      onClick={() => inputRefLocal.current?.click()}
      className="cursor-pointer flex items-center justify-between gap-3 rounded-xl border border-dashed border-gray-700 bg-gray-900/40 hover:border-green-500/60 px-4 py-3 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <Paperclip className="w-5 h-5 text-green-500 shrink-0" />
        {file ? (
          <div className="min-w-0">
            <p className="text-sm text-white truncate">{file.name}</p>
            <p className="text-xs text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-400">Click to attach a copy</p>
        )}
      </div>
      {file && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-gray-500 hover:text-red-400 transition-colors shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
    <input
      ref={inputRefLocal}
      type="file"
      accept={SINGLE_DOC_TYPES}
      onChange={onPick}
      className="hidden"
    />
  </div>
);

export default function Vendors() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    aadhaarNumber: "",
    panNumber: "",
    bankAccountNumber: "",
    bankName: "",
    ifscCode: "",
    branchName: "",
  });

  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [files, setFiles] = useState([]); // other/general documents

  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { type: "success" | "error", message }

  const inputRef = useRef(null);
  const aadhaarInputRef = useRef(null);
  const panInputRef = useRef(null);

  // 🟢 Pull name/email/phone from the logged-in account (set at register/login)
  // so the user doesn't have to retype what we already know.
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser) {
      setForm((prev) => ({
        ...prev,
        fullName: storedUser.username || "",
        email: storedUser.email || "",
        phone: storedUser.phone || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addFiles = (newFileList) => {
    const incoming = Array.from(newFileList);
    setStatus(null);

    setFiles((prevFiles) => {
      const combined = [...prevFiles];
      for (const file of incoming) {
        if (combined.length >= MAX_FILES) {
          setStatus({
            type: "error",
            message: `You can upload a maximum of ${MAX_FILES} files.`,
          });
          break;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
          setStatus({
            type: "error",
            message: `"${file.name}" exceeds the ${MAX_SIZE_MB}MB limit.`,
          });
          continue;
        }
        if (
          combined.some((f) => f.name === file.name && f.size === file.size)
        ) {
          continue;
        }
        combined.push(file);
      }
      return combined;
    });
  };

  const handleFileInput = (e) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const isImage = (file) => file.type.startsWith("image/");

  const handleSingleDocSelect = (e, setter) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setStatus({
        type: "error",
        message: `"${file.name}" exceeds the ${MAX_SIZE_MB}MB limit.`,
      });
      e.target.value = "";
      return;
    }
    setter(file);
    e.target.value = "";
  };

  const validateBeforeSubmit = () => {
    if (!form.fullName || !form.phone || !form.email) {
      return "Full name, phone, and email are required.";
    }
    if (form.aadhaarNumber && !/^\d{12}$/.test(form.aadhaarNumber)) {
      return "Aadhaar number must be exactly 12 digits.";
    }
    if (
      form.panNumber &&
      !/^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/.test(form.panNumber)
    ) {
      return "PAN number format is invalid (e.g. ABCDE1234F).";
    }
    if (
      form.ifscCode &&
      !/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(form.ifscCode)
    ) {
      return "IFSC code format is invalid (e.g. HDFC0001234).";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const validationError = validateBeforeSubmit();
    if (validationError) {
      setStatus({ type: "error", message: validationError });
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (aadhaarFile) data.append("aadhaarFile", aadhaarFile);
      if (panFile) data.append("panFile", panFile);
      files.forEach((file) => data.append("files", file));

      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/vendor`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: data,
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Something went wrong.");
      }

      setStatus({
        type: "success",
        message: "Vendor registration submitted successfully!",
      });
      setAadhaarFile(null);
      setPanFile(null);
      setFiles([]);
      // Keep fullName/email/phone as-is (still the logged-in user's account details)
      setForm((prev) => ({
        ...prev,
        aadhaarNumber: "",
        panNumber: "",
        bankAccountNumber: "",
        bankName: "",
        ifscCode: "",
        branchName: "",
      }));
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Failed to submit. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen text-white py-20 relative overflow-hidden">
        {/* Background glow accents matching site theme */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500/20 to-green-600/20 px-6 py-3 rounded-full border border-green-500/30 mb-6">
              <UploadCloud className="w-5 h-5 text-[#019101]" />
              <span className="text-sm font-medium text-gray-300">
                Vendor Onboarding
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Complete Your Vendor Details
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Your name, email, and phone number are pulled from your account.
              Just add your KYC and bank details to finish registering as a
              vendor.
            </p>
          </div>

          {/* Form Card */}
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-3xl border border-green-500/20 shadow-2xl p-6 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* ===== Basic Details (from account, read-only) ===== */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-l-4 border-green-500 pl-3">
                  Basic Details
                </h2>

                <InputField
                  icon={User}
                  label="Full Name"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  disabled
                  placeholder="Your full name"
                  helperText="Synced from your account"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    icon={Phone}
                    label="Phone Number"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    disabled
                    type="tel"
                    placeholder="+91 98765 43210"
                    helperText="Synced from your account"
                  />
                  <InputField
                    icon={Mail}
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    disabled
                    type="email"
                    placeholder="you@company.com"
                    helperText="Synced from your account"
                  />
                </div>
              </div>

              {/* ===== Identity Details (Aadhaar / PAN) ===== */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-l-4 border-green-500 pl-3">
                  Identity Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    icon={CreditCard}
                    label="Aadhaar Number"
                    name="aadhaarNumber"
                    value={form.aadhaarNumber}
                    onChange={handleChange}
                    placeholder="12-digit Aadhaar number"
                  />
                  <InputField
                    icon={CreditCard}
                    label="PAN Number"
                    name="panNumber"
                    value={form.panNumber}
                    onChange={handleChange}
                    placeholder="ABCDE1234F"
                    uppercase
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SingleDocUpload
                    label="Aadhaar Card Copy"
                    file={aadhaarFile}
                    onPick={(e) => handleSingleDocSelect(e, setAadhaarFile)}
                    onRemove={() => setAadhaarFile(null)}
                    inputRefLocal={aadhaarInputRef}
                  />
                  <SingleDocUpload
                    label="PAN Card Copy"
                    file={panFile}
                    onPick={(e) => handleSingleDocSelect(e, setPanFile)}
                    onRemove={() => setPanFile(null)}
                    inputRefLocal={panInputRef}
                  />
                </div>
              </div>

              {/* ===== Bank Details ===== */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-l-4 border-green-500 pl-3">
                  Bank Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    icon={Hash}
                    label="Account Number"
                    name="bankAccountNumber"
                    value={form.bankAccountNumber}
                    onChange={handleChange}
                    placeholder="Bank account number"
                  />
                  <InputField
                    icon={Landmark}
                    label="Bank Name"
                    name="bankName"
                    value={form.bankName}
                    onChange={handleChange}
                    placeholder="e.g. HDFC Bank"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    icon={KeyRound}
                    label="IFSC Code"
                    name="ifscCode"
                    value={form.ifscCode}
                    onChange={handleChange}
                    placeholder="HDFC0001234"
                    uppercase
                  />
                  <InputField
                    icon={MapPin}
                    label="Branch"
                    name="branchName"
                    value={form.branchName}
                    onChange={handleChange}
                    placeholder="Branch name / location"
                  />
                </div>
              </div>

              {/* ===== Other Documents ===== */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white border-l-4 border-green-500 pl-3">
                  Other Documents
                </h2>
                <label className="block text-sm font-medium text-gray-300 -mt-2">
                  Upload additional documents{" "}
                  <span className="text-gray-500 font-normal">
                    (images, PDF, Word, Excel — up to {MAX_FILES} files,{" "}
                    {MAX_SIZE_MB}MB each)
                  </span>
                </label>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                  className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
                    dragActive
                      ? "border-green-500 bg-green-500/10"
                      : "border-gray-700 bg-gray-900/40 hover:border-green-500/60"
                  }`}
                >
                  <UploadCloud className="w-10 h-10 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-300 font-medium">
                    Drag & drop files here, or{" "}
                    <span className="text-green-500 underline">browse</span>
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Single or multiple files supported
                  </p>
                  <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept={ACCEPTED_TYPES}
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file, idx) => (
                      <div
                        key={`${file.name}-${idx}`}
                        className="flex items-center justify-between bg-gray-900/60 border border-gray-700 rounded-xl px-4 py-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {isImage(file) ? (
                            <ImageIcon className="w-5 h-5 text-green-500 shrink-0" />
                          ) : (
                            <FileText className="w-5 h-5 text-green-500 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm text-white truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="text-gray-500 hover:text-red-400 transition-colors shrink-0 ml-3"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Message */}
              {status && (
                <div
                  className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
                    status.type === "success"
                      ? "bg-green-500/10 border border-green-500/30 text-green-400"
                      : "bg-red-500/10 border border-red-500/30 text-red-400"
                  }`}
                >
                  {status.type === "success" && (
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-green-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Vendor Application</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}