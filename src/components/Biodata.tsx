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
import Toast from "./genui/Toast";

import Contact from "./biosteps/Contact";
import Experience from "./biosteps/Experience";
import Payment from "./biosteps/Payment";
import Personal from "./biosteps/Personal";
import Qualifications from "./biosteps/Qualifications";
import Reference from "./biosteps/Reference";
import Uploadimg from "./biosteps/Uploadimg";

// import MobileStepper from "@mui/material/MobileStepper";
// import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

const steps = [
  { number: 0, title: "Upload Image" },
  { number: 1, title: "BioData" },
  { number: 2, title: "Contact Details" },
  { number: 3, title: "Qualification" },
  { number: 4, title: "Experience" },
  { number: 5, title: "Reference" },
  { number: 6, title: "Payment" },
];

export type BiodataFormData = {
  id?: string;
  image: File | null;
  personalData: {
    surname: string;
    firstName: string;
    middleName?: string;
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
      firstQualName: string;
      firstQualDate: string;
      secQualName: string;
      secQualDate: string;
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
    receipt?: File | null;
    waiver?: File | null;
  };
};

function Biodata() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [toast, setToast] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const [formData, setFormData] = useState<BiodataFormData>({
    image: null,
    personalData: {
      surname: "",
      firstName: "",
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
          24 * 60 * 60 * 1000
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
          console.log("hwlp");
          setToast({
            type: "info",
            message: "Please re-upload your event image for security reasons",
          });
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

  // const validateStep = (currentStep: number): boolean => {
  //   switch (currentStep) {
  //     case 1:
  //       if (!formData.title.trim()) {
  //         setToast({ type: "error", message: "Please enter an event title" });
  //         return false;
  //       }
  //       if (!formData.description.trim()) {
  //         setToast({
  //           type: "error",
  //           message: "Please enter an event description",
  //         });
  //         return false;
  //       }
  //       if (!formData.image) {
  //         setToast({ type: "error", message: "Please upload an event image" });
  //         return false;
  //       }
  //       if (!formData.date || !formData.time) {
  //         setToast({
  //           type: "error",
  //           message: "Please set event date and time",
  //         });
  //         return false;
  //       }
  //       if (!formData.venue || !formData.location) {
  //         setToast({
  //           type: "error",
  //           message: "Please enter event venue and location",
  //         });
  //         return false;
  //       }
  //       return true;

  //     case 2:
  //       if (formData.ticketType.length === 0) {
  //         setToast({
  //           type: "error",
  //           message: "Please add at least one ticket type",
  //         });
  //         return false;
  //       }
  //       for (const ticket of formData.ticketType) {
  //         if (!ticket.name || !ticket.price || !ticket.quantity) {
  //           setToast({
  //             type: "error",
  //             message: "Please fill in all ticket details",
  //           });
  //           return false;
  //         }
  //       }
  //       return true;

  //     case 3:
  //       return true;

  //     default:
  //       return true;
  //   }
  // };

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
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
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

  return (
    <div className=" p-10 bg-white rounded-2xl ">
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
              {activeStep === steps.length && (
                // end page
                <Fragment>
                  <Typography
                    className="max-w-96 text-center text-black text-sm font-normal font-sans mx-auto "
                    sx={{ mt: 2, mb: 1 }}
                  >
                    Thank you for registering with us! Your account is being
                    reviewed. We will send an email to you once review is
                    complete. Please keep an eye on your email.
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      pt: 2,
                    }}
                  >
                    {/* <Box sx={{ flex: "1 1 auto" }} /> */}
                    <Link href="/">
                      <Button
                        className="py-3 px-4 bg-primary text-sm text-white font-semibold rounded font-sans "
                        onClick={handleReset}
                      >
                        Back to website
                      </Button>
                    </Link>
                  </Box>
                </Fragment>
              )}{" "}
              {activeStep === 0 && (
                <Uploadimg
                  setToast={setToast}
                  formData={formData}
                  updateFormData={updateFormData}
                />
              )}
              {activeStep === 1 && (
                <Personal formData={formData} updateFormData={updateFormData} />
              )}
              {activeStep === 2 && (
                <Contact formData={formData} updateFormData={updateFormData} />
              )}
              {activeStep === 3 && (
                <Qualifications
                  formData={formData}
                  updateFormData={updateFormData}
                />
              )}
              {activeStep === 4 && (
                <Experience
                  formData={formData}
                  updateFormData={updateFormData}
                />
              )}
              {activeStep === 5 && (
                <Reference
                  formData={formData}
                  updateFormData={updateFormData}
                />
              )}
              {activeStep === 6 && (
                <Payment formData={formData} updateFormData={updateFormData} />
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
            className="bg-primary p-2 rounded-full text-base text-white w-fit"
            onClick={handleNext}
            disabled={activeStep === 7}
            hidden={activeStep === 7}
          >
            {activeStep === steps.length - 1 ? "Finish" : "Continue"}
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default Biodata;
