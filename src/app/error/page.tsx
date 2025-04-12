"use client";
import React from "react";
import { useRouter } from "next/navigation";

function ErrorPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/"); // Redirect to the home page or any other relevant page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Verification Failed</h1>
        <p className="text-gray-600 mb-6">
          The token is invalid or has expired. Please try again or contact support for assistance.
        </p>
        <button
          onClick={handleGoBack}
          className="px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;
