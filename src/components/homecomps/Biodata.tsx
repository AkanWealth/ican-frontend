"use client";

import React, { useState, useEffect, Fragment, ReactNode } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import Toast from "@/components/genui/Toast";
import { useToast } from "@/hooks/use-toast";
import Contact from "../biosteps/Contact";
import Experience from "../biosteps/Experience";
import Payment from "../biosteps/Payment";
import Personal from "../biosteps/Personal";
import Qualifications from "../biosteps/Qualifications";
import axios from "axios";
import Reference from "../biosteps/Reference";
import Uploadimg from "../biosteps/Uploadimg";

const steps = [
  { number: 0, title: "BioData" },
  { number: 1, title: "Contact Details" },
  { number: 2, title: "Qualification" },
  { number: 3, title: "Experience" },
  { number: 4, title: "Payment" },
];

export type BiodataFormData = {
  id?: string;
  image: File | null;
  personalData: {
    surname: string;
    firstName: string;
    middleName: string;
    gender: string;
    dob: string;
    maritalStatus: string;
    state: string;
    nationality: string;
    lga: string;
  };
  contactDetails: {
    mobileNumber: string;
    residentialAddress?: string;
    residentialCountry?: string;
    residentialState?: string;
    residentialLga?: string;
    residentialCity?: string;
  };
  education?: {
    insitution?: string;
    discipline?: string;
    qualification?: string;
    graduation?: string;
    status?: string;
  };
  experience?: {
    companyName?: string;
    currentPosition?: string;
    startDate?: string;
    endDate?: string;
    officeAddress?: string;
  };
  payment?: {
    amount?: number;
  };
  userData?: {
    email: string;
  };
  isPaymentSuccessful?: boolean;
  profilePicture?: string;
};

