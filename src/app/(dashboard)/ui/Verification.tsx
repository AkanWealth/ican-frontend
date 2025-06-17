// "use client";
// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useToast } from "@/hooks/use-toast";
// import { useRouter, useSearchParams } from "next/navigation";
// import axios from "axios";

// function Verification() {
//   const { toast } = useToast();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: ""
//   });
//   const [emailError, setEmailError] = useState("");
//   const [passwordError, setPasswordError] = useState("");
//   const [tokenVerified, setTokenVerified] = useState(false);

//   useEffect(() => {
//     const verifyToken = async () => {
//       const token = searchParams?.get("token");
//       if (!token) {
//         router.push("/error"); // Redirect to an error page
//         return;
//       }

//       try {
//         setLoading(true);
//         const response = await axios.get(
//           `https://ican-api-6000e8d06d3a.herokuapp.com/api/users/verify-email/${token}`
//         );
//         console.log("Token verification response:", response.data);
//         if (response.status === 200 || response.data.message === "Email verified successfully") {
//           setTokenVerified(true);
//           toast({
//             title: "Verification Successful",
//             description: "You can now continue your registration.",
//             variant: "default",
//             duration: 2000,
//           });
//           console.log("Setting tokenVerified to true");
//           setTokenVerified(true);
//         } else {
//           throw new Error("Token verification failed.");
//         }
//       } catch (error) {
//         console.error("Token verification error:", error);
//         toast({
//           title: "Verification Failed",
//           description: "Invalid or expired token.",
//           variant: "destructive",
//           duration: 2000,
//         });
//         router.push("/error"); // Redirect to an error page
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyToken();
//   }, [searchParams, router, toast]);

//   const handleChange = (e: { target: { name: any; value: any } }) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const validateForm = () => {
//     let isValid = true;
    
//     // Reset errors
//     setEmailError("");
//     setPasswordError("");
    
//     // Validate email
//     if (!formData.email) {
//       setEmailError("Email is required");
//       isValid = false;
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       setEmailError("Please enter a valid email address");
//       isValid = false;
//     }
    
//     // Validate password
//     if (!formData.password) {
//       setPasswordError("Password is required");
//       isValid = false;
//     }
    
//     return isValid;
//   };

//   const handleSubmit = async (e: { preventDefault: () => void }) => {
//     e.preventDefault();
   
//     if (!validateForm()) {
//       toast({
//         title: "Login Failed",
//         description: "Please correct the errors in the form",
//         variant: "destructive",
//         duration: 2000,
//       });
//       return;
//     }

//     setLoading(true);

//     // Prepare data for API request
//     const data = JSON.stringify({
//       email: formData.email,
//       password: formData.password,
//     });

//     const config = {
//       method: "post",
//       maxBodyLength: Infinity,
//       url: "https://ican-api-6000e8d06d3a.herokuapp.com/api/auth/login", // Update with the correct login endpoint
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       data: data,
//     };

//     try {
//       const response = await axios.request(config);
//       const { user, refresh_token } = response.data;
      
//       console.log("User logged in successfully:", user);
//       console.log("Access token:", refresh_token);
      
//       // Store the token in localStorage or cookies for future authenticated requests
//       localStorage.setItem("token", refresh_token);
//       localStorage.setItem("user", user);
//       // localStorage.setItem("userId", user.id);
//       localStorage.setItem("userName", user.firstname);
//       localStorage.setItem("userEmail", user.email);
//       localStorage.setItem("memberId", user.membershipId);

//       console.log("User logged in successfully:", user);
//       console.log("memberID:", user.membershipId);

      
      
//       toast({
//         title: "Login Successful",
//         description: "Continue your registration process. It won't take long",
//         variant: "default",
//         duration: 2000,
//       });
//       router.push("/registration");
      
//     } catch (error) {
//       console.error("Login error:", error);
      
//       let errorMessage = "An error occurred during login.";
//       if (axios.isAxiosError(error) && error.response) {
//         errorMessage = error.response.data.message || errorMessage;
//       }
      
//       toast({
//         title: "Login Failed",
//         description: errorMessage,
//         variant: "destructive",
//         duration: 2000,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // if (!tokenVerified) {
//   //   return (
//   //     <div className="m-auto flex flex-col items-center justify-center">
//   //       <p className="text-center text-gray-600">Verifying token...</p>
//   //     </div>
//   //   );
//   // }

