
// "use client";

// import React from "react";
// import { useState, useEffect } from "react";
// import { BiodataFormData } from "../homecomps/Biodata";
// import { useToast } from "@/hooks/use-toast";
// import { FlutterWaveButton } from 'flutterwave-react-v3';

// interface PaymentProps {
//   isShown: boolean;
//   formData: BiodataFormData;
//   updateFormData: (data: Partial<BiodataFormData>) => void;
//   onClose: () => void; 
// }

// function Payment({ formData, updateFormData, }: PaymentProps) {
//   const { toast } = useToast();
//   const userEmail = localStorage.getItem("userEmail") || "";

//   // const handleFlutterwavePayment = () => {
//   //   const config = {
//   //     public_key: process.env.FLW_PUBLIC_KEY || "FLWPUBK_TEST-534b5997be3928deed468163ca379112-X",
//   //     tx_ref: Date.now().toString(),
//   //     amount: formData.payment?.amount || 25000, // Use dynamic amount from formData or fallback to 25000
//   //     currency: 'NGN',
//   //     payment_options: 'card,banktransfer,ussd',
//   //     customer: {
//   //       email: userEmail,
//   //       name: `${formData.personalData.firstName || ""} ${formData.personalData.surname || ""}`,
//   //       phonenumber: formData.contactDetails.mobileNumber || ""
//   //     },
//   //     customizations: {
//   //       title: "Registration Payment",
//   //       description: "Payment for registration completion",
//   //       logo: "", // Add your logo URL here if needed
//   //     },
//   //   };

//   //   return config;
//   // };


//   const handleFlutterwavePayment = () => {
//     const config = {
//       public_key: process.env.FLW_PUBLIC_KEY || "FLWPUBK_TEST-534b5997be3928deed468163ca379112-X",
//       tx_ref: Date.now().toString(),
//       amount: formData.payment?.amount || 25000,
//       currency: 'NGN',
//       payment_options: 'card,banktransfer,ussd',
//       customer: {
//         email: userEmail,
//         name: `${formData.personalData.firstName || ""} ${formData.personalData.surname || ""}`,
//         phonenumber: formData.contactDetails.mobileNumber || ""
//       },
//       customizations: {
//         title: "Registration Payment",
//         description: "Payment for registration completion",
//         logo: "", // Add your logo URL here if needed
//       },
//       callback: function(response: any) {
//         // This function runs after payment completes
//         if (response.status === "successful") {
//           // Create payment data with transaction ID from response
//           const paymentData = {
//             paymentType: "Bank Transfer", // or determine dynamically based on user selection
//             amount: formData.payment?.amount || 25000,
//             transactionId: response.transaction_id,
//           };
          
//           // Call your API to record the payment
//           sendPaymentToApi(paymentData);
//         } else {
//           // Handle failed payment
//           console.error("Payment failed:", response);
//           // Show error message to user
//         }
//       },
//       onclose: function() {
//         // This runs when the payment modal is closed
//         console.log("Payment modal closed");
//       }
//     };

//     // Initialize Flutterwave payment
//     // FlutterwaveCheckout(config);
//     return config;
// };

// // Function to send payment data to your API
// const sendPaymentToApi = async (paymentData: any) => {
//   const token = localStorage.getItem("token");
        
//         if (!token) {
//           throw new Error("Authentication token not found");
//         }
//   try {
//     const apiResponse = await fetch("https://ican-api-6000e8d06d3a.herokuapp.com/api/payments", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//       },
//       body: JSON.stringify(paymentData),
//     });
    
//     if (!apiResponse.ok) {
//       throw new Error("API request failed");
//     }
    
//     const data = await apiResponse.json();
//     console.log("Payment recorded successfully:", data);
//     // Show success message to user
    
//   } catch (error) {
//     console.error("Error recording payment:", error);
//     // Show error message to user
//   }
// };
//   return (
//     <div className="pt-4 flex flex-col justify-between gap-4 mt-4">
//       <h3 className="font-bold font-mono text-xl text-black">
//         PAYMENT <hr />
//       </h3>

//       <p>To complete your registration, you need to make payments</p>