function Biodata() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const toast = useToast();

  const [formData, setFormData] = useState<BiodataFormData>({
    image: null,
    personalData: {
      surname: "",
      firstName: "",
      middleName: "",
      gender: "",
      dob: "",
      maritalStatus: "",
      state: "",
      nationality: "",
      lga: "",
    },
    contactDetails: {
      residentialAddress: "",
      residentialCountry: "",
      residentialState: "",
      residentialCity: "",
      residentialLga: "",
      mobileNumber: "",
    },
    education: {
      insitution: "",
      discipline: "",
      qualification: "",
      graduation: "",
      status: "",
    },
    experience: {
      companyName: "",
      officeAddress: "",
      currentPosition: "",
      startDate: "",
      endDate: "",
    },
    payment: {
      amount: 25000,
    },
    isPaymentSuccessful: false,
    profilePicture: "",
  });

  const [userData, setUserData] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserData(localStorage.getItem("user"));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUsername = localStorage.getItem("userName");
      setUsername(storedUsername);
    }
  }, []);

  const getFormProgress = (): Partial<BiodataFormData> | null => {
    if (typeof window === "undefined") return null; // Prevent SSR issues

    try {
      const saved = localStorage.getItem("biodataFormProgress");
      if (saved) {
        const { data, lastUpdated } = JSON.parse(saved);
        if (
          new Date().getTime() - new Date(lastUpdated).getTime() >
          1 * 60 * 60 * 1000
        ) {
          localStorage.removeItem("biodataFormProgress");
          return null;
        }
        return data;
      }
    } catch (error) {
      console.error("Error getting form progress:", error);
    }
    return null;
  };

  const saveFormProgress = (data: Partial<BiodataFormData>) => {
    try {
      localStorage.setItem(
        "biodataFormProgress",
        JSON.stringify({
          data,
          lastUpdated: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error("Error saving form progress:", error);
    }
  };

  const updateFormData = (data: Partial<BiodataFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    if (typeof window === "undefined") return; 
    
    try {
      const userEmail = localStorage.getItem("userEmail") || "";
      const memberId = localStorage.getItem("memberId") || "";
      const payload = {
        email: userEmail,
        membershipId: memberId,
        
        // Personal Data
        profilePicture: formData.profilePicture || "",
        surname: formData.personalData.surname || "",
        firstname: formData.personalData.firstName || "",
        middlename: formData.personalData.middleName || "",
        gender: formData.personalData.gender || "",
        dateOfBirth: formData.personalData.dob 
          ? new Date(formData.personalData.dob).toISOString() 
          : null,
        maritalStatus: formData.personalData.maritalStatus || "",
        stateOfOrigin: formData.personalData.state || "",
        nationality: formData.personalData.nationality || "",
        
        // Contact Details
        residentialAddress: formData.contactDetails.residentialAddress || "",
        residentialCountry: formData.contactDetails.residentialCountry || "",
        residentialCity: formData.contactDetails.residentialCity || "",
        residentialState: formData.contactDetails.residentialState || "",
        residentialLGA: formData.contactDetails.residentialLga || "",
        contactPhoneNumber: formData.contactDetails.mobileNumber || "",
        
        // Education
        institution: formData.education?.insitution || "",
        discipline: formData.education?.discipline || "",
        qualifications: formData.education?.qualification || "",
        yearOfGraduation: formData.education?.graduation 
          ? Number(formData.education.graduation) 
          : "",
        status: formData.education?.status || "",
        
        // Experience
        companyName: formData.experience?.companyName || "",
        officeAddress: formData.experience?.officeAddress || "",
        position: formData.experience?.currentPosition || "",
        startDate: formData.experience?.startDate 
          ? new Date(formData.experience.startDate).toISOString() 
          : null,
        endDate: formData.experience?.endDate 
          ? new Date(formData.experience.endDate).toISOString() 
          : null,
      };
      console.log("Payload:", payload);
      const username = localStorage.getItem("userName") || "";
      const Token = localStorage.getItem("token");
      console.log("Token:", Token);

      // Send the data to the API
      const response = await axios({
        method: 'put',
        url: 'https://ican-api-6000e8d06d3a.herokuapp.com/api/users/update-user',
        data: payload,
        headers: {
          Authorization: `Bearer ${Token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
      });

      console.log("Biodata submitted successfully:", response.data);
      // alert("Biodata submitted successfully!");
      toast.toast({
        title: "Biodata submitted successfully!",
        description: "Registration is complete.",
        variant: "default",
        duration: 3000,
      });
      // Move to end page after successful submission
      setActiveStep(steps.length);
    } catch (error) {
      console.error("Error submitting biodata:", error);
      // alert("Failed to submit biodata. Please try again.");
      toast.toast({
        title: "Failed to submit biodata",
        description: "Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const isStepOptional = (step: number) => {
    return step === 10;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  // Load saved progress on mount
  useEffect(() => {
    if (typeof window === "undefined") return; // Prevent SSR issues

    const savedData = getFormProgress();
    if (savedData) {
      const savedImageMeta = localStorage.getItem("biodataFormImageMeta");
      if (savedImageMeta) {
        try {
          <Toast
            type="info"
            message="Please re-upload your image for security reasons"
          />;
        } catch (error) {
          console.error("Error parsing saved image metadata:", error);
        }
      }

      setFormData((prevData) => ({
        ...prevData,
        ...savedData,
      }));
    }
  }, []);

  // Save progress on updates
  useEffect(() => {
    const dataToSave = {
      ...formData,
      image: null,
    };
    saveFormProgress(dataToSave);
  }, [formData]);

  const handleNext = () => {
    // For the last step (payment page), check if payment is completed
    if (activeStep === steps.length - 1) {
      // Only proceed if payment is successful
      if (formData.isPaymentSuccessful) {
        handleSubmit(); // Submit the form on the last step
      } else {
        // If trying to finish without payment, show a message or alert
        alert("Please complete your payment before finishing the registration.");
        return;
      }
    } else {
      // For other steps, just proceed normally
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  // Check if we're on the end page
  const isEndPage = activeStep === steps.length;

  // Check if we're on payment page (last step) and payment is not complete
  const isPaymentIncomplete = activeStep === steps.length - 1 && !formData.isPaymentSuccessful;

  return (
    <div className="p-4 sm:p-6 md:p-10 bg-white rounded-2xl">
      {isEndPage ? (
        <Fragment>
          <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto space-y-4 my-8">
            <div className="flex justify-center items-center w-16 h-16 sm:w-20 sm:h-20 bg-[#28A745] p-4 rounded-full shadow-md mb-4 sm:mb-6">
              <Check className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>

            <Typography
              className="max-w-96 text-center text-black text-sm sm:text-base font-normal font-sans mx-auto"
              sx={{ mt: 2, mb: 1 }}
            >
              Thank you for registering with us! Your account is being reviewed.
              We will send an email to you once the review is complete. Please
              keep an eye on your email.
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                pt: 2,
              }}
            >
              <Link href="/login">
                <Button
                  className="py-3 px-4 bg-primary text-sm sm:text-base text-white font-semibold rounded-full font-sans"
                  onClick={handleReset}
                >
                  Back to website
                </Button>
              </Link>
            </Box>
          </div>
        </Fragment>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center mb-6 sm:mb-8">
            <h3 className="text-primary text-xl sm:text-2xl lg:text-3xl font-semibold text-center">
              Welcome {username || "Guest"}
            </h3>
            <p className="text-sm sm:text-base text-center">
              Complete your registration. It won't take long.
            </p>
          </div>

          <Box
            sx={{
              width: "100%",
              overflowX: "auto", // Enable horizontal scrolling for small screens
            }}
            className="overflow-x-auto"
          >
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{
                minWidth: "500px", // Ensure the stepper has a minimum width
              }}
            >
              {steps.map((step, index) => {
                const stepProps: { completed?: boolean } = {};
                const labelProps: { optional?: ReactNode } = {};

                if (isStepOptional(index)) {
                  labelProps.optional = (
                    <Typography variant="caption">Optional</Typography>
                  );
                }
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }

                return (
                  <Step key={step.number} {...stepProps}>
                    {/* Hide the label and show only the mark */}
                    <StepLabel
                      {...labelProps}
                      StepIconComponent={(props) => (
                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded-full ${
                            props.completed
                              ? "bg-primary text-white"
                              : "bg-gray-300 text-black"
                          }`}
                        >
                          {props.icon}
                        </div>
                      )}
                    />
                  </Step>
                );
              })}
            </Stepper>
          </Box>

          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full"
              >
                {activeStep === 0 && (
                  <Personal
                    isShown={activeStep === 0}
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                )}
                {activeStep === 1 && (
                  <Contact
                    isShown={activeStep === 1}
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                )}
                {activeStep === 2 && (
                  <Qualifications
                    isShown={activeStep === 2}
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                )}
                {activeStep === 3 && (
                  <Experience
                    isShown={activeStep === 3}
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                )}
                {activeStep === 4 && (
                  <Payment
                    isShown={activeStep === 4}
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{
                mr: 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
              hidden={activeStep === 0}
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}
            
            {/* Payment message when on payment page but payment not complete */}
            {isPaymentIncomplete && (
              <div className="text-red-500 text-sm mr-3 self-center">
                Complete payment to finish
              </div>
            )}
            
            <Button
              className={`bg-primary p-3 sm:p-4 rounded-full text-sm sm:text-base text-white w-fit ${
                isPaymentIncomplete ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleNext}
              disabled={isPaymentIncomplete}
            >
              {activeStep === steps.length - 1 ? "Finish" : "Continue"}
            </Button>
          </Box>
        </>
      )}
    </div>
  );
}

export default Biodata;