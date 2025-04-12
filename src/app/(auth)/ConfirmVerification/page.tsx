"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import axios from "axios"; // Make sure to import axios

function Verification() {
  const { toast } = useToast();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setEmailError("");
    setPasswordError("");
    
    // Validate email
    if (!formData.email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }
    
    // Validate password
    if (!formData.password) {
      setPasswordError("Password is required");
      isValid = false;
    }
    
    return isValid;
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
   
    if (!validateForm()) {
      toast({
        title: "Login Failed",
        description: "Please correct the errors in the form",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    setLoading(true);

    // Prepare data for API request
    const data = JSON.stringify({
      email: formData.email,
      password: formData.password,
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://ican-api-6000e8d06d3a.herokuapp.com/api/auth/login", // Update with the correct login endpoint
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      const { user, access_token } = response.data;
      
      console.log("User logged in successfully:", user);
      console.log("Access token:", access_token);
      
      // Store the token in localStorage or cookies for future authenticated requests
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", user);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("memberId", user.membershipId);

      console.log("User logged in successfully:", user);
      console.log("memberID:", user.membershipId);

      
      
      toast({
        title: "Login Successful",
        description: "Continue your registration process. It won't take long",
        variant: "default",
        duration: 2000,
      });
      router.push("/registration");
      
    } catch (error) {
      console.error("Login error:", error);
      
      let errorMessage = "An error occurred during login.";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense>
      <Verification />
    </Suspense>
  );
};

export default ConfirmEmailPage;


