
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



// "use client";

// import React from "react";
// import { BiodataFormData } from "../homecomps/Biodata";
// import { useToast } from "@/hooks/use-toast";
// import FlutterModal from "../genui/FlutterModal";

// interface PaymentProps {
//   isShown: boolean;
//   formData: BiodataFormData;
//   updateFormData: (data: Partial<BiodataFormData>) => void;
//   onClose: () => void; 
// }

// function Payment({ formData, updateFormData }: PaymentProps) {
//   const { toast } = useToast();
//   const userEmail = localStorage.getItem("userEmail") || "";
  
//   // Prepare user details for payment
//   const userName = `${formData.personalData.firstName || ""} ${formData.personalData.surname || ""}`;
//   const userPhone = formData.contactDetails.mobileNumber || "";
//   const paymentAmount = formData.payment?.amount || 25000;

//   return (
//     <div className="pt-4 flex flex-col justify-between gap-4 mt-4">
//       <h3 className="font-bold font-mono text-xl text-black">
//         PAYMENT <hr />
//       </h3>

//       <p>To complete your registration, you need to make payments</p>

//       {/* Payment button using reusable FlutterModal component */}
//       <FlutterModal
//         amount={paymentAmount}
//         email={userEmail}
//         // email="adesewaa@gmail.com"
//         phoneNumber={userPhone}
//         name={userName}
//         title="Registration Payment"
//         description="Payment for registration completion"
//         paymentType="Registration"
//         buttonText={`Pay ₦${paymentAmount.toLocaleString() || "25,000"}`}
//         disabled={formData.isPaymentSuccessful}
//         buttonClassName={`w-full py-2 px-4 rounded-full ${
//           formData.isPaymentSuccessful
//             ? "bg-gray-400 cursor-not-allowed"
//             : "bg-blue-600 hover:bg-blue-700"
//         } text-white transition duration-300 mb-4`}
//         onSuccess={(response) => {
//           // Update payment status to enable the Finish button
//           updateFormData({ isPaymentSuccessful: true });
//           toast({
//             title: "Registration Payment Successful",
//             description: "You can now finish your registration.",
//             variant: "default",
//             duration: 3000,
//           });
//         }}
//         onFailure={() => {
//           toast({
//             title: "Payment Failed",
//             description: "Something went wrong. Please try again.",
//             variant: "destructive",
//             duration: 3000,
//           });
//         }}
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











// "use client";

// import React, { useState, useEffect } from "react";
// import { BiodataFormData } from "../homecomps/Biodata";
// import { useToast } from "@/hooks/use-toast";
// import FlutterModal from "../genui/FlutterModal";
// import axios from "axios";

// interface BillingItem {
//   id: string;
//   name: string;
//   amount: number;
//   createdAt: string;
//   autoApply: boolean;
//   createdById: string;
//   nextDueDate: string | null;
//   description: string | null;
//   frequency: string;
//   nextBillingAt: string | null;
// }

// interface BillingResponse {
//   data: BillingItem[];
// }

// interface PaymentProps {
//   isShown: boolean;
//   formData: BiodataFormData;
//   updateFormData: (data: Partial<BiodataFormData>) => void;
//   onClose: () => void;
// }

// function Payment({ formData, updateFormData }: PaymentProps) {
//   const { toast } = useToast();
//   const [billingInfo, setBillingInfo] = useState<BillingItem | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [waiverCode, setWaiverCode] = useState("");
//   const [isApplyingWaiver, setIsApplyingWaiver] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState<"payment" | "waiver">("payment");
  
//   const userEmail = localStorage.getItem("userEmail") || "";
//   const userName = `${formData.personalData.firstName || ""} ${formData.personalData.surname || ""}`;
//   const userPhone = formData.contactDetails.mobileNumber || "";
//   const token = localStorage.getItem("token") || "";

//   // Fetch billing information
//   useEffect(() => {
//     const fetchBillingInfo = async () => {
//       try {
//         setIsLoading(true);
//         const response = await axios.get<BillingResponse>(
//           "https://ican-api-6000e8d06d3a.herokuapp.com/api/billing",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//               Accept: "application/json",
//             },
//           }
//         );

//         // Find the registration fee item
//         const registrationFee = response.data.data.find(
//           (item) => item.name === "Registration Fee"
//         );

//         if (registrationFee) {
//           setBillingInfo(registrationFee);
//           // Update the form data with the billing ID and amount
//           updateFormData({
//             payment: {
//               amount: registrationFee.amount,
//               billingId: registrationFee.id,
//             },
//           });
//         } else {
//           toast({
//             title: "Billing Information Not Found",
//             description: "Could not find registration fee information. Using default amount.",
//             variant: "destructive",
//             duration: 3000,
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching billing information:", error);
//         // toast({
//         //   title: "Error",
//         //   description: "Failed to fetch billing information. Using default amount.",
//         //   variant: "destructive",
//         //   duration: 3000,
//         // });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchBillingInfo();
//   }, [toast, token, updateFormData]);

//   const handleWaiverCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setWaiverCode(e.target.value);
//   };

//   const applyWaiverCode = async () => {
//     if (!waiverCode.trim()) {
//       toast({
//         title: "Waiver Code Required",
//         description: "Please enter a waiver code",
//         variant: "destructive",
//         duration: 3000,
//       });
//       return;
//     }

//     try {
//       setIsApplyingWaiver(true);
//       const response = await axios.post(
//         "https://ican-api-6000e8d06d3a.herokuapp.com/api/payments/apply-waiver",
//         // {
//         //   waiverCode: waiverCode,
//         //   billingId: billingInfo?.id || "",
//         // },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         toast({
//           title: "Waiver Applied Successfully",
//           description: "Your registration fee has been waived",
//           variant: "default",
//           duration: 3000,
//         });
        
//         // Update payment status to enable the Finish button
//         updateFormData({ isPaymentSuccessful: true });
//       } else {
//         toast({
//           title: "Invalid Waiver Code",
//           description: response.data.message || "The waiver code is invalid or has expired",
//           variant: "destructive",
//           duration: 3000,
//         });
//       }
//     } catch (error) {
//       console.error("Error applying waiver code:", error);
//       toast({
//         title: "Error",
//         description: axios.isAxiosError(error) && error.response?.data?.message
//           ? error.response.data.message
//           : "Failed to apply waiver code. Please try again.",
//         variant: "destructive",
//         duration: 3000,
//       });
//     } finally {
//       setIsApplyingWaiver(false);
//     }
//   };