//   return (
//     <div className="m-auto flex flex-col items-center justify-center">
//       {!tokenVerified ? (
//       <div className="flex flex-col items-center p-8">
//         <p className="text-center text-gray-600">Verifying token...</p>
//       </div>
//     ):(
//       <div className="flex flex-col lg:w-96 md:w-80 items-center rounded-2xl bg-white p-8 gap-6">
//         <Image src="/Logo_big.png" alt="Logo" width={100} height={50} />
//         <div className="w-fit">
//           <h4 className="text-primary text-center text-3xl font-bold font-mono">
//             Continue Registration
//           </h4>
//           <p className="text-sm font-sans text-center text-gray-600">
//           Email verification was successful. Please enter your details to continue your registration
//           </p>
//         </div>
//         <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
//           <div className="w-full flex flex-col">
//             <label
//               className="text-base font-sans font-semibold"
//               htmlFor="email"
//             >
//               Email Address <span className="text-red-600">*</span>
//             </label>
//             <input
//               className={`p-3 rounded border ${
//                 emailError ? "border-red-500" : "border-gray-400"
//               }`}
//               placeholder="Enter your email address"
//               name="email"
//               value={formData.email}
//               required
//               type="email"
//               onChange={handleChange}
//             />
//             {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
//           </div>
//           <div className="w-full flex flex-col">
//             <label
//               className="text-base font-sans font-semibold"
//               htmlFor="password"
//             >
//               Password <span className="text-red-600">*</span>
//             </label>
//             <input
//               className={`p-3 rounded border ${
//                 passwordError ? "border-red-500" : "border-gray-400"
//               }`}
//               placeholder="Enter password"
//               name="password"
//               value={formData.password}
//               required
//               type="password"
//               onChange={handleChange}
//             />
//             {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
//           </div>
//           <div className="flex flex-row justify-between">
//             <div className="flex flex-row gap-2">
//               {/* <input type="checkbox" name="remember" id="remember" />
//               <p className="text-base font-medium">Remember me</p> */}
//             </div>
//             <Link
//               className="text-primary text-base font-medium"
//               href={"/forgot-password"}
//             >
//               Forgot Password?
//             </Link>
//           </div>
//           <button
//             className="px-8 py-4 bg-primary rounded-full text-white text-base font-semibold"
//             type="submit"
//             disabled={loading}
//           >
//             {loading ? "Submitting..." : "Continue"}
//           </button>
//         </form>
//         {/* <p className="text-base font-medium">
       
//           <Link className="text-primary" href={"/forgot-password"}>
//             Forgot Password?
//           </Link>
//         </p> */}
//       </div>
//     )}
//     </div>
//   );
// }

// export default Verification;





// // "use client";
// // import React, { useState, useEffect } from "react";
// // import Image from "next/image";
// // import Link from "next/link";
// // import { useToast } from "@/hooks/use-toast";
// // import { useRouter, useSearchParams } from "next/navigation";
// // import { useAuth } from "@/app/(dashboard)/LoginAuthentication/AuthContext";
// // import { AuthProvider } from "@/app/(dashboard)/LoginAuthentication/AuthContext";
// // import { PublicRoute } from "@/components/PublicRoute";
// // import axios from "axios";
// // import { Eye, EyeOff } from "lucide-react"; // Import the eye icons

// // function Verification() {
// //   const { toast } = useToast();
// //   const router = useRouter();
// //   const searchParams = useSearchParams();
// //   const { login } = useAuth(); // Use the login method from AuthContext

// //   const [loading, setLoading] = useState(false);
// //   const [showPassword, setShowPassword] = useState(false); // Add state for password visibility
// //   const [formData, setFormData] = useState({
// //     email: "",
// //     password: ""
// //   });
// //   const [emailError, setEmailError] = useState("");
// //   const [passwordError, setPasswordError] = useState("");
// //   const [tokenVerified, setTokenVerified] = useState(false);

// //   useEffect(() => {
// //     const verifyToken = async () => {
// //       const token = searchParams?.get("token");
// //       if (!token) {
// //         router.push("/error"); // Redirect to an error page
// //         return;
// //       }

// //       try {
// //         setLoading(true);
// //         const response = await axios.get(
// //           `https://ican-api-6000e8d06d3a.herokuapp.com/api/users/verify-email/${token}`
// //         );
// //         console.log("Token verification response:", response.data);
// //         if (response.status === 200 || response.data.message === "Email verified successfully") {
// //           setTokenVerified(true);
// //           toast({
// //             title: "Verification Successful",
// //             description: "You can now continue your registration.",
// //             variant: "default",
// //             duration: 2000,
// //           });
// //           console.log("Setting tokenVerified to true");
// //           setTokenVerified(true);
// //         } else {
// //           throw new Error("Token verification failed.");
// //         }
// //       } catch (error) {
// //         console.error("Token verification error:", error);
// //         toast({
// //           title: "Verification Failed",
// //           description: "Invalid or expired token.",
// //           variant: "destructive",
// //           duration: 2000,
// //         });
// //         router.push("/error"); // Redirect to an error page
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     verifyToken();
// //   }, [searchParams, router, toast]);

