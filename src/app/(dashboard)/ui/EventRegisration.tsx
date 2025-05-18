"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  CalendarRange,
  MapPin,
  CalendarCheck,
  Copy,
  FilePlus,
  CircleAlert,
  ArrowLeft,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import SuccessModal from "./SuccessMessage";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { FlutterWaveButton } from "flutterwave-react-v3";
import { BASE_API_URL } from "@/utils/setter";
import apiClient from "@/services/apiClient";
import { parseCookies } from "nookies";
// import CertificateGenerator from "@/components/homecomps/CertificateGenerator";

const EventRegistration = () => {
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const router = useRouter();
  const [isRegistered, setIsRegistered] = useState(false);

  const [eventDetails, setEventDetails] = useState({
    id: "",
    topic: "",
    date: "",
    time: "",
    venue: "",
    eventFee: "",
    eventPayment: "",
    image: "",
    registeredNo: "",
    totalSpot: "",
    isFull: "",
  });
  useEffect(() => {

    const originalDate = new Date(searchParams?.get('date') || '');

    // Format date
    const formattedDate = originalDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    // Get event details from URL parameters
    setEventDetails({
      id: searchParams?.get('id') || '',
      time: searchParams?.get('time') || '',
      topic: searchParams?.get('topic') || '',
      date: formattedDate,
      venue: searchParams?.get('venue') || '',
      eventFee: searchParams?.get('eventFee') || '',
      eventPayment: searchParams?.get('eventPayment') || '',
      image: searchParams?.get('image') || "",
      registeredNo: searchParams?.get('registeredNo') || '',
      totalSpot: searchParams?.get('totalSpot') || '',
      isFull: searchParams?.get('isFull') || '',
    });
  }, [searchParams]);

  useEffect(() => {
    // Look for the checkUserRegistration function and update it:
    const checkUserRegistration = async () => {
      try {
        const cookies = parseCookies();
        const userDataCookie = cookies['user_data'];
        const userData = userDataCookie ? JSON.parse(userDataCookie) : null;
        const userId = userData?.id;
        console.log("userId", userId);
    
        if (!userId) throw new Error("User ID not found in cookies");
      
        const response = await apiClient.get(`/events/registrations/user-events/${userId}`);
        console.log("Registration response data:", response.data);
        
        // Check if response data is an array
        if (Array.isArray(response.data)) {
          // Check if the current user has registered for this specific event
          const registration = response.data.find(
            (event: any) => event.eventId === eventDetails.id && event.userId === userId
          );
          setIsRegistered(!!registration);
        } else if (response.data && typeof response.data === 'object') {
          // For single object response, check both eventId and userId
          const isUserRegistered = response.data.eventId === eventDetails.id && 
                                  response.data.userId === userId;
          setIsRegistered(isUserRegistered);
        } else {
          // No valid registration data
          setIsRegistered(false);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
              
          setIsRegistered(false);
        } else {
          console.error('Error checking registration:', error);
        }
      }
    };

    checkUserRegistration();
  }, [eventDetails.id]);

  const handleGoBack = () => {
    router.back();
  };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    paymentMethod: "",
    receipt: null as File | null,
  });

  const handleCardPayment = () => {
    setIsToastVisible(true);
    setIsPaymentSuccessful(true);
    toast({
      title: "Payment Successful",
      description: "You can proceed to submit your registration ",
      variant: "default",
      duration: 2000,
    });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const [bankDetails] = useState({
    bankName: "FirstBank",
    accountNumber: "2045417438",
    accountName: "ICAN Surulere & District Society",
  });

  const [isReceiptUploaded, setIsReceiptUploaded] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        receipt: file,
      }));
      setIsReceiptUploaded(true);
    }
  };

  const isFormValidAndToastVisible = () => {
    return (
      isFormValid() ||
      (isPaymentSuccessful && Number(eventDetails.eventFee) > 0) // Ensure payment is successful for paid events
    );
  };

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "email") {
      setEmailError("");
      // Validate email as user types
      if (value && !validateEmail(value)) {
        setEmailError("Invalid email address");
      }
    }
  };



  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    console.log("Form submission triggered"); // Debugging log
    console.log("Form data:", formData); // Debugging log
    console.log("Event details:", eventDetails); // Debugging log
    console.log("isPaymentSuccessful:", isPaymentSuccessful); // Debugging log
    console.log("isReceiptUploaded:", isReceiptUploaded); // Debugging log

    // Validate form before submission
    if (!isFormValid() && Number(eventDetails.eventFee) > 0) {
      console.log("Form is invalid for paid event"); // Debugging log
      console.log("isFormValid result:", isFormValid()); // Debugging log
      return;
    }

    if (!isNoFeeFormValid() && Number(eventDetails.eventFee) === 0) {
      console.log("Form is invalid for free event"); // Debugging log
      console.log("isNoFeeFormValid result:", isNoFeeFormValid()); // Debugging log
      return;
    }
     // Use the appropriate validation function based on event fee
  const isValid = Number(eventDetails.eventFee) > 0 
  ? isFormValid() 
  : isNoFeeFormValid();
  