//   return (
//     <div className="pt-4 flex flex-col justify-between gap-4 mt-4">
//       <h3 className="font-bold font-mono text-xl text-black">
//         PAYMENT <hr />
//       </h3>

//       <p>To complete your registration, you need to make payment or apply a waiver code</p>

//       {isLoading ? (
//         <div className="flex justify-center items-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//         </div>
//       ) : (
//         <>
//           {/* Payment method selection */}
//           <div className="flex flex-col sm:flex-row gap-4 mb-4">
//             <button
//               className={`flex-1 py-2 px-4 rounded-lg border-2 ${
//                 paymentMethod === "payment"
//                   ? "border-primary bg-primary text-white"
//                   : "border-gray-300 bg-white text-gray-700"
//               } transition duration-300`}
//               onClick={() => setPaymentMethod("payment")}
//               disabled={formData.isPaymentSuccessful}
//             >
//               Pay Registration Fee
//             </button>
//             <button
//               className={`flex-1 py-2 px-4 rounded-lg border-2 ${
//                 paymentMethod === "waiver"
//                   ? "border-primary bg-primary text-white"
//                   : "border-gray-300 bg-white text-gray-700"
//               } transition duration-300`}
//               onClick={() => setPaymentMethod("waiver")}
//               disabled={formData.isPaymentSuccessful}
//             >
//               Apply Waiver Code
//             </button>
//           </div>

//           {paymentMethod === "payment" ? (
//             <>
//               <div className="text-center mb-4">
//                 <div className="text-lg font-medium">Registration Fee</div>
//                 <div className="text-2xl font-bold text-primary">
//                   ₦{(billingInfo?.amount || 25000).toLocaleString()}
//                 </div>
//               </div>

//               {/* Payment button using reusable FlutterModal component */}
//               <FlutterModal
//                 amount={billingInfo?.amount || 25000}
//                 email={userEmail}
//                 phoneNumber={userPhone}
//                 name={userName}
//                 title="Registration Payment"
//                 description="Payment for registration completion"
//                 paymentType="Registration"
//                 billingId={billingInfo?.id || ""}  // Pass billing ID to the FlutterModal
//                 buttonText={`Pay ₦${(billingInfo?.amount || 25000).toLocaleString()}`}
//                 disabled={formData.isPaymentSuccessful}
//                 buttonClassName={`w-full py-3 px-4 rounded-full ${
//                   formData.isPaymentSuccessful
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-blue-600 hover:bg-blue-700"
//                 } text-white transition duration-300 mb-4`}
//                 onSuccess={(response) => {
//                   // Update payment status to enable the Finish button
//                   updateFormData({ isPaymentSuccessful: true });
//                   toast({
//                     title: "Registration Payment Successful",
//                     description: "You can now finish your registration.",
//                     variant: "default",
//                     duration: 3000,
//                   });
//                 }}
//                 onFailure={() => {
//                   toast({
//                     title: "Payment Failed",
//                     description: "Something went wrong. Please try again.",
//                     variant: "destructive",
//                     duration: 3000,
//                   });
//                 }}
//               />
//             </>
//           ) : (
//             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//               <h4 className="font-medium mb-2">Apply Waiver Code</h4>
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   value={waiverCode}
//                   onChange={handleWaiverCodeChange}
//                   placeholder="Enter waiver code"
//                   className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                   disabled={formData.isPaymentSuccessful || isApplyingWaiver}
//                 />
//                 <button
//                   onClick={applyWaiverCode}
//                   disabled={formData.isPaymentSuccessful || isApplyingWaiver || !waiverCode.trim()}
//                   className={`px-4 py-2 rounded-lg ${
//                     formData.isPaymentSuccessful || isApplyingWaiver || !waiverCode.trim()
//                       ? "bg-gray-400 cursor-not-allowed"
//                       : "bg-primary hover:bg-blue-700"
//                   } text-white transition duration-300`}
//                 >
//                   {isApplyingWaiver ? (
//                     <div className="flex items-center justify-center">
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                       <span>Applying...</span>
//                     </div>
//                   ) : (
//                     "Apply"
//                   )}
//                 </button>
//               </div>
//               <p className="text-sm text-gray-500 mt-2">
//                 If you have a waiver code, enter it above to bypass payment
//               </p>
//             </div>
//           )}

//           {/* Payment status message */}
//           {formData.isPaymentSuccessful ? (
//             <div className="text-green-500 text-sm text-center font-medium p-3 border border-green-200 bg-green-50 rounded-lg">
//               Payment requirement completed. Click "Finish" to complete registration.
//             </div>
//           ) : (
//             <div className="text-orange-500 text-sm text-center p-3 border border-orange-200 bg-orange-50 rounded-lg">
//               You must complete payment or apply a valid waiver code before you can finish registration.
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// export default Payment;



// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { BiodataFormData } from "../homecomps/Biodata";
// import { useToast } from "@/hooks/use-toast";
// import FlutterModal from "../genui/FlutterModal";
// import axios from "axios";

// interface BillingItem {
//   id: string;
//   name: string;
//   amount: number;
//   createdAt: string;
//   autoApply: boolean;
//   createdById: string;
//   nextDueDate: string | null;
//   description: string | null;
//   frequency: string;
//   nextBillingAt: string | null;
// }

// interface BillingResponse {
//   data: BillingItem[];
// }

// interface PaymentProps {
//   isShown: boolean;
//   formData: BiodataFormData;
//   updateFormData: (data: Partial<BiodataFormData>) => void;
//   onClose: () => void;
// }

// function Payment({ formData, updateFormData }: PaymentProps) {
//   const { toast } = useToast();
//   const [billingInfo, setBillingInfo] = useState<BillingItem | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [waiverCode, setWaiverCode] = useState("");
//   const [isApplyingWaiver, setIsApplyingWaiver] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState<"payment" | "waiver">("payment");
  
//   // Added to prevent multiple fetch calls
//   const dataFetched = useRef(false);
  