// //   const handleChange = (e: { target: { name: any; value: any } }) => {
// //     const { name, value } = e.target;
// //     setFormData({
// //       ...formData,
// //       [name]: value
// //     });
// //   };

// //   // Toggle password visibility
// //   const togglePasswordVisibility = () => {
// //     setShowPassword(!showPassword);
// //   };

// //   const validateForm = () => {
// //     let isValid = true;
    
// //     // Reset errors
// //     setEmailError("");
// //     setPasswordError("");
    
// //     // Validate email
// //     if (!formData.email) {
// //       setEmailError("Email is required");
// //       isValid = false;
// //     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
// //       setEmailError("Please enter a valid email address");
// //       isValid = false;
// //     }
    
// //     // Validate password
// //     if (!formData.password) {
// //       setPasswordError("Password is required");
// //       isValid = false;
// //     }
    
// //     return isValid;
// //   };

// //   const handleSubmit = async (e: { preventDefault: () => void }) => {
// //     e.preventDefault();
   
// //     if (!validateForm()) {
// //       toast({
// //         title: "Login Failed",
// //         description: "Please correct the errors in the form",
// //         variant: "destructive",
// //         duration: 2000,
// //       });
// //       return;
// //     }

// //     setLoading(true);

// //     try {
// //       // Use the login method from AuthContext
// //       await login(formData.email, formData.password);
      
// //       toast({
// //         title: "Login Successful",
// //         description: "Continue your registration process. It won't take long",
// //         variant: "default",
// //         duration: 2000,
// //       });
      
// //       router.push("/registration");
// //     } catch (error: any) {
// //       console.error("Login error:", error);
      
// //       let errorMessage = "An error occurred during login.";
// //       if (error.response) {
// //         errorMessage = error.response.data.message || errorMessage;
// //       }
      
// //       toast({
// //         title: "Login Failed",
// //         description: errorMessage,
// //         variant: "destructive",
// //         duration: 2000,
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="m-auto flex flex-col items-center justify-center">
// //       {!tokenVerified ? (
// //       <div className="flex flex-col items-center p-8">
// //         <p className="text-center text-gray-600">Verifying token...</p>
// //       </div>
// //     ):(
// //       <div className="flex flex-col items-center rounded-2xl bg-white p-8 gap-6 w-full max-w-xl sm:max-w-lg md:max-w-xl">
// //         <Image src="/Logo_big.png" alt="Logo" width={100} height={50} />
// //         <div className="w-fit">
// //           <h4 className="text-primary text-center text-2xl lg:text-3xl font-bold font-mono">
// //             Continue Registration
// //           </h4>
// //           <p className="lg:text-base text-xs text-center font-normal font-sans text-gray-600">
// //             Email verification was successful. Please enter your details to continue your registration
// //           </p>
// //         </div>
// //         <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
// //           <div className="w-full flex flex-col">
// //             <label
// //               className="text-base font-sans font-semibold"
// //               htmlFor="email"
// //             >
// //               Email Address <span className="text-red-600">*</span>
// //             </label>
// //             <input
// //               className={`p-3 rounded border ${
// //                 emailError ? "border-red-500" : "border-gray-400"
// //               }`}
// //               placeholder="Enter your email address"
// //               name="email"
// //               value={formData.email}
// //               required
// //               type="email"
// //               onChange={handleChange}
// //             />
// //             {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
// //           </div>
// //           <div className="w-full flex flex-col">
// //             <label
// //               className="text-base font-sans font-semibold"
// //               htmlFor="password"
// //             >
// //               Password <span className="text-red-600">*</span>
// //             </label>
// //             <div className="relative">
// //               <input
// //                 className={`p-3 rounded border w-full ${
// //                   passwordError ? "border-red-500" : "border-gray-400"
// //                 }`}
// //                 placeholder="Enter password"
// //                 name="password"
// //                 value={formData.password}
// //                 required
// //                 type={showPassword ? "text" : "password"}
// //                 onChange={handleChange}
// //               />
// //               <button
// //                 type="button"
// //                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
// //                 onClick={togglePasswordVisibility}
// //               >
// //                 {showPassword ? (
// //                   <EyeOff size={20} />
// //                 ) : (
// //                   <Eye size={20} />
// //                 )}
// //               </button>
// //             </div>
// //             {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
// //           </div>
// //           <div className="flex flex-row justify-end">
// //             <Link
// //               className="text-primary text-xs lg:text-base font-medium"
// //               href={"/forgot-password"}
// //             >
// //               Forgot Password?
// //             </Link>
// //           </div>
// //           <button
// //             className="px-8 py-4 bg-primary rounded-full text-white text-base font-semibold"
// //             type="submit"
// //             disabled={loading}
// //           >
// //             {loading ? "Submitting..." : "Continue"}
// //           </button>
// //         </form>
// //       </div>
// //     )}
// //     </div>
// //   );
// // }

