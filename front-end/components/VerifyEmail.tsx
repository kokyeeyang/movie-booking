"use client"; // ✅ Ensures it's a client component

import React, { useState, useEffect, useContext } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AppContext } from "../src/AppContext";

const VerifyPage = () => {
  const [error, setError] = useState(false);
  const searchParams = useSearchParams();
  const appContext = useContext(AppContext);

  const isLoading = appContext?.isLoading;
  const backendDomain =
    appContext?.backendDomain || process.env.NEXT_PUBLIC_BACKEND_URL || "https://localhost:5000";

  const verifyToken = async () => {
    try {
      const response = await fetch(`${backendDomain}/api/v1/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationToken: searchParams.get("token"),
          email: searchParams.get("email"),
        }),
      });

      if (!response.ok) throw new Error("Verification failed");
    } catch (error) {
      setError(true);
      console.error("Verification error:", error);
    }
  };

  useEffect(() => {
    console.log("Verifying token now...");
    verifyToken();
  }, [isLoading]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center">
        {error ? (
          <h4 className="text-red-600 text-lg font-semibold">
            There was an error, please double-check your verification link.
          </h4>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-800">Account Confirmed</h2>
            <Link href="/login">
              <span className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
                Proceed to Login
              </span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyPage;