//       {/* Payment button */}
//       <FlutterWaveButton
//         {...handleFlutterwavePayment()}
//         callback={(response) => {
//           if (response.status === "successful") {
//             // Important: Update payment status to enable the Finish button
//             updateFormData({ isPaymentSuccessful: true });
//             toast({
//               title: "Payment Successful",
//               description: "You can now finish your registration.",
//               variant: "default",
//               duration: 3000,
//             });
//           } else {
//             toast({
//               title: "Payment Failed",
//               description: "Something went wrong. Please try again.",
//               variant: "destructive",
//               duration: 3000,
//             });
//           }
//         }}
//         onClose={() => {
//           console.log("Payment closed");
//           // toast({
//           //   title: "Payment Cancelled",
//           //   description: "You cancelled the payment process.",
//           //   variant: "default",
//           //   duration: 3000,
//           // });
//         }}
//         text={`Pay ₦${formData.payment?.amount?.toLocaleString() || "25,000"}`}
//         className={`w-full py-2 px-4 rounded-full ${
//           formData.isPaymentSuccessful
//             ? "bg-gray-400 cursor-not-allowed"
//             : "bg-blue-600 hover:bg-blue-700"
//         } text-white transition duration-300 mb-4`}
//         disabled={formData.isPaymentSuccessful}

//       />

//       {/* Payment status message */}
//       {formData.isPaymentSuccessful ? (
//         <div className="text-green-500 text-sm text-center font-medium">
//           Payment completed successfully. Click "Finish" to complete registration.
//         </div>
//       ) : (
//         <div className="text-orange-500 text-sm text-center">
//           You must complete payment before you can finish registration.
//         </div>
//       )}
//     </div>
//   );
// }

// export default Payment;



"use client";

import React from "react";
import { BiodataFormData } from "../homecomps/Biodata";
import { useToast } from "@/hooks/use-toast";
import FlutterModal from "../genui/FlutterModal";

interface PaymentProps {
  isShown: boolean;
  formData: BiodataFormData;
  updateFormData: (data: Partial<BiodataFormData>) => void;
  onClose: () => void; 
}