if (!isValid) {
  console.log("Form validation failed"); // Debugging log
  return;
}


    try {
      console.log("Calling registerForEvent..."); // Debugging log
      await registerForEvent();
      console.log("Registration successful, opening modal..."); // Debugging log
      setIsModalOpen(true); // Show the success modal after successful registration
    } catch (error) {
      console.error("Submission error:", error);
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: "Unable to complete registration. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const isFormValid = () => {
    const result =
      formData.fullName &&
      formData.email &&
      isPaymentSuccessful; // Check if payment is successful
    console.log("isFormValid check:", result); // Debugging log
    return result;
  };

  const isNoFeeFormValid = () => {
    // Check if required fields are filled in
    const result = formData.fullName.trim() !== "" && 
                   formData.email.trim() !== "" && 
                   validateEmail(formData.email);
    
    console.log("isNoFeeFormValid check:", result); // Debugging log
    return result;
  };

  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // const registerForEvent = async () => {

  //   try {
  //     const eventId = eventDetails.id;
  //     console.log("eventId:", eventId); // Debugging log

  //     // Construct the payload
  //     const registrationPayload = {
  //       fullName: formData.fullName,
  //       email: formData.email,
  //       membership: "MEMBER", 
  //       proofOfPayment: isPaymentSuccessful ? "PAID" : "PENDING", // Set to "PAID" if payment is successful
  //     };

  //     console.log("Registration payload:", registrationPayload); // Debugging log

  //     // Send the payload to the endpoint
  //     const response = await axios.post(
  //       `${BASE_API_URL}/events/registrations/${eventId}/register`,
  //       registrationPayload,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure the token is stored in localStorage
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     console.log("Registration response:", response.data); // Debugging log

  //     // Only show the success modal if the response status is 200 or 201
  //     if (response.status === 200 || response.status === 201) {
  //       setIsModalOpen(true); // Open the success modal
  //     } else {
  //       console.error("Unexpected response status:", response.status);
  //       toast({
  //         title: "Registration Failed",
  //         description: "Unexpected response from the server. Please try again.",
  //         variant: "destructive",
  //         duration: 3000,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Registration failed:", error);
  //     console.error("Registration failed:", error);

  //     toast({
  //       title: "Registration Failed",
  //       description: "Unable to complete registration. Please try again.",
  //       variant: "destructive",
  //       duration: 3000,
  //     });
  //   }
  // };


  const registerForEvent = async () => {
    try {
      const eventId = eventDetails.id;
      console.log("eventId:", eventId); // Debugging log
  
      // Construct the payload
      const registrationPayload = {
        fullName: formData.fullName,
        email: formData.email,
        membership: "MEMBER", 
        proofOfPayment: Number(eventDetails.eventFee) > 0 
          ? (isPaymentSuccessful ? "PAID" : "PENDING") 
          : "FREE", // Set to "FREE" for free events
      };
  
      console.log("Registration payload:", registrationPayload); // Debugging log
      
      // Use the apiClient instead of direct axios call
      const response = await apiClient.post<any>(
        `/events/registrations/${eventId}/register/member`,
        registrationPayload
      );
  
      console.log("Registration response:", response); // Debugging log
  
      // Only show the success modal if we get a successful response
      setTimeout(() => {
        setIsModalOpen(true); // Open the success modal
      }, 2000);
      
      // setIsModalOpen(true); // Open the success modal
      setTimeout(() => {
        router.push("/Event");
      }, 2000);
      
      return response;
    } catch (error) {
      console.error("Registration failed:", error);
      
      toast({
        title: "Registration Failed",
        description: "Unable to complete registration. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      
      throw error;
    }
  };


  
  const handleFlutterwavePayment = () => {
    const config = {
      public_key:
        process.env.FLW_PUBLIC_KEY ||
        "FLWPUBK-cac4ae0f5ac66f6f072b049acd6cfc9e-X", // Replace with your actual public key
      tx_ref: Date.now().toString(),
      amount: Number(eventDetails.eventFee),
      currency: "NGN",
      payment_options: "card, banktransfer",
      customer: {
        email: formData.email,
        name: formData.fullName,
        phonenumber: "08012345678", // Replace with a valid phone number
      },
      customizations: {
        title: eventDetails.topic,
        description: "Event Registration Payment",
        logo: "https://your-logo-url.com/logo.png", // Replace with your logo URL
      },
    };

    return config;
  };
  
const isValidUrl = (url: any) => {
  try {
    if (!url) return false;
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

  return (
    <div className="py-2 px-4">
      <button
        onClick={handleGoBack}
        className="z-10 flex items-center justify-center 
        w-10 h-10 bg-white rounded-full shadow-md hover:bg-gray-100 
        transition-colors duration-300 group"
        aria-label="Go back"
      >
        <ArrowLeft
          className="w-6 h-6 text-gray-700 group-hover:text-gray-900 
          transition-colors duration-300"
        />
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-screen mt-2">
        {/* Left Column */}
        <div className="order-1 lg:order-1">
          <div
            className={`rounded-lg shadow-md p-6 ${
              Number(eventDetails.eventFee) > 0 ? "bg-white" : "bg-gray-100"
            }`}
          >
            <div className="flex items-center mb-4">
              <div
                className={`flex ${
                  Number(eventDetails.eventFee) > 0
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-200 text-gray-600"
                } px-3 py-1 rounded-full text-sm mr-2`}
              >
                <CalendarCheck
                  className={`w-5 h-5 mr-1 ${
                    Number(eventDetails.eventFee) > 0
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}
                />
                {Number(eventDetails.eventFee) > 0
                  ? "Paid Event"
                  : "Free Event"}
              </div>
            </div>

            <h1 className="font-Spartan text-3xl font-bold mb-4">
              {eventDetails.topic} - Understanding Accounting
            </h1>

            {eventDetails.image && isValidUrl(eventDetails.image) ? (
  <div className="relative h-80 mb-4 rounded-lg overflow-hidden">
    <Image
      src={eventDetails.image}
      alt={eventDetails.topic || "Event image"}
      fill
      className="w-full h-full object-cover"
    />
  </div>
) : (
  <div className="relative h-80 mb-4 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
    <p className="text-gray-500">No image available</p>
  </div>
)}
            <div className="mb-4">
              <div className="flex items-center mb-2 text-sm text-gray-500">
                <CalendarRange className="h-5 w-5 mr-2 text-gray-500" />
                <span>
                  {eventDetails.date} at {eventDetails.time}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                <span>{eventDetails.venue}</span>
              </div>
            </div>

            <p className="text-gray-600 text-base mb-4">
              Join us for an insightful evening focused on managing life's
              challenges and prioritizing mental well-being. Network, learn, and
              unwind in a supportive environment.
            </p>

            <div className="flex items-center text-sm mb-2 text-gray-500">
              <Users className="h-5 w-5 mr-2 text-gray-500" />
              <span>
                {eventDetails.registeredNo}/{eventDetails.totalSpot} registered
                people
              </span>
            </div>
          </div>
        </div>

      {/* Right Column */}
        <div className="order-2 lg:order-2">
        {isRegistered ? (
  <div className="text-center border border-gray-300 rounded-lg p-2 bg-gray-50">
    <div className="flex items-center justify-center">
      <CircleAlert className="w-6 h-6 text-red-500 mr-2" />
      <div>
        <h2 className="text-lg font-bold mb-2">
          You have already registered for this event.
        </h2>
        <p className="text-gray-600 text-xs">
          If you need to make changes, contact us at{" "}
          <a
            href="mailto:icansuruleredistrictsociety@gmail.com"
            className="text-blue-600 underline hover:text-blue-800"
          >
            icansuruleredistrictsociety@gmail.com
          </a>{" "}
          or call us at <span className="text-blue-600">+234 808 816 8895</span>.
        </p>
      </div>
    </div>
  </div>
) : (
            <>
              <p className="flex flex-row text-sm font-medium">
                Event fee - <span className='flex text-base text-primary'>₦{eventDetails.eventFee}</span>
              </p>
              <h2 className="text-2xl font-bold mb-2">Register for the Event</h2>
              <p className="text-gray-700 mb-6">Secure your spot by filling out the form below.</p>
              <p className="text-gray-800 text-sm mb-2 font-semibold">Personal Details</p>
              <hr className='mb-4 border-gray-500' />

              {Number(eventDetails.eventFee) > 0 ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Personal Details Section */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-2">
                      Full Name<span className='text-red-600 text-base mr-1'>*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your first and last name"
                      className="w-full px-3 py-2 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                      Email Address<span className='text-red-600'>*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className={`w-full px-3 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300'
                        } text-sm rounded-md focus:outline-none focus:ring-2 ${emailError ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                        }`}

                    />
                  </div>
                  {emailError && (
                    <div className="flex items-center mt-1">
                      <CircleAlert
                        className="w-4 h-4 text-red-500 mr-1"

                      />
                      <span className="text-red-500 text-sm">{emailError}</span>
                    </div>)}

                  {/* Payment Section */}
                  <div>
                    {/* <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Payment
                    </label>
                    <hr className='mb-4 border-gray-500' />
                    <p className="text-sm text-gray-600 mb-4">This event is paid, payment is required to register</p>

                    <label htmlFor="select" className="block text-sm font-medium text-gray-600 mb-6">
                      Select Payment Method<span className='text-red-600'>*</span>
                    </label>

                    <div className="flex gap-12 mb-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="card"
                          name="paymentMethod"
                          value="card"
                          required
                          checked={formData.paymentMethod === 'card'}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="card" className="text-sm text-gray-700">Card Payment</label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="bankTransfer"
                          name="paymentMethod"
                          value="bankTransfer"
                          required
                          checked={formData.paymentMethod === 'bankTransfer'}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="bankTransfer" className="text-sm text-gray-700">Bank Transfer</label>
                      </div>
                    </div> */}

                    
                      {/* {formData.paymentMethod === 'card' && ( */}
                        <FlutterWaveButton
                          {...handleFlutterwavePayment()}
                          callback={(response) => {
                            if (response.status === 'successful') {
                              setIsPaymentSuccessful(true); // Mark payment as successful
                              toast({
                                title: "Payment Successful",
                                description: "You can proceed to submit your registration",
                                variant: "default",
                                duration: 3000, // Ensure duration is long enough to be visible
                              });
                            } else {
                              toast({
                                title: "Payment Failed",
                                description: "Something went wrong. Please try again.",
                                variant: "destructive",
                                duration: 3000,
                              });
                            }
                            // closePaymentModal(); // Close the modal programmatically
                          }}
                          onClose={() => {
                            console.log('Payment closed');
                            // toast({
                            //   title: "Payment Cancelled",
                            //   description: "You cancelled the payment process.",
                            //   variant: "default",
                            //   duration: 3000,
                            // });
                          }}
                          text={`Pay ₦${eventDetails.eventFee}`}
                          className={`w-full py-2 px-4 rounded-full ${isPaymentSuccessful
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                          } text-white transition duration-300 mb-4`}
                          disabled={isPaymentSuccessful}
                        />
                      {/* )} */}
                

                    {/* {formData.paymentMethod === 'bankTransfer' && (
                      <div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="text-sm font-semibold mb-4">Account Details</h3>
                          <div className="space-y-4">
                            <div className='flex items-center space-x-6'>
                              <div className="flex items-center">
                                <Image
                                  src="/firstBankLogo.png"
                                  alt="FirstBank"
                                  width={90}
                                  height={70}
                                  className="object-contain"
                                />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm text-gray-600">Account Number</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg text-gray-600 font-semibold">
                                    {bankDetails.accountNumber}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(bankDetails.accountNumber)}
                                    className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                    title="Copy account number"
                                  >
                                    <Copy
                                      className={`w-4 h-4 ${copied ? 'text-green-500' : 'text-gray-400'}`}
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                    
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-600">Account Name</span>
                              <span className="text-sm text-gray-600 font-semibold">{bankDetails.accountName}</span>
                            </div>
                    
                            <div>
                              <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Upload your Receipt<span className='text-red-500'>*</span>
                              </label>
                              <div className="border-2 border-gray-400 rounded-lg p-10 text-center">
                                <input
                                  type="file"
                                  id="receipt"
                                  accept="image/*,.pdf"
                                  onChange={handleFileUpload}
                                  className="hidden"
                                />
                                <label
                                  htmlFor="receipt"
                                  className="cursor-pointer flex flex-col items-center"
                                >
                                  <FilePlus className="w-12 h-12 text-gray-800 mb-2" />
                                  <span className="text-sm text-gray-800">
                                    {isReceiptUploaded ? 'Receipt uploaded' : 'Click to add file or drag any attachment here'}
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )} */}
                    <button
                      type="submit"
                      className={`w-full py-2 rounded-full transition duration-300 ${isFormValidAndToastVisible()
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-blue-200 text-white cursor-not-allowed'
                        }`}
                      // onClick={(e) => {
                      //   e.preventDefault(); // Prevent default form submission
                      //   if (isFormValidAndToastVisible()) {
                      //     setIsModalOpen(true); // Open the success modal
                      //   }
                      // }}
                      disabled={!isFormValidAndToastVisible()} // Disable button if form is invalid
                    >
                      Submit Registration
                    </button>
                  </div>
                </form>
              ) : (
                // Simplified form for free events
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-2">
                      Full Name<span className='text-red-600'>*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your first and last name"
                      className="w-full px-3 py-2 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                      Email Address<span className='text-red-600'>*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className={`w-full px-3 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300'
                        } text-sm rounded-md focus:outline-none focus:ring-2 ${emailError ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                        }`}

                    />
                  </div>
                  {emailError && (
                    <div className="flex items-center mt-1">
                      <CircleAlert
                        className="w-4 h-4 text-red-500 mr-1"

                      />
                      <span className="text-red-500 text-sm">{emailError}</span>
                    </div>
                  )}
                  <button
                    type="submit"
                    className={`w-full py-2 rounded-full transition duration-300 bg-blue-600 hover:bg-blue-700 text-white`}
                    disabled={!isNoFeeFormValid()}
                  >
                    Submit Registration
                  </button>
                </form>
              )}

              <SuccessModal
                isOpen={isModalOpen}
                onClose={() => {
                  console.log("Closing modal..."); // Debugging log
                  setIsModalOpen(false);
                }}
                email={formData.email}
              />
            </>
          )}
      </div>
    </div>
    </div>
  );
};
export default EventRegistration;