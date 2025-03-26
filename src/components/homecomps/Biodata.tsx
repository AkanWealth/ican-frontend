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

import Contact from "../biosteps/Contact";
import Experience from "../biosteps/Experience";
import Payment from "../biosteps/Payment";
import Personal from "../biosteps/Personal";
import Qualifications from "../biosteps/Qualifications";
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
    contactAddress: string;
    contactCountry: string;
    contactState: string;
    contactCity: string;
    email: string;
    mobileNumber: string;
    residentialAddress?: string;
    residentialCountry?: string;
    residentialState?: string;
    residentialLga?: string;
    residentialTelephone?: string;
    officeAddress?: string;
    officeCountry?: string;
    officeState?: string;
    officeCity?: string;
    officeLga?: string;
    officeTelephone?: string;
  };
  education?: {
    insitution?: string;
    discipline?: string;
    qualification?: string;
    graduation?: string;
    professionalQualification?: {
      firstQualName?: string;
      firstQualDate?: string;
      secQualName?: string;
      secQualDate?: string;
    }[];
  };
  experience?: {
    currentJob?: string;
    companyName?: string;
    department?: string;
    currentPosition?: string;
    startDate?: string;
  };
  reference: {
    refereeName: string;
    refereeIcanNo: string;
    refereePhone: string;
    refereeEmail: string;
  };
  payment?: {
    image?: File | null;
    receipt?: File | null;
    waiver?: string;
  };
};

function Biodata() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

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
      contactAddress: "",
      contactCountry: "",
      contactState: "",
      contactCity: "",
      email: "",
      mobileNumber: "",
    },
    reference: {
      refereeName: "",
      refereeIcanNo: "",
      refereePhone: "",
      refereeEmail: "",
    },
  });

  const getFormProgress = (): Partial<BiodataFormData> | null => {
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

  const isStepOptional = (step: number) => {
    return step === 10;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  // Load saved progress on mount
  useEffect(() => {
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
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
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

  return (
    <div className="p-10 bg-white rounded-2xl">
      {isEndPage ? (
        // Only show the end page fragment when activeStep equals steps.length
        <Fragment>
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto space-y-2 my-8">
            <div className="flex justify-center items-center w-20 h-20 bg-[#28A745] p-4 rounded-full shadow-md mb-6">
              <Check className="w-12 h-12 text-white" />
            </div>

            <Typography
              className="max-w-96 text-center text-black text-sm font-normal font-sans mx-auto"
              sx={{ mt: 2, mb: 1 }}
            >
              Thank you for registering with us! Your account is being reviewed.
              We will send an email to you once review is complete. Please keep
              an eye on your email.
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                pt: 2,
              }}
            >
              <Link href="/">
                <Button
                  className="py-3 px-4 bg-primary text-sm text-white font-semibold rounded-full font-sans"
                  onClick={handleReset}
                >
                  Back to website
                </Button>
              </Link>
            </Box>
          </div>
        </Fragment>
      ) : (
        // Show the normal stepper UI for all other steps
        <>
          <div className="flex flex-col item-center justify-center mb-8">
            <h3 className="text-primary lg:text-3xl md:text-xl font-semibold text-center">
              Welcome Chinazom
            </h3>
            <p className="text-base text-center">
              Complete your registration. It won't take long.
            </p>
          </div>

          <Box sx={{ width: "100%" }}>
            <Stepper activeStep={activeStep} alternativeLabel>
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
                    <StepLabel {...labelProps}>{step.title}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>

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
              <Button
                className="bg-primary p-4 rounded-full text-sm text-white w-fit"
                onClick={handleNext}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Continue"}
              </Button>
            </Box>
          </Box>
        </>
      )}

      {/* {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )} */}
    </div>
  );
}

export default Biodata;
