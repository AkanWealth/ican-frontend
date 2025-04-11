// "use client";
// import React from "react";
// import { useState, useEffect, useRef } from "react";
// import { BiodataFormData } from "../homecomps/Biodata";
// import InputEle from "../genui/InputEle";
// import { useToast } from "@/hooks/use-toast";
// import { FilePlus, FileText, X } from "lucide-react"; // Import FileText and X icons
// import FlutterModal from "@/components/genui/FlutterModal";
// import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';

// interface PaymentProps {
//   isShown: boolean;

//   formData: BiodataFormData;
//   updateFormData: (data: Partial<BiodataFormData>) => void;
// }

// function Payment({ formData, updateFormData }: PaymentProps) {
//   const { toast } = useToast();
//   const userEmail = localStorage.getItem("userEmail") || "";

//   const handleFlutterwavePayment = () => {
//     const config = {
//       public_key: process.env.FLW_PUBLIC_KEY || "FLWPUBK_TEST-534b5997be3928deed468163ca379112-X",
//       tx_ref: Date.now().toString(),
//       amount: formData.payment?.amount || 25000, // Use dynamic amount from formData or fallback to 25000
//       currency: 'NGN',
//       payment_options: 'card,banktransfer,ussd',
//       customer: {
//         email: userEmail,
//         name: `${formData.personalData.firstName || ""} ${formData.personalData.surname || ""}`,
//         phone_number: formData.contactDetails.mobileNumber || ""
//       },
//       customizations: {
//         title: "Registration Payment",
//         description: "Payment for registration completion",
//         logo: "", // Add your logo URL here if needed
//       },
//     };

//     return config;
//   };

//   // Payment option states
//   // const [paymentOption, setPaymentOption] = useState<string>("card");

//   // // File upload states
//   // const fileInputRef = useRef<HTMLInputElement>(null);
//   // const [uploadedFile, setUploadedFile] = useState<File | null>(null);
//   // const [fileName, setFileName] = useState<string>("");
//   // const [uploadState, setUploadState] = useState<
//   //   "idle" | "uploading" | "complete"
//   // >("idle");
//   // const [uploadProgress, setUploadProgress] = useState<number>(0);

//   // useEffect(() => {
//   //   if (formData.image) {
//   //     setUploadedFile(formData.image);
//   //     setFileName(formData.image.name);
//   //     setUploadState("complete");
//   //   }
//   // }, [formData.image]);

//   // const handleFileChange = (file: File) => {
//   //   // Check if the file is an acceptable type (image, PDF, or document)
//   //   const acceptedFileTypes = [
//   //     "image/",
//   //     "application/pdf",
//   //     "application/msword",
//   //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   //   ];

//   //   const isAcceptedType = acceptedFileTypes.some(
//   //     (type) =>
//   //       file.type.startsWith(type) ||
//   //       file.type === "application/vnd.ms-excel" ||
//   //       file.type ===
//   //         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//   //   );

//   //   if (!isAcceptedType) {
//   //     toast({
//   //       title: "",
//   //       description:
//   //         "Please upload an image, PDF or document file for your receipt",
//   //       variant: "destructive",
//   //       duration: 2000,
//   //     });
//   //     return;
//   //   }

//   //   if (file.size > 5 * 1024 * 1024) {
//   //     toast({
//   //       title: "",
//   //       description: "Receipt file must be less than 5MB",
//   //       variant: "destructive",
//   //       duration: 2000,
//   //     });
//   //     return;
//   //   }

//   //   // Set uploading state
//   //   // setUploadState("uploading");
//   //   // setUploadedFile(file);

//   //   // Simulate upload progress
//   //   // let progress = 0;
//   //   // const interval = setInterval(() => {
//   //   //   progress += 10;
//   //   //   setUploadProgress(progress);
//   //   //   if (progress >= 100) {
//   //   //     clearInterval(interval);
//   //   //     setUploadState("complete");
//   //   //     setFileName(file.name);
//   //   //     updateFormData({ image: file });
//   //   //   }
//   //   // }, 300);
//   // };

//   // const handleDrop = (e: React.DragEvent) => {
//   //   e.preventDefault();
//   //   const file = e.dataTransfer.files[0];
//   //   if (file) handleFileChange(file);
//   // };

//   // const removeFile = () => {
//   //   setUploadedFile(null);
//   //   setFileName("");
//   //   setUploadState("idle");
//   //   setUploadProgress(0);
//   //   updateFormData({ image: null });
//   // };

//   // Function to get appropriate icon based on file type
//   // const getFileIcon = (fileName: string) => {
//   //   const extension = fileName.split(".").pop()?.toLowerCase();
//   //   if (
//   //     ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension || "")
//   //   ) {
//   //     return <FileText size={20} className="text-blue-500" />;
//   //   } else if (extension === "pdf") {
//   //     return <FileText size={20} className="text-red-500" />;
//   //   } else if (["doc", "docx"].includes(extension || "")) {
//   //     return <FileText size={20} className="text-blue-700" />;
//   //   } else if (["xls", "xlsx"].includes(extension || "")) {
//   //     return <FileText size={20} className="text-green-600" />;
//   //   } else {
//   //     return <FileText size={20} className="text-gray-500" />;
//   //   }
//   // };

//   return (
//     <div className="pt-4 flex flex-col justify-between gap-4 mt-4">
//       <h3 className="font-bold font-mono text-xl text-black">
//         PAYMENT <hr />
//       </h3>

//       <p>To complete your registration, you need to make payments</p>

//       {/* Payment options */}
//       <FlutterWaveButton
//           {...handleFlutterwavePayment()}
//           callback={(response) => {
//             if (response.status === "successful") {
//               updateFormData({ isPaymentSuccessful: true }); // Update payment status
//               toast({
//                 title: "Payment Successful",
//                 description: "You can now finish your registration.",
//                 variant: "default",
//                 duration: 3000,
//               });
//             } else {
//               toast({
//                 title: "Payment Failed",
//                 description: "Something went wrong. Please try again.",
//                 variant: "destructive",
//                 duration: 3000,
//               });
//             }
//             closePaymentModal(); // Close the modal programmatically
//           }}
//           onClose={() => {
//             console.log("Payment closed");
//             toast({
//               title: "Payment Cancelled",
//               description: "You cancelled the payment process.",
//               variant: "default",
//               duration: 3000,
//             });
//           }}
//           text={`Pay ₦${formData.payment?.amount || "25,000"}`}
//           className={`w-full py-2 px-4 rounded-full ${
//             formData.isPaymentSuccessful
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-blue-600 hover:bg-blue-700"
//           } text-white transition duration-300 mb-4`}
//           disabled={formData.isPaymentSuccessful}
//         />
//     </div>
//       /* Weiver */

//       /* {paymentOption == "waiver" && (
//         <InputEle
//           id="waivercode"
//           placeholder="Enter waiver code"
//           type="text"
//           label="Enter waiver code"
//           onChange={() => {}}
//         />
//       //)} */
//   );
// }

// export default Payment;







"use client";
import React from "react";
import { useState, useEffect } from "react";
import { BiodataFormData } from "../homecomps/Biodata";
import { useToast } from "@/hooks/use-toast";
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';

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
        phone_number: formData.contactDetails.mobileNumber || ""
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
          closePaymentModal();
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