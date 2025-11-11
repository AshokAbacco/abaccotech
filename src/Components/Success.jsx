import React from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-6">
      <div className="bg-gray-800 shadow-xl rounded-2xl p-10 text-center max-w-md w-full">
        
        <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4 animate-bounce" />
        
        <h1 className="text-3xl font-bold mb-4">Payment Successful ✅</h1>
        
        <p className="text-gray-300 mb-6">
          Thank you for your purchase! Our team will contact you soon.
        </p>

        <Link
          to="/"
          className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-lg transition-all block"
        >
          Go to Home
        </Link>

        <a
          href="https://wa.me/919972452044?text=I%20completed%20my%20payment"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block text-green-400 underline hover:text-green-300"
        >
          Message us on WhatsApp 📩
        </a>

      </div>
    </div>
  );
};

export default Success;
