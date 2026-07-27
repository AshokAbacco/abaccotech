// src/Components/ReferralCodeBadge.jsx
import React, { useState } from "react";
import { Gift, Copy, Check } from "lucide-react";

export default function ReferralCodeBadge() {
  const [copied, setCopied] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const referralCode = user?.referralCode;

  if (!referralCode) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      title="Click to copy"
      className="group inline-flex items-center gap-3 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30 hover:border-green-500/60 rounded-2xl px-5 py-3 transition-all duration-300"
    >
      <div className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-xl shrink-0">
        <Gift className="w-4 h-4 text-white" />
      </div>
      <div className="text-left">
        <p className="text-[11px] text-gray-400 leading-none mb-1">
          Your Referral Code
        </p>
        <p className="text-white font-bold tracking-wide leading-none">
          {referralCode}
        </p>
      </div>
      <div className="ml-2 text-gray-400 group-hover:text-green-400 transition-colors">
        {copied ? (
          <span className="flex items-center gap-1 text-green-400 text-xs font-medium">
            <Check className="w-4 h-4" /> Copied
          </span>
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </div>
    </button>
  );
}