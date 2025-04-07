
"use client";

import React from "react";
import { useState, useEffect } from "react";
import { BiodataFormData } from "../homecomps/Biodata";
import { useToast } from "@/hooks/use-toast";
import { FlutterWaveButton } from 'flutterwave-react-v3';

interface PaymentProps {
  isShown: boolean;
  formData: BiodataFormData;
  updateFormData: (data: Partial<BiodataFormData>) => void;
}

function Payment({ formData, updateFormData }: PaymentProps) {
  const { toast } = useToast();
  const userEmail = localStorage.getItem("userEmail") || "";

  const handleFlutterwavePayment = () => {
    const config = {
      public_key: process.env.FLW_PUBLIC_KEY || "FLWPUBK_TEST-534b5997be3928deed468163ca379112-X",
      tx_ref: Date.now().toString(),
      amount: formData.payment?.amount || 25000, // Use dynamic amount from formData or fallback to 25000
      currency: 'NGN',
      payment_options: 'card,banktransfer,ussd',
      customer: {
        email: userEmail,
        name: `${formData.personalData.firstName || ""} ${formData.personalData.surname || ""}`,
        phonenumber: formData.contactDetails.mobileNumber || ""
      },
      customizations: {
        title: "Registration Payment",
        description: "Payment for registration completion",
        logo: "", // Add your logo URL here if needed
      },
    };

    return config;
  };

  return (
    <div className="pt-4 flex flex-col justify-between gap-4 mt-4">
      <h3 className="font-bold font-mono text-xl text-black">
        PAYMENT <hr />
      </h3>

      <p>To complete your registration, you need to make payments</p>


      {/* Payment button */}
      <FlutterWaveButton
        {...handleFlutterwavePayment()}
        callback={(response) => {
          if (response.status === "successful") {
            // Important: Update payment status to enable the Finish button
            updateFormData({ isPaymentSuccessful: true });
            toast({
              title: "Payment Successful",
              description: "You can now finish your registration.",
              variant: "default",
              duration: 3000,
            });
          } else {
            toast({
              title: "Payment Failed",
              description: "Something went wrong. Please try again.",
              variant: "destructive",
              duration: 3000,
            });
          }
        }}
        onClose={() => {
          console.log("Payment closed");
          toast({
            title: "Payment Cancelled",
            description: "You cancelled the payment process.",
            variant: "default",
            duration: 3000,
          });
        }}
        text={`Pay ₦${formData.payment?.amount?.toLocaleString() || "25,000"}`}
        className={`w-full py-2 px-4 rounded-full ${
          formData.isPaymentSuccessful
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white transition duration-300 mb-4`}
        disabled={formData.isPaymentSuccessful}

      />

      {/* Payment status message */}
      {formData.isPaymentSuccessful ? (
        <div className="text-green-500 text-sm text-center font-medium">
          Payment completed successfully. Click "Finish" to complete registration.
        </div>
      ) : (
        <div className="text-orange-500 text-sm text-center">
          You must complete payment before you can finish registration.
        </div>
      )}
    </div>
  );
}

export default Payment;