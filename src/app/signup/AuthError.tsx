import React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const AuthError = () => {
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for error in URL params
    const errorParam = searchParams.get("error");
    if (errorParam) {
      switch (errorParam) {
        case "no_code":
          setError("Authorization code not received from Google");
          break;
        case "auth_failed":
          setError("Authentication failed. Please try again.");
          break;
        default:
          setError("An error occurred during authentication");
      }
    }
  }, [searchParams]);

  return (
    <div>
      <div className="text-red-600">{error}</div>
    </div>
  );
};

export default AuthError;