// // export default function VerificationPage() {
// //   return (
// //     <AuthProvider>
// //       <PublicRoute>
// //         <Verification />
// //       </PublicRoute>
// //     </AuthProvider>
// //   );
// // }





"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

function Verification() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams?.get("token");
      if (!token) {
        setVerificationStatus('error');
        toast({
          title: "Verification Failed",
          description: "No verification token found.",
          variant: "destructive",
          duration: 3000,
        });
        setTimeout(() => router.push("/error"), 2000);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `https://ican-api-6000e8d06d3a.herokuapp.com/api/auth/verify-email/${token}`
        );
        
        console.log("Token verification response:", response.data);
        
        if (response.status === 200 || response.data.message === "Email verified successfully") {
          // Store user data from verification response in localStorage
          const userData = response.data||response.data.user;
          
          // Store necessary data for registration
          if (userData.refreshToken || userData.accessToken||userData.refresh_token || userData.token) {
            localStorage.setItem("token", userData.refreshToken ||userData.refresh_token ||userData.accessToken || userData.token);
          }
          if (userData.user) {
            localStorage.setItem("user", JSON.stringify(userData.user));
            localStorage.setItem("userName", userData.user.firstname || userData.user.firstName || "");
            localStorage.setItem("userEmail", userData.user.email || "");
            localStorage.setItem("memberId", userData.user.membershipId || "");
          } else {
            // If user data is at root level
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("userName", userData.firstname || userData.firstName || "");
            localStorage.setItem("userEmail", userData.email || "");
            localStorage.setItem("memberId", userData.membershipId || "");
          }

          setVerificationStatus('success');
          
          toast({
            title: "Verification Successful",
            description: "Redirecting to registration...",
            variant: "default",
            duration: 2000,
          });

          // Redirect to registration after a short delay
          setTimeout(() => {
            router.push("/registration");
          }, 2000);
          
        } else {
          throw new Error("Token verification failed.");
        }
      } catch (error) {
        console.error("Token verification error:", error);
        setVerificationStatus('error');
        
        let errorMessage = "Invalid or expired token.";
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        toast({
          title: "Verification Failed",
          description: errorMessage,
          variant: "destructive",
          duration: 3000,
        });
        
        // Redirect to error page after delay
        setTimeout(() => router.push("/error"), 3000);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [searchParams, router, toast]);

  const renderContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <div className="flex flex-col items-center p-8 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-center text-gray-600 text-lg">Verifying your email...</p>
            <p className="text-center text-gray-500 text-sm">Please wait while we process your verification.</p>
          </div>
        );
      
      case 'success':
        return (
          <div className="flex flex-col items-center p-8 gap-6">
            <Image src="/Logo_big.png" alt="Logo" width={100} height={50} />
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
              <svg 
                className="w-8 h-8 text-green-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            <div className="text-center">
              <h4 className="text-primary text-2xl lg:text-3xl font-bold font-mono mb-2">
                Email Verified Successfully!
              </h4>
              <p className="text-base text-gray-600 font-normal font-sans">
                Your email has been verified. Redirecting you to complete your registration...
              </p>
            </div>
            <div className="animate-pulse">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        );
      
      case 'error':
        return (
          <div className="flex flex-col items-center p-8 gap-6">
            <Image src="/Logo_big.png" alt="Logo" width={100} height={50} />
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
              <svg 
                className="w-8 h-8 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </div>
            <div className="text-center">
              <h4 className="text-red-600 text-2xl lg:text-3xl font-bold font-mono mb-2">
                Verification Failed
              </h4>
              <p className="text-base text-gray-600 font-normal font-sans">
                The verification link is invalid or has expired. Please try again or contact support.
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="m-auto flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex flex-col items-center rounded-2xl bg-white shadow-lg max-w-md w-full">
        {renderContent()}
      </div>
    </div>
  );
}

export default Verification;