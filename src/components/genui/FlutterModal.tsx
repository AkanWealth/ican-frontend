// "use client";
// import React, { useState } from "react";
// import { useFlutterwave } from "flutterwave-react-v3";
// import { FlutterWaveResponse } from "flutterwave-react-v3/dist/types";

// interface TransactionDetails {
//   amount: number;
//   email: string;
//   phone_number: string;
//   name: string;
//   title: string;
// }

// function FlutterModal({
//   amount,
//   email,
//   phone_number,
//   name,
//   title,
// }: TransactionDetails) {
//   const config = {
//     public_key:
//       process.env.FLW_PUBLIC_KEY ||
//       "FLWPUBK_TEST-534b5997be3928deed468163ca379112-X",
//     tx_ref: Date.now().toString(),
//     amount: amount,
//     currency: "NGN",
//     payment_options: "card,mobilemoney,ussd",
//     customer: {
//       email: email,
//       phonenumber: phone_number,
//       name: name,
//     },
//     customizations: {
//       title: title,
//       description: "Pay to complete processes",
//       logo: "",
//     },
//   };

//   const handleFlutterPayment = useFlutterwave(config);

//   function setTransactionResponse(response: FlutterWaveResponse) {
//     console.log("Transaction Response:", response);
//     if (response.status === "successful") {
//       alert("Payment successful! Transaction ID: " + response.transaction_id);
//     } else {
//       alert("Payment failed. Please try again.");
//     }
//   }

//   // Removed duplicate function implementation

//   return (
//     <div>
//       <button
//         className="bg-blue-500 text-white p-2 rounded"
//         onClick={() => {
//           handleFlutterPayment({
//             callback: (response) => {
//               setTransactionResponse(response);
//               //   closePaymentModal(); // this will close the modal programmatically
//             },
//             onClose: () => {},
//           });
//         }}
//       >
//         Pay with Flutterwave
//       </button>
//     </div>
//   );
// }

// export default FlutterModal;



"use client";

import React from "react";
import { useFlutterwave } from "flutterwave-react-v3";
import { useToast } from "@/hooks/use-toast";

interface FlutterModalProps {
  amount: number;
  email: string;
  phoneNumber: string;
  name: string;
  title: string;
  description?: string;
  paymentType: string;
  onSuccess?: (response: any) => void;
  onFailure?: (response: any) => void;
  onClose?: () => void;
  buttonText?: string;
  buttonClassName?: string;
  disabled?: boolean;
}

function FlutterModal({
  amount,
  email,
  phoneNumber,
  name,
  title,
  description = "Payment for services",
  paymentType,
  onSuccess,
  onFailure,
  onClose,
  buttonText = "Pay Now",
  buttonClassName = "w-full py-2 px-4 rounded-full bg-primary hover:bg-blue-700 text-white transition duration-300",
  disabled = false
}: FlutterModalProps) {
  const { toast } = useToast();
  
  const config = {
    public_key: process.env.FLW_PUBLIC_KEY || "FLWPUBK_TEST-534b5997be3928deed468163ca379112-X",
    tx_ref: Date.now().toString(),
    amount: amount,
    currency: "NGN",
    payment_options: "card,banktransfer,ussd",
    customer: {
      email: email,
      phonenumber: phoneNumber,
      name: name,
    },
    customizations: {
      title: title,
      description: description,
      logo: "", // Add your logo URL here if needed
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePayment = () => {
    handleFlutterPayment({
      callback: (response) => {
        if (response.status === "successful") {
          // Create payment data with transaction ID from response
          const paymentData = {
            paymentType: paymentType,
            amount: amount,
            transactionId: response.transaction_id,
            status: "SUCCESS"
          };
          
          // Record the payment in your system
          sendPaymentToApi(paymentData);
          
          // Call success callback if provided
          if (onSuccess) {
            onSuccess(response);
          }
          
          toast({
            title: "Payment Successful",
            description: `Transaction ID: ${response.transaction_id}`,
            variant: "default",
            duration: 3000,
          });
        } else {
          // Handle failed payment
          console.error("Payment failed:", response);
          
          // Call failure callback if provided
          if (onFailure) {
            onFailure(response);
          }
          
          toast({
            title: "Payment Failed",
            description: "Something went wrong with your payment. Please try again.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
      onClose: () => {
        console.log("Payment modal closed");
        if (onClose) {
          onClose();
        }
      },
    });
  };

  // Function to send payment data to your API
  const sendPaymentToApi = async (paymentData: any) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "You are not logged in. Please login and try again.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    try {
      const apiResponse = await fetch("https://ican-api-6000e8d06d3a.herokuapp.com/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(paymentData),
      });
      
      if (!apiResponse.ok) {
        throw new Error("API request failed");
      }
      
      const data = await apiResponse.json();
      console.log("Payment recorded successfully:", data);
    } catch (error) {
      console.error("Error recording payment:", error);
      toast({
        title: "Server Error",
        description: "There was an error recording your payment. Please contact support.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <button
      className={buttonClassName}
      onClick={handlePayment}
      disabled={disabled}
    >
      {buttonText}
    </button>
  );
}

export default FlutterModal;