function Payment({ formData, updateFormData }: PaymentProps) {
  const { toast } = useToast();
  const userEmail = localStorage.getItem("userEmail") || "";
  
  // Prepare user details for payment
  const userName = `${formData.personalData.firstName || ""} ${formData.personalData.surname || ""}`;
  const userPhone = formData.contactDetails.mobileNumber || "";
  const paymentAmount = formData.payment?.amount || 25000;

  return (
    <div className="pt-4 flex flex-col justify-between gap-4 mt-4">
      <h3 className="font-bold font-mono text-xl text-black">
        PAYMENT <hr />
      </h3>

      <p>To complete your registration, you need to make payments</p>

      {/* Payment button using reusable FlutterModal component */}
      <FlutterModal
        amount={paymentAmount}
        // email={userEmail}
        email="adesewaa@gmail.com"
        phoneNumber={userPhone}
        name={userName}
        title="Registration Payment"
        description="Payment for registration completion"
        paymentType="Registration"
        buttonText={`Pay ₦${paymentAmount.toLocaleString() || "25,000"}`}
        disabled={formData.isPaymentSuccessful}
        buttonClassName={`w-full py-2 px-4 rounded-full ${
          formData.isPaymentSuccessful
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white transition duration-300 mb-4`}
        onSuccess={(response) => {
          // Update payment status to enable the Finish button
          updateFormData({ isPaymentSuccessful: true });
          toast({
            title: "Registration Payment Successful",
            description: "You can now finish your registration.",
            variant: "default",
            duration: 3000,
          });
        }}
        onFailure={() => {
          toast({
            title: "Payment Failed",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
            duration: 3000,
          });
        }}
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











// "use client";
// import React, { useState } from "react";
// import { BiodataFormData } from "../homecomps/Biodata";
// import { useToast } from "@/hooks/use-toast";
// import { useFlutterwave } from "flutterwave-react-v3";
// import type { FlutterWaveResponse } from "flutterwave-react-v3/dist/types";

// interface PaymentProps {
//   isShown: boolean;
//   formData: BiodataFormData;
//   updateFormData: (data: Partial<BiodataFormData>) => void;
// }

// function Payment({ formData, updateFormData }: PaymentProps) {
//   const { toast } = useToast();
//   const userEmail = localStorage.getItem("userEmail") || "";
//   const [isProcessing, setIsProcessing] = useState(false);

//   // Flutterwave configuration
//   const config = {
//     public_key:
//       process.env.FLW_PUBLIC_KEY ||
//       "FLWPUBK_TEST-534b5997be3928deed468163ca379112-X",
//     tx_ref: Date.now().toString(),
//     amount: formData.payment?.amount || 25000,
//     currency: 'NGN',
//     payment_options: 'card,banktransfer,ussd',
//     customer: {
//       email: userEmail,
//       name: `${formData.personalData.firstName || ""} ${formData.personalData.surname || ""}`,
//       phone_number: formData.contactDetails.mobileNumber || ""
//     },
//     customizations: {
//       title: "Registration Payment",
//       description: "Payment for registration completion",
//       logo: "",
//     },
//   };

//   const handleFlutterPayment = useFlutterwave(config);

//   // Function to handle payment response and make API call
//   async function handlePaymentResponse(response: FlutterWaveResponse) {
//     console.log("Transaction Response:", response);
    
//     if (response.status === "successful") {
//       setIsProcessing(true);
      
//       try {
//         // Prepare payment data for your API
//         const paymentData = {
//           paymentType: "Bank Transfer",
//           amount: formData.payment?.amount || 25000,
//           transactionId: response.transaction_id,
//         };
        
//         // Get the auth token
//         const token = localStorage.getItem("token");
        
//         if (!token) {
//           throw new Error("Authentication token not found");
//         }
        
//         // Make API call with authentication
//         const apiResponse = await fetch("https://ican-api-6000e8d06d3a.herokuapp.com/api/payments", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`
//           },
//           body: JSON.stringify(paymentData),
//         });
        
//         const result = await apiResponse.json();
        
//         if (apiResponse.ok) {
//           // Update form data with payment information
//           updateFormData({ 
//             isPaymentSuccessful: true,
//           });
          
//           toast({
//             title: "Payment Successful",
//             description: "Payment has been confirmed. You can now finish your registration.",
//             variant: "default",
//             duration: 3000,
//           });
//         } else {
//           toast({
//             title: `Payment Verification Failed (${apiResponse.status})`,
//             description: result.message || "Your payment was received but verification failed. Please contact support with transaction ID: " + response.transaction_id,
//             variant: "destructive",
//             duration: 3000,
//           });
//         }
//       } catch (error) {
//         console.error("API error:", error);
//         toast({
//           title: "System Error",
//           description: "Your payment was processed but we couldn't update our records. Please contact support with transaction ID: " + response.transaction_id,
//           variant: "destructive",
//           duration: 3000,
//         });
//       } finally {
//         setIsProcessing(false);
//       }
//     } else {
//       toast({
//         title: "Payment Failed",
//         description: "The payment was not successful. Please try again.",
//         variant: "destructive",
//         duration: 3000,
//       });
//     }
//   }

//   return (
//     <div className="pt-4 flex flex-col justify-between gap-4 mt-4">
//       <h3 className="font-bold font-mono text-xl text-black">
//         PAYMENT <hr />
//       </h3>

//       <p>To complete your registration, you need to make payments</p>

//       {/* Payment button */}
//       <button
//         onClick={() => {
//           handleFlutterPayment({
//             callback: (response) => {
//               handlePaymentResponse(response);
//             },
//             onClose: () => {
//               toast({
//                 title: "Payment Cancelled",
//                 description: "You cancelled the payment process.",
//                 variant: "default",
//                 duration: 3000,
//               });
//             },
//           });
//         }}
//         disabled={formData.isPaymentSuccessful || isProcessing}
//         className={`w-full py-2 px-4 rounded-full ${
//           formData.isPaymentSuccessful || isProcessing
//             ? "bg-gray-400 cursor-not-allowed"
//             : "bg-blue-600 hover:bg-blue-700"
//         } text-white transition duration-300 mb-4`}
//       >
//         {isProcessing 
//           ? "Processing..." 
//           : formData.isPaymentSuccessful 
//             ? "Payment Completed" 
//             : `Pay ₦${formData.payment?.amount?.toLocaleString() || "25,000"}`}
//       </button>

//       {/* Payment status message */}
//       {formData.isPaymentSuccessful ? (
//         <div className="text-green-500 text-sm text-center font-medium">
//           Payment completed successfully. Click "Finish" to complete registration.
//         </div>
//       ) : (
//         <div className="text-orange-500 text-sm text-center">
//           You must complete payment before you can finish registration.
//         </div>
//       )}
//     </div>
//   );
// }

// export default Payment;