//   const userEmail = localStorage.getItem("userEmail") || "";
//   const userName = `${formData.personalData.firstName || ""} ${formData.personalData.surname || ""}`;
//   const userPhone = formData.contactDetails.mobileNumber || "";
//   const token = localStorage.getItem("token") || "";

//   // Fetch billing information
//   useEffect(() => {
//     // Prevent multiple fetch calls
//     if (dataFetched.current || !token) return;
    
//     const fetchBillingInfo = async () => {
//       try {
//         setIsLoading(true);
//         const response = await axios.get<BillingResponse>(
//           "https://ican-api-6000e8d06d3a.herokuapp.com/api/billing",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//               Accept: "application/json",
//             },
//           }
//         );

//         // Find the registration fee item
//         const registrationFee = response.data.data.find(
//           (item) => item.name === "Registration Fee"
//         );

//         if (registrationFee) {
//           setBillingInfo(registrationFee);
//           // Update the form data with the billing ID and amount
//           updateFormData({
//             payment: {
//               amount: registrationFee.amount,
//               billingId: registrationFee.id,
//             },
//           });
//         } else {
//           console.warn("Registration fee not found in API response");
//         }
        
//         dataFetched.current = true;
//       } catch (error) {
//         console.error("Error fetching billing information:", error);
//         if (axios.isAxiosError(error) && error.response?.status === 429) {
//           toast({
//             title: "Rate Limit Exceeded",
//             description: "Too many requests. Please wait a moment before trying again.",
//             variant: "destructive",
//             duration: 5000,
//           });
//         }
//         // Set a default value to prevent looping
//         dataFetched.current = true;
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchBillingInfo();
    
//     // Clean up function
//     return () => {
//       dataFetched.current = true;
//     };
//   }, [toast, token, updateFormData]);

//   const handleWaiverCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setWaiverCode(e.target.value);
//   };

//   const applyWaiverCode = async () => {
//     if (!waiverCode.trim()) {
//       toast({
//         title: "Waiver Code Required",
//         description: "Please enter a waiver code",
//         variant: "destructive",
//         duration: 3000,
//       });
//       return;
//     }

