"use client";
import React, {Suspense} from "react";

import { useEffect,useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

function DeletePage() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  
  // 
  const [tokenVerified, setTokenVerified] = useState(false);

  useEffect(() => {
      const verifyToken = async () => {
        const token = searchParams?.get("token");
        if (!token) {
          router.push("/error"); // Redirect to an error page
          return;
        }
  
        try {
          setLoading(true);
          const response = await axios.delete(
            `https://ican-api-6000e8d06d3a.herokuapp.com/api/users/confirm-account-deletion/${token}`
          );
          console.log("Token verification response:", response.data);
          if (response.status === 200 || response.data.message === "Account deletion confirmed") {  
            setTokenVerified(true);
            toast({
              title: "Account Deletion Confirmed",
              description: "we are sorry to see you go.",
              variant: "default",
              duration: 2000,
            });
            console.log("Setting tokenVerified to true");
            setTokenVerified(true);
          } else {
            throw new Error("Token verification failed.");
          }
        } catch (error) {
          console.error("Token verification error:", error);
          toast({
            title: "Verification Failed",
            description: "Invalid or expired token.",
            variant: "destructive",
            duration: 2000,
          });
          router.push("/error"); // Redirect to an error page
        } finally {
          setLoading(false);
        }
      };
  
      verifyToken();
    }, [searchParams, router, toast]);

  const handleGoBack = () => {


    router.push("/"); // Redirect to the home page or any other relevant page
  };


  if (!tokenVerified) {
      return (
        <div className="m-auto flex flex-col items-center justify-center">
          <p className="text-center text-gray-600">Verifying token...</p>
        </div>
      );
    }

  return (


    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Account Deletion was successful</h1>
        <h3 className="text-lg font-bold text-gray-700 mb-4">Data Retention Notice</h3>
        <p className="text-gray-600 mb-6">
        Your data may be retained for 365 days in accordance with our terms and privacy policy.
        </p>
        <button
          onClick={handleGoBack}
          className="px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition"
        >
          Go to home
        </button>
      </div>
    </div>
 
  );
}

export default DeletePage;