//     try {
//       setIsApplyingWaiver(true);
//       const response = await axios.post(
//         "https://ican-api-6000e8d06d3a.herokuapp.com/api/payments/apply-waiver",
//         {
//           code: waiverCode,
//           // billingId: billingInfo?.id || "",
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.status === 200 || response.status === 201 || response.data.message === "Waiver applied successfully, registration complete" || response.status === 204 || response.data.success) {
//         // First update the payment status
//         updateFormData({ isPaymentSuccessful: true });
        
//         // Then show the success toast
//         toast({
//           title: "Waiver Applied Successfully",
//           description: "Your registration fee has been waived",
//           variant: "default",
//           duration: 3000,
//         });
        
//         // Log to confirm the update was requested
//         console.log("Payment success status updated to true");
//       } else {
//         toast({
//           title: "Invalid Waiver Code",
//           description: response.data.message || "The waiver code is invalid or has expired",
//           variant: "destructive",
//           duration: 3000,
//         });
//       }
//     } catch (error) {
//       console.error("Error applying waiver code:", error);
//       toast({
//         title: "Error",
//         description: axios.isAxiosError(error) && error.response?.data?.message
//           ? error.response.data.message
//           : "Failed to apply waiver code. Please try again.",
//         variant: "destructive",
//         duration: 3000,
//       });
//     } finally {
//       setIsApplyingWaiver(false);
//     }
//   };

//   // Handle initial loading state with fallback
//   if (isLoading) {
//     return (
//       <div className="pt-4 flex flex-col justify-between gap-4 mt-4">
//         <h3 className="font-bold font-mono text-xl text-black">
//           PAYMENT <hr />
//         </h3>
//         <div className="flex justify-center items-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="pt-4 flex flex-col justify-between gap-4 mt-4">
//       <h3 className="font-bold font-mono text-xl text-black">
//         PAYMENT <hr />
//       </h3>

//       <p>To complete your registration, you need to make payment or apply a waiver code</p>

//       {/* Payment method selection */}
//       <div className="flex flex-col sm:flex-row gap-4 mb-4">
//         <button
//           className={`flex-1 py-2 px-4 rounded-lg border-2 ${
//             paymentMethod === "payment"
//               ? "border-primary bg-primary text-white"
//               : "border-gray-300 bg-white text-gray-700"
//           } transition duration-300`}
//           onClick={() => setPaymentMethod("payment")}
//           disabled={formData.isPaymentSuccessful}
//         >
//           Pay Registration Fee
//         </button>
//         <button
//           className={`flex-1 py-2 px-4 rounded-lg border-2 ${
//             paymentMethod === "waiver"
//               ? "border-primary bg-primary text-white"
//               : "border-gray-300 bg-white text-gray-700"
//           } transition duration-300`}
//           onClick={() => setPaymentMethod("waiver")}
//           disabled={formData.isPaymentSuccessful}
//         >
//           Apply Waiver Code
//         </button>
//       </div>

//       {paymentMethod === "payment" ? (
//         <>
//           <div className="text-center mb-4">
//             <div className="text-lg font-medium">Registration Fee</div>
//             <div className="text-2xl font-bold text-primary">
//               ₦{(billingInfo?.amount || 25000).toLocaleString()}
//             </div>
//           </div>

//           {/* Payment button using reusable FlutterModal component */}
//           <FlutterModal
//             amount={billingInfo?.amount || 25000}
//             email={userEmail}
//             phoneNumber={userPhone}
//             name={userName}
//             title="Registration Payment"
//             description="Payment for registration completion"
//             paymentType="Registration"
//             billingId={billingInfo?.id || ""}  // Pass billing ID to the FlutterModal
//             buttonText={`Pay ₦${(billingInfo?.amount || 25000).toLocaleString()}`}
//             disabled={formData.isPaymentSuccessful}
//             buttonClassName={`w-full py-3 px-4 rounded-full ${
//               formData.isPaymentSuccessful
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             } text-white transition duration-300 mb-4`}
//             onSuccess={(response) => {
//               // Update payment status to enable the Finish button
//               updateFormData({ isPaymentSuccessful: true });
//               toast({
//                 title: "Registration Payment Successful",
//                 description: "You can now finish your registration.",
//                 variant: "default",
//                 duration: 3000,
//               });
//             }}
//             onFailure={() => {
//               toast({
//                 title: "Payment Failed",
//                 description: "Something went wrong. Please try again.",
//                 variant: "destructive",
//                 duration: 3000,
//               });
//             }}
//           />
//         </>
//       ) : (
//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//           <h4 className="font-medium mb-2">Apply Waiver Code</h4>
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={waiverCode}
//               onChange={handleWaiverCodeChange}
//               placeholder="Enter waiver code"
//               className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//               disabled={formData.isPaymentSuccessful || isApplyingWaiver}
//             />
//             <button
//               onClick={applyWaiverCode}
//               disabled={formData.isPaymentSuccessful || isApplyingWaiver || !waiverCode.trim()}
//               className={`px-4 py-2 rounded-lg ${
//                 formData.isPaymentSuccessful || isApplyingWaiver || !waiverCode.trim()
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-primary hover:bg-blue-700"
//               } text-white transition duration-300`}
//             >
//               {isApplyingWaiver ? (
//                 <div className="flex items-center justify-center">
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                   <span>Applying...</span>
//                 </div>
//               ) : (
//                 "Apply"
//               )}
//             </button>
//           </div>
//           <p className="text-sm text-gray-500 mt-2">
//             If you have a waiver code, enter it above to bypass payment
//           </p>
//         </div>
//       )}

//       {/* Payment status message */}
//       {formData.isPaymentSuccessful ? (
//         <div className="text-green-500 text-sm text-center font-medium p-3 border border-green-200 bg-green-50 rounded-lg">
//           Payment requirement completed. Click "Finish" to complete registration.
//         </div>
//       ) : (
//         <div className="text-orange-500 text-sm text-center p-3 border border-orange-200 bg-orange-50 rounded-lg">
//           You must complete payment or apply a valid waiver code before you can finish registration.
//         </div>
//       )}
//     </div>
//   );
// }

// export default Payment;




//one kind solution
// "use client";

// import React, { useState, useEffect } from "react";
// import { BiodataFormData } from "../homecomps/Biodata";
// import { useToast } from "@/hooks/use-toast";
// import FlutterModal from "../genui/FlutterModal";
// import axios from "axios";

// interface BillingItem {
//   id: string;
//   name: string;
//   amount: number;
//   createdAt: string;
//   autoApply: boolean;
//   createdById: string;
//   nextDueDate: string | null;
//   description: string | null;
//   frequency: string;
//   nextBillingAt: string | null;
// }

// interface BillingResponse {
//   data: BillingItem[];
// }

// interface PaymentProps {
//   isShown: boolean;
//   formData: BiodataFormData;
//   updateFormData: (data: Partial<BiodataFormData>) => void;
//   onClose: () => void;
// }

// function Payment({ formData, updateFormData }: PaymentProps) {
//   const { toast } = useToast();
//   const [billingInfo, setBillingInfo] = useState<BillingItem | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [loadingError, setLoadingError] = useState<string | null>(null);
//   const [waiverCode, setWaiverCode] = useState("");
//   const [isApplyingWaiver, setIsApplyingWaiver] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState<"payment" | "waiver">("payment");
  
//   const userEmail = localStorage.getItem("userEmail") || "";
//   const userName = `${formData.personalData.firstName || ""} ${formData.personalData.surname || ""}`;
//   const userPhone = formData.contactDetails.mobileNumber || "";
  
//   // Default registration fee amount
//   const DEFAULT_AMOUNT = 25000;

//   useEffect(() => {
//     let isMounted = true;
//     const token = localStorage.getItem("token");
    
//     if (!token) {
//       setIsLoading(false);
//       setLoadingError("Authentication token not found. Please log in again.");
//       return;
//     }
    
//     const fetchBillingInfo = async () => {
//       try {
//         const response = await axios.get<BillingResponse>(
//           "https://ican-api-6000e8d06d3a.herokuapp.com/api/billing",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//               Accept: "application/json",
//             },
//             timeout: 10000, // Set a timeout to prevent hanging requests
//           }
//         );

//         if (!isMounted) return;

//         // Find the registration fee item
//         const registrationFee = response.data.data.find(
//           (item) => item.name === "Registration Fee"
//         );

//         if (registrationFee) {
//           setBillingInfo(registrationFee);
//           // Update the form data with the billing ID and amount
//           updateFormData({
//             payment: {
//               amount: registrationFee.amount,
//               billingId: registrationFee.id,
//             },
//           });
//         } else {
//           // Use default amount if registration fee not found
//           console.warn("Registration fee not found in API response, using default amount");
//           updateFormData({
//             payment: {
//               amount: DEFAULT_AMOUNT,
//               billingId: "",
//             },
//           });
//         }
//       } catch (error) {
//         if (!isMounted) return;
        
//                   console.error("Error fetching billing information:", error);
        
//         // Check specifically for rate limiting error
//         if (axios.isAxiosError(error) && error.response?.status === 429) {
//           setLoadingError("Too many requests to the server. Using default payment amount for now.");
          
//           // Show specific toast for rate limiting
//           toast({
//             title: "Server is busy",
//             description: "The server is currently handling too many requests. Using default payment information.",
//             variant: "destructive",
//             duration: 5000,
//           });
//         } else {
//           setLoadingError("Failed to load payment details. Using default amount.");
//         }
        
//         // Still update with default amount on error
//         updateFormData({
//           payment: {
//             amount: DEFAULT_AMOUNT,
//             billingId: "",
//           },
//         });
//       } finally {
//         if (isMounted) {
//           setIsLoading(false);
//         }
//       }
//     };

//     fetchBillingInfo();
    
//     // Clean up function
//     return () => {
//       isMounted = false;
//     };
//   }, [updateFormData]);

//   const handleWaiverCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setWaiverCode(e.target.value);
//   };

//   const applyWaiverCode = async () => {
//     if (!waiverCode.trim()) {
//       toast({
//         title: "Waiver Code Required",
//         description: "Please enter a waiver code",
//         variant: "destructive",
//         duration: 3000,
//       });
//       return;
//     }

//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast({
//         title: "Authentication Error",
//         description: "Please log in again to apply the waiver code",
//         variant: "destructive",
//         duration: 3000,
//       });
//       return;
//     }

//     try {
//       setIsApplyingWaiver(true);
//       const response = await axios.post(
//         "https://ican-api-6000e8d06d3a.herokuapp.com/api/payments/apply-waiver",
//         {
//           code: waiverCode,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//           timeout: 10000, // Set a timeout
//         }
//       );

//       // Check for successful response
//       if (response.status === 200 || response.status === 201 || response.status === 204) {
//         // Update payment status to enable the Finish button
//         updateFormData({ isPaymentSuccessful: true });
        
//         toast({
//           title: "Waiver Applied Successfully",
//           description: "Your registration fee has been waived",
//           variant: "default",
//           duration: 3000,
//         });
//       } else {
//         toast({
//           title: "Invalid Waiver Code",
//           description: response.data?.message || "The waiver code is invalid or has expired",
//           variant: "destructive",
//           duration: 3000,
//         });
//       }
//     } catch (error) {
//       console.error("Error applying waiver code:", error);
//       toast({
//         title: "Error",
//         description: axios.isAxiosError(error) && error.response?.data?.message
//           ? error.response.data.message
//           : "Failed to apply waiver code. Please try again.",
//         variant: "destructive",
//         duration: 3000,
//       });
//     } finally {
//       setIsApplyingWaiver(false);
//     }
//   };

//   // Always render content even if there's an error loading the billing info
//   // by using the default amount
//   const paymentAmount = billingInfo?.amount || DEFAULT_AMOUNT;
//   const billingId = billingInfo?.id || "";

//   return (
//     <div className="pt-4 flex flex-col justify-between gap-4 mt-4">
//       <h3 className="font-bold font-mono text-xl text-black">
//         PAYMENT <hr />
//       </h3>

//       <p>To complete your registration, you need to make payment or apply a waiver code</p>

//       {isLoading ? (
//         <div className="flex justify-center items-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//         </div>
//       ) : (
//         <>
//           {loadingError && (
//             <div className="text-yellow-600 text-sm p-3 border border-yellow-200 bg-yellow-50 rounded-lg mb-4">
//               {loadingError}
//             </div>
//           )}

//           {/* Payment method selection */}
//           <div className="flex flex-col sm:flex-row gap-4 mb-4">
//             <button
//               className={`flex-1 py-2 px-4 rounded-lg border-2 ${
//                 paymentMethod === "payment"
//                   ? "border-primary bg-primary text-white"
//                   : "border-gray-300 bg-white text-gray-700"
//               } transition duration-300`}
//               onClick={() => setPaymentMethod("payment")}
//               disabled={formData.isPaymentSuccessful}
//             >
//               Pay Registration Fee
//             </button>
//             <button
//               className={`flex-1 py-2 px-4 rounded-lg border-2 ${
//                 paymentMethod === "waiver"
//                   ? "border-primary bg-primary text-white"
//                   : "border-gray-300 bg-white text-gray-700"
//               } transition duration-300`}
//               onClick={() => setPaymentMethod("waiver")}
//               disabled={formData.isPaymentSuccessful}
//             >
//               Apply Waiver Code
//             </button>
//           </div>

//           {paymentMethod === "payment" ? (
//             <>
//               <div className="text-center mb-4">
//                 <div className="text-lg font-medium">Registration Fee</div>
//                 <div className="text-2xl font-bold text-primary">
//                   ₦{paymentAmount.toLocaleString()}
//                 </div>
//               </div>

//               {/* Payment button using FlutterModal component */}
//               <FlutterModal
//                 amount={paymentAmount}
//                 email={userEmail}
//                 phoneNumber={userPhone}
//                 name={userName}
//                 title="Registration Payment"
//                 description="Payment for registration completion"
//                 paymentType="Registration"
//                 billingId={billingId}
//                 buttonText={`Pay ₦${paymentAmount.toLocaleString()}`}
//                 disabled={formData.isPaymentSuccessful}
//                 buttonClassName={`w-full py-3 px-4 rounded-full ${
//                   formData.isPaymentSuccessful
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-blue-600 hover:bg-blue-700"
//                 } text-white transition duration-300 mb-4`}
//                 onSuccess={(response) => {
//                   updateFormData({ isPaymentSuccessful: true });
//                   toast({
//                     title: "Registration Payment Successful",
//                     description: "You can now finish your registration.",
//                     variant: "default",
//                     duration: 3000,
//                   });
//                 }}
//                 onFailure={() => {
//                   toast({
//                     title: "Payment Failed",
//                     description: "Something went wrong. Please try again.",
//                     variant: "destructive",
//                     duration: 3000,
//                   });
//                 }}
//               />
//             </>
//           ) : (
//             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//               <h4 className="font-medium mb-2">Apply Waiver Code</h4>
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   value={waiverCode}
//                   onChange={handleWaiverCodeChange}
//                   placeholder="Enter waiver code"
//                   className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                   disabled={formData.isPaymentSuccessful || isApplyingWaiver}
//                 />
//                 <button
//                   onClick={applyWaiverCode}
//                   disabled={formData.isPaymentSuccessful || isApplyingWaiver || !waiverCode.trim()}
//                   className={`px-4 py-2 rounded-lg ${
//                     formData.isPaymentSuccessful || isApplyingWaiver || !waiverCode.trim()
//                       ? "bg-gray-400 cursor-not-allowed"
//                       : "bg-primary hover:bg-blue-700"
//                   } text-white transition duration-300`}
//                 >
//                   {isApplyingWaiver ? (
//                     <div className="flex items-center justify-center">
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                       <span>Applying...</span>
//                     </div>
//                   ) : (
//                     "Apply"
//                   )}
//                 </button>
//               </div>
//               <p className="text-sm text-gray-500 mt-2">
//                 If you have a waiver code, enter it above to bypass payment
//               </p>
//             </div>
//           )}

//           {/* Payment status message */}
//           {formData.isPaymentSuccessful ? (
//             <div className="text-green-500 text-sm text-center font-medium p-3 border border-green-200 bg-green-50 rounded-lg">
//               Payment requirement completed. Click "Finish" to complete registration.
//             </div>
//           ) : (
//             <div className="text-orange-500 text-sm text-center p-3 border border-orange-200 bg-orange-50 rounded-lg">
//               You must complete payment or apply a valid waiver code before you can finish registration.
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// export default Payment;



// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { BiodataFormData } from "../homecomps/Biodata";
// import { useToast } from "@/hooks/use-toast";
// import FlutterModal from "../genui/FlutterModal";
// import axios from "axios";

// interface BillingItem {
//   id: string;
//   name: string;
//   amount: number;
//   createdAt: string;
//   autoApply: boolean;
//   createdById: string;
//   nextDueDate: string | null;
//   description: string | null;
//   frequency: string;
//   nextBillingAt: string | null;
// }

// interface BillingResponse {
//   data: BillingItem[];
// }

// interface PaymentProps {
//   isShown: boolean;
//   formData: BiodataFormData;
//   updateFormData: (data: Partial<BiodataFormData>) => void;
//   onClose: () => void;
// }

// function Payment({ formData, updateFormData }: PaymentProps) {
//   const { toast } = useToast();
//   const [billingInfo, setBillingInfo] = useState<BillingItem | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [waiverCode, setWaiverCode] = useState("");
//   const [isApplyingWaiver, setIsApplyingWaiver] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState<"payment" | "waiver">("payment");
  
//   // Added to prevent multiple fetch calls
//   const dataFetched = useRef(false);
  
//   const userEmail = localStorage.getItem("userEmail") || "";
//   const userName = `${formData.personalData.firstName || ""} ${formData.personalData.surname || ""}`;
//   const userPhone = formData.contactDetails.mobileNumber || "";
//   const token = localStorage.getItem("token") || "";

//   // Fetch billing information
//   useEffect(() => {
//     // Prevent multiple fetch calls
//     if (dataFetched.current || !token) return;
    
//     const fetchBillingInfo = async () => {
//       try {
//         setIsLoading(true);
//         const response = await axios.get<BillingResponse>(
//           "https://ican-api-6000e8d06d3a.herokuapp.com/api/billing",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//               Accept: "application/json",
//             },
//           }
//         );

//         // Find the registration fee item
//         const registrationFee = response.data.data.find(
//           (item) => item.name === "Registration Fee"
//         );

//         if (registrationFee) {
//           setBillingInfo(registrationFee);
//           // Update the form data with the billing ID and amount
//           updateFormData({
//             payment: {
//               amount: registrationFee.amount,
//               billingId: registrationFee.id,
//             },
//           });
//         } else {
//           console.warn("Registration fee not found in API response");
//         }
        
//         dataFetched.current = true;
//       } catch (error) {
//         console.error("Error fetching billing information:", error);
//         if (axios.isAxiosError(error) && error.response?.status === 429) {
//           toast({
//             title: "Rate Limit Exceeded",
//             description: "Too many requests. Please wait a moment before trying again.",
//             variant: "destructive",
//             duration: 5000,
//           });
//         }
//         // Set a default value to prevent looping
//         dataFetched.current = true;
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchBillingInfo();
    
//     // Clean up function
//     return () => {
//       dataFetched.current = true;
//     };
//   }, [toast, token, updateFormData]);

//   const handleWaiverCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setWaiverCode(e.target.value);
//   };

//   const applyWaiverCode = async () => {
//     if (!waiverCode.trim()) {
//       toast({
//         title: "Waiver Code Required",
//         description: "Please enter a waiver code",
//         variant: "destructive",
//         duration: 3000,
//       });
//       return;
//     }

//     try {
//       setIsApplyingWaiver(true);
//       const response = await axios.post(
//         "https://ican-api-6000e8d06d3a.herokuapp.com/api/payments/apply-waiver",
//         {
//           code: waiverCode,
//           // billingId: billingInfo?.id || "",
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.status === 200 || response.status === 201 || response.data.message === "Waiver applied successfully, registration complete" || response.status === 204 || response.data.success) {
//         // First update the payment status
//         updateFormData({ isPaymentSuccessful: true });
        
//         // Then show the success toast
//         toast({
//           title: "Waiver Applied Successfully",
//           description: "Your registration fee has been waived",
//           variant: "default",
//           duration: 3000,
//         });
        
//         // Log to confirm the update was requested
//         console.log("Payment success status updated to true");
//       } else {
//         toast({
//           title: "Invalid Waiver Code",
//           description: response.data.message || "The waiver code is invalid or has expired",
//           variant: "destructive",
//           duration: 3000,
//         });
//       }
//     } catch (error) {
//       console.error("Error applying waiver code:", error);
//       toast({
//         title: "Error",
//         description: axios.isAxiosError(error) && error.response?.data?.message
//           ? error.response.data.message
//           : "Failed to apply waiver code. Please try again.",
//         variant: "destructive",
//         duration: 3000,
//       });
//     } finally {
//       setIsApplyingWaiver(false);
//     }
//   };

//   // Handle initial loading state with fallback
//   if (isLoading) {
//     return (
//       <div className="pt-4 flex flex-col justify-between gap-4 mt-4">
//         <h3 className="font-bold font-mono text-xl text-black">
//           PAYMENT <hr />
//         </h3>
//         <div className="flex justify-center items-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="pt-4 flex flex-col justify-between gap-4 mt-4">
//       <h3 className="font-bold font-mono text-xl text-black">
//         PAYMENT <hr />
//       </h3>

//       <p>To complete your registration, you need to make payment or apply a waiver code</p>

//       {/* Payment method selection */}
//       <div className="flex flex-col sm:flex-row gap-4 mb-4">
//         <button
//           className={`flex-1 py-2 px-4 rounded-lg border-2 ${
//             paymentMethod === "payment"
//               ? "border-primary bg-primary text-white"
//               : "border-gray-300 bg-white text-gray-700"
//           } transition duration-300`}
//           onClick={() => setPaymentMethod("payment")}
//           disabled={formData.isPaymentSuccessful}
//         >
//           Pay Registration Fee
//         </button>
//         <button
//           className={`flex-1 py-2 px-4 rounded-lg border-2 ${
//             paymentMethod === "waiver"
//               ? "border-primary bg-primary text-white"
//               : "border-gray-300 bg-white text-gray-700"
//           } transition duration-300`}
//           onClick={() => setPaymentMethod("waiver")}
//           disabled={formData.isPaymentSuccessful}
//         >
//           Apply Waiver Code
//         </button>
//       </div>

//       {paymentMethod === "payment" ? (
//         <>
//           <div className="text-center mb-4">
//             <div className="text-lg font-medium">Registration Fee</div>
//             <div className="text-2xl font-bold text-primary">
//               ₦{(billingInfo?.amount || 25000).toLocaleString()}
//             </div>
//           </div>

//           {/* Payment button using reusable FlutterModal component */}
//           <FlutterModal
//             amount={billingInfo?.amount || 25000}
//             email={userEmail}
//             phoneNumber={userPhone}
//             name={userName}
//             title="Registration Payment"
//             description="Payment for registration completion"
//             paymentType="Registration"
//             billingId={billingInfo?.id || ""}  // Pass billing ID to the FlutterModal
//             buttonText={`Pay ₦${(billingInfo?.amount || 25000).toLocaleString()}`}
//             disabled={formData.isPaymentSuccessful}
//             buttonClassName={`w-full py-3 px-4 rounded-full ${
//               formData.isPaymentSuccessful
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             } text-white transition duration-300 mb-4`}
//             onSuccess={(response) => {
//               // Update payment status to enable the Finish button
//               updateFormData({ isPaymentSuccessful: true });
//               toast({
//                 title: "Registration Payment Successful",
//                 description: "You can now finish your registration.",
//                 variant: "default",
//                 duration: 3000,
//               });
//             }}
//             onFailure={() => {
//               toast({
//                 title: "Payment Failed",
//                 description: "Something went wrong. Please try again.",
//                 variant: "destructive",
//                 duration: 3000,
//               });
//             }}
//           />
//         </>
//       ) : (
//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//           <h4 className="font-medium mb-2">Apply Waiver Code</h4>
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={waiverCode}
//               onChange={handleWaiverCodeChange}
//               placeholder="Enter waiver code"
//               className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//               disabled={formData.isPaymentSuccessful || isApplyingWaiver}
//             />
//             <button
//               onClick={applyWaiverCode}
//               disabled={formData.isPaymentSuccessful || isApplyingWaiver || !waiverCode.trim()}
//               className={`px-4 py-2 rounded-lg ${
//                 formData.isPaymentSuccessful || isApplyingWaiver || !waiverCode.trim()
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-primary hover:bg-blue-700"
//               } text-white transition duration-300`}
//             >
//               {isApplyingWaiver ? (
//                 <div className="flex items-center justify-center">
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                   <span>Applying...</span>
//                 </div>
//               ) : (
//                 "Apply"
//               )}
//             </button>
//           </div>
//           <p className="text-sm text-gray-500 mt-2">
//             If you have a waiver code, enter it above to bypass payment
//           </p>
//         </div>
//       )}

//       {/* Payment status message */}
//       {formData.isPaymentSuccessful ? (
//         <div className="text-green-500 text-sm text-center font-medium p-3 border border-green-200 bg-green-50 rounded-lg">
//           Payment requirement completed. Click "Finish" to complete registration.
//         </div>
//       ) : (
//         <div className="text-orange-500 text-sm text-center p-3 border border-orange-200 bg-orange-50 rounded-lg">
//           You must complete payment or apply a valid waiver code before you can finish registration.
//         </div>
//       )}
//     </div>
//   );
// }

// export default Payment;





"use client";

import React, { useState, useEffect, useRef } from "react";
import { BiodataFormData } from "../homecomps/Biodata";
import { useToast } from "@/hooks/use-toast";
import FlutterModal from "../genui/FlutterModal";
import axios from "axios";

interface BillingItem {
  id: string;
  name: string;
  amount: number;
  createdAt: string;
  autoApply: boolean;
  createdById: string;
  nextDueDate: string | null;
  description: string | null;
  frequency: string; // This will be "ONE_TIME" etc.
  nextBillingAt: string | null;
}

// The API returns a direct array, not wrapped in a data property
interface BillingResponse extends Array<BillingItem> {}

interface PaymentProps {
  isShown: boolean;
  formData: BiodataFormData;
  updateFormData: (data: Partial<BiodataFormData>) => void;
  onClose: () => void;
}

function Payment({ formData, updateFormData }: PaymentProps) {
  const { toast } = useToast();
  const [billingInfo, setBillingInfo] = useState<BillingItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [waiverCode, setWaiverCode] = useState("");
  const [isApplyingWaiver, setIsApplyingWaiver] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"payment" | "waiver">("payment");
  
  // Added to prevent multiple fetch calls
  const dataFetched = useRef(false);
  
  const userEmail = localStorage.getItem("userEmail") || "";
  const userName = `${formData.personalData.firstName || ""} ${formData.personalData.surname || ""}`;
  const userPhone = formData.contactDetails.mobileNumber || "";
  const token = localStorage.getItem("token") || "";

  // Fetch billing information
  useEffect(() => {
    // Prevent multiple fetch calls
    if (dataFetched.current || !token) return;
    
    const fetchBillingInfo = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<BillingItem[]>(
          "https://ican-api-6000e8d06d3a.herokuapp.com/api/billing",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        // The API returns a direct array of billing items
        const billingData: BillingItem[] = response.data;
        
        // Validate that we received an array
        if (!Array.isArray(billingData)) {
          console.warn("Expected array but received:", response.data);
          throw new Error("Invalid response format");
        }

        // Find the registration fee item
        const registrationFee = billingData.find(
          (item) => item.name === "Registration Fee"
        );

        if (registrationFee) {
          setBillingInfo(registrationFee);
          // Update the form data with the billing ID and amount
          updateFormData({
            payment: {
              amount: registrationFee.amount,
              billingId: registrationFee.id,
            },
          });
        } else {
          console.warn("Registration fee not found in API response. Available items:", billingData.map(item => item.name));
          
          // Use the first billing item if available, or set default
          if (billingData.length > 0) {
            const firstBillingItem = billingData[0];
            setBillingInfo(firstBillingItem);
            updateFormData({
              payment: {
                amount: firstBillingItem.amount,
                billingId: firstBillingItem.id,
              },
            });
          } else {
            // Set default billing info
            setBillingInfo({
              id: "default-registration-fee",
              name: "Registration Fee",
              amount: 25000,
              createdAt: new Date().toISOString(),
              autoApply: false,
              createdById: "",
              nextDueDate: null,
              description: "Default registration fee",
              frequency: "one-time",
              nextBillingAt: null,
            });
            
            updateFormData({
              payment: {
                amount: 25000,
                billingId: "default-registration-fee",
              },
            });
          }
        }
        
        dataFetched.current = true;
      } catch (error) {
        console.error("Error fetching billing information:", error);
        
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 429) {
            toast({
              title: "Rate Limit Exceeded",
              description: "Too many requests. Please wait a moment before trying again.",
              variant: "destructive",
              duration: 5000,
            });
          } else if (error.response?.status === 404) {
            toast({
              title: "Billing Information Not Found",
              description: "Using default registration fee.",
              variant: "default",
              duration: 3000,
            });
          } else {
            toast({
              title: "Error Loading Billing Info",
              description: "Using default registration fee. Please contact support if this persists.",
              variant: "destructive",
              duration: 5000,
            });
          }
        }
        
        // Set default billing info on error
        setBillingInfo({
          id: "default-registration-fee",
          name: "Registration Fee",
          amount: 25000,
          createdAt: new Date().toISOString(),
          autoApply: false,
          createdById: "",
          nextDueDate: null,
          description: "Default registration fee",
          frequency: "one-time",
          nextBillingAt: null,
        });
        
        updateFormData({
          payment: {
            amount: 25000,
            billingId: "default-registration-fee",
          },
        });
        
        // Set a default value to prevent looping
        dataFetched.current = true;
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillingInfo();
    
    // Clean up function
    return () => {
      dataFetched.current = true;
    };
  }, [toast, token, updateFormData]);

  const handleWaiverCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWaiverCode(e.target.value);
  };

  const applyWaiverCode = async () => {
    if (!waiverCode.trim()) {
      toast({
        title: "Waiver Code Required",
        description: "Please enter a waiver code",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      setIsApplyingWaiver(true);
      const response = await axios.post(
        "https://ican-api-6000e8d06d3a.herokuapp.com/api/payments/apply-waiver",
        {
          code: waiverCode,
          // billingId: billingInfo?.id || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201 || response.data.message === "Waiver applied successfully, registration complete" || response.status === 204 || response.data.success) {
        // First update the payment status
        updateFormData({ isPaymentSuccessful: true });
        
        // Then show the success toast
        toast({
          title: "Waiver Applied Successfully",
          description: "Your registration fee has been waived",
          variant: "default",
          duration: 3000,
        });
        
        // Log to confirm the update was requested
        console.log("Payment success status updated to true");
      } else {
        toast({
          title: "Invalid Waiver Code",
          description: response.data.message || "The waiver code is invalid or has expired",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error applying waiver code:", error);
      toast({
        title: "Error",
        description: axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to apply waiver code. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsApplyingWaiver(false);
    }
  };

  // Handle initial loading state with fallback
  if (isLoading) {
    return (
      <div className="pt-4 flex flex-col justify-between gap-4 mt-4">
        <h3 className="font-bold font-mono text-xl text-black">
          PAYMENT <hr />
        </h3>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 flex flex-col justify-between gap-4 mt-4">
      <h3 className="font-bold font-mono text-xl text-black">
        PAYMENT <hr />
      </h3>

      <p>To complete your registration, you need to make payment or apply a waiver code</p>

      {/* Payment method selection */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <button
          className={`flex-1 py-2 px-4 rounded-lg border-2 ${
            paymentMethod === "payment"
              ? "border-primary bg-primary text-white"
              : "border-gray-300 bg-white text-gray-700"
          } transition duration-300`}
          onClick={() => setPaymentMethod("payment")}
          disabled={formData.isPaymentSuccessful}
        >
          Pay Registration Fee
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-lg border-2 ${
            paymentMethod === "waiver"
              ? "border-primary bg-primary text-white"
              : "border-gray-300 bg-white text-gray-700"
          } transition duration-300`}
          onClick={() => setPaymentMethod("waiver")}
          disabled={formData.isPaymentSuccessful}
        >
          Apply Waiver Code
        </button>
      </div>

      {paymentMethod === "payment" ? (
        <>
          <div className="text-center mb-4">
            <div className="text-lg font-medium">Registration Fee</div>
            <div className="text-2xl font-bold text-primary">
              ₦{(billingInfo?.amount || 25000).toLocaleString()}
            </div>
          </div>

          {/* Payment button using reusable FlutterModal component */}
          <FlutterModal
            amount={billingInfo?.amount || 25000}
            email={userEmail}
            phoneNumber={userPhone}
            name={userName}
            title="Registration Payment"
            description="Payment for registration completion"
            paymentType="Registration"
            billingId={billingInfo?.id || ""}  // Pass billing ID to the FlutterModal
            buttonText={`Pay ₦${(billingInfo?.amount || 25000).toLocaleString()}`}
            disabled={formData.isPaymentSuccessful}
            buttonClassName={`w-full py-3 px-4 rounded-full ${
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
        </>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium mb-2">Apply Waiver Code</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={waiverCode}
              onChange={handleWaiverCodeChange}
              placeholder="Enter waiver code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={formData.isPaymentSuccessful || isApplyingWaiver}
            />
            <button
              onClick={applyWaiverCode}
              disabled={formData.isPaymentSuccessful || isApplyingWaiver || !waiverCode.trim()}
              className={`px-4 py-2 rounded-lg ${
                formData.isPaymentSuccessful || isApplyingWaiver || !waiverCode.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-blue-700"
              } text-white transition duration-300`}
            >
              {isApplyingWaiver ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>Applying...</span>
                </div>
              ) : (
                "Apply"
              )}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            If you have a waiver code, enter it above to bypass payment
          </p>
        </div>
      )}

      {/* Payment status message */}
      {formData.isPaymentSuccessful ? (
        <div className="text-green-500 text-sm text-center font-medium p-3 border border-green-200 bg-green-50 rounded-lg">
          Payment requirement completed. Click "Finish" to complete registration.
        </div>
      ) : (
        <div className="text-orange-500 text-sm text-center p-3 border border-orange-200 bg-orange-50 rounded-lg">
          You must complete payment or apply a valid waiver code before you can finish registration.
        </div>
      )}
    </div>
  );
}

export default Payment;