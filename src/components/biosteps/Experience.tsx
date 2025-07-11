// "use client";
// import React, { useState, useEffect } from "react";
// import { BiodataFormData } from "../homecomps/Biodata";
// import InputEle from "../genui/InputEle";

// interface ExperienceProps {
//   isShown: boolean;
//   formData: BiodataFormData;
//   updateFormData: (data: Partial<BiodataFormData>) => void;
// }

// function Experience({ isShown, formData, updateFormData }: ExperienceProps) {
//   const [isCurrentJob, setIsCurrentJob] = useState(false);

//   // Create local state to track validation status of this component
//   const [isValid, setIsValid] = useState(false);

//   const handleCheckboxChange = () => {
//     setIsCurrentJob(!isCurrentJob);

//     if (!isCurrentJob) {
//       // If checking "current job", clear end date
//       updateFormData({
//         experience: {
//           ...formData.experience,
//           endDate: "",
//         },
//       });
//     }
//   };

//   // Validate component whenever form data changes
//   useEffect(() => {
//     // Check if required fields are filled
//     const isExperienceValid =
//       !!formData.experience?.companyName?.trim() &&
//       !!formData.experience?.currentPosition?.trim() &&
//       !!formData.experience?.startDate?.trim();

//     // If current job is checked, end date is not required
//     // Otherwise, end date is required
//     const isEndDateValid =
//       isCurrentJob || !!formData.experience?.endDate?.trim();

//     setIsValid(isExperienceValid && isEndDateValid);

//     // You could also use a callback passed from parent to communicate validation status
//     // if that's how you prefer to structure your app
//   }, [formData, isCurrentJob]);

//   // We're not using bucket variable as isShown is directly passed to the component
//   return (
//     <div
//       className={`pt-4 flex flex-col justify-between gap-4 mt-4 ${isShown ? "block" : "hidden"
//         }`}
//     >
//       <h3 className="font-bold font-mono text-xl text-black">
//         WORK EXPERIENCE
//         <hr />
//       </h3>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
//         <InputEle
//           id="companyName"
//           placeholder="Enter company name"
//           type="text"
//           label="Company Name"
//           value={formData.experience?.companyName || ""}
//           onChange={(e) =>
//             updateFormData({
//               experience: {
//                 ...formData.experience,
//                 companyName: e.target.value,
//               },
//             })
//           }
//           required={true}
//         />
//         <InputEle
//           id="officeAddress"
//           placeholder="Enter your Address"
//           type="text"
//           label="Office Address"
//           value={formData.experience?.officeAddress || ""}
//           onChange={(e) =>
//             updateFormData({
//               experience: {
//                 ...formData.experience,
//                 officeAddress: e.target.value,
//               },
//             })
//           }
//           required={false}
//         />
//       </div>

//       <InputEle
//         id="currentPosition"
//         type="text"
//         label="Position/Role"
//         placeholder="Enter your Position/Role"
//         value={formData.experience?.currentPosition || ""}
//         onChange={(e) =>
//           updateFormData({
//             experience: {
//               ...formData.experience,
//               currentPosition: e.target.value,
//             },
//           })
//         }
//         required={true}
//       />

//       {/* <div className="flex items-center gap-2 mb-4">
//         <input
//           id="currentJobCheckbox"
//           type="checkbox"
//           className="w-4 h-4"
//           checked={isCurrentJob}
//           onChange={handleCheckboxChange}
//         />
//         {/* <label htmlFor="currentJobCheckbox" className="text-sm text-gray-700">
//           This is my current position
//         </label> 
//       </div> */}

//       {/* // Fix for the Start Date and End Date inputs in Experience.tsx */}

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
//         <InputEle
//           id="startDate"
//           type="date"
//           label="Start Date"
//           value={
//             formData.experience?.startDate // Already in YYYY-MM-DD form
//               ? formData.experience.startDate // Already in YYYY-MM-DD format
//               : ""
//           }
//           onChange={(e) => {
//             // Store date directly in YYYY-MM-DD format
//             const dateValue = e.target.value; // Already in YYYY-MM-DD format from the date input
//             updateFormData({
//               experience: {
//                 ...formData.experience,
//                 startDate: dateValue, // Store as YYYY-MM-DD string
//               },
//             });
//           }}
//           required={true}
//         />
//         <InputEle
//           id="endDate"
//           type="date"
//           label="End Date"
//           value={
//             formData.experience?.endDate || ""
//           }
//           onChange={(e) => {
//             // Store date directly in YYYY-MM-DD format
//             const dateValue = e.target.value; // Already in YYYY-MM-DD format from the date input
//             updateFormData({
//               experience: {
//                 ...formData.experience,
//                 endDate: dateValue, // Store as YYYY-MM-DD string
//               },
//             });
//           }}
//           required={true}
//           disabled={isCurrentJob}
//         />

//       </div>
//     </div>
//   );
// }

// export default Experience;


// "use client";
// import React, { useState, useEffect } from "react";
// import { BiodataFormData } from "../homecomps/Biodata";
// import InputEle from "../genui/InputEle";

// interface ExperienceProps {
//   isShown: boolean;
//   formData: BiodataFormData;
//   updateFormData: (data: Partial<BiodataFormData>) => void;
// }

// function Experience({ isShown, formData, updateFormData }: ExperienceProps) {
//   // Initialize state from formData to ensure synchronization
//   const [isCurrentJob, setIsCurrentJob] = useState(formData.experience?.isCurrentJob || false);
//   const [noWorkExperience, setNoWorkExperience] = useState(formData.experience?.hasNoExperience || false);

//   // Create local state to track validation status of this component
//   const [isValid, setIsValid] = useState(false);

//   const handleCheckboxChange = () => {
//     const newValue = !isCurrentJob;
//     setIsCurrentJob(newValue);

//     // Update formData with the new isCurrentJob value
//     updateFormData({
//       experience: {
//         ...formData.experience,
//         isCurrentJob: newValue,
//         endDate: newValue ? "" : formData.experience?.endDate,
//       },
//     });
//   };

//   const handleNoExperienceChange = () => {
//     const newValue = !noWorkExperience;
//     setNoWorkExperience(newValue);
    
//     // Update formData with the hasNoExperience flag
//     updateFormData({
//       experience: {
//         // If checking "no experience", clear all experience fields
//         // else keep current values
//         ...(newValue ? {
//           companyName: "",
//           currentPosition: "",
//           startDate: "",
//           endDate: "",
//           officeAddress: "",
//           isCurrentJob: false,
//         } : formData.experience),
//         // Always update the hasNoExperience flag
//         hasNoExperience: newValue,
//       },
//     });
//   };

//   // Validate component whenever form data changes
//   useEffect(() => {
//     // If "No Work Experience" is checked, consider the form valid
//     if (noWorkExperience) {
//       setIsValid(true);
//       return;
//     }

//     // Check if required fields are filled
//     const isExperienceValid =
//       !!formData.experience?.companyName?.trim() &&
//       !!formData.experience?.currentPosition?.trim() &&
//       !!formData.experience?.startDate?.trim();

//     // If current job is checked, end date is not required
//     // Otherwise, end date is required
//     const isEndDateValid =
//       isCurrentJob || !!formData.experience?.endDate?.trim();

//     setIsValid(isExperienceValid && isEndDateValid);
//   }, [formData, isCurrentJob, noWorkExperience]);

//   // Synchronize local state with formData when it changes externally
//   useEffect(() => {
//     setNoWorkExperience(formData.experience?.hasNoExperience || false);
//     setIsCurrentJob(formData.experience?.isCurrentJob || false);
//   }, [formData.experience?.hasNoExperience, formData.experience?.isCurrentJob]);

//   return (
//     <div
//       className={`pt-4 flex flex-col justify-between gap-4 mt-4 ${isShown ? "block" : "hidden"}`}
//     >
//       <h3 className="font-bold font-mono text-xl text-black">
//         WORK EXPERIENCE
//         <hr />
//       </h3>

//       <div className="flex items-center gap-2 mb-4">
//         <input
//           id="noExperienceCheckbox"
//           type="checkbox"
//           className="w-4 h-4"
//           checked={noWorkExperience}
//           onChange={handleNoExperienceChange}
//         />
//         <label htmlFor="noExperienceCheckbox" className="text-sm text-gray-700">
//           I don't have any work experience
//         </label>
//       </div>

//       {!noWorkExperience && (
//         <>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
//             <InputEle
//               id="companyName"
//               placeholder="Enter company name"
//               type="text"
//               label="Company Name"
//               value={formData.experience?.companyName || ""}
//               onChange={(e) =>
//                 updateFormData({
//                   experience: {
//                     ...formData.experience,
//                     companyName: e.target.value,
//                   },
//                 })
//               }
//               required={true}
//             />
//             <InputEle
//               id="officeAddress"
//               placeholder="Enter your Address"
//               type="text"
//               label="Office Address"
//               value={formData.experience?.officeAddress || ""}
//               onChange={(e) =>
//                 updateFormData({
//                   experience: {
//                     ...formData.experience,
//                     officeAddress: e.target.value,
//                   },
//                 })
//               }
//               required={false}
//             />
//           </div>

//           <InputEle
//             id="currentPosition"
//             type="text"
//             label="Position/Role"
//             placeholder="Enter your Position/Role"
//             value={formData.experience?.currentPosition || ""}
//             onChange={(e) =>
//               updateFormData({
//                 experience: {
//                   ...formData.experience,
//                   currentPosition: e.target.value,
//                 },
//               })
//             }
//             required={true}
//           />
// {/* 
//           <div className="flex items-center gap-2 mb-4">
//             <input
//               id="currentJobCheckbox"
//               type="checkbox"
//               className="w-4 h-4"
//               checked={isCurrentJob}
//               onChange={handleCheckboxChange}
//             />
//             <label htmlFor="currentJobCheckbox" className="text-sm text-gray-700">
//               This is my current position
//             </label>
//           </div> */}

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
//             <InputEle
//               id="startDate"
//               type="date"
//               label="Start Date"
//               value={formData.experience?.startDate || ""}
//               onChange={(e) => {
//                 // Store date directly in YYYY-MM-DD format
//                 const dateValue = e.target.value; // Already in YYYY-MM-DD format from the date input
//                 updateFormData({
//                   experience: {
//                     ...formData.experience,
//                     startDate: dateValue, // Store as YYYY-MM-DD string
//                   },
//                 });
//               }}
//               required={true}
//             />
//             <InputEle
//               id="endDate"
//               type="date"
//               label="End Date"
//               value={formData.experience?.endDate || ""}
//               onChange={(e) => {
//                 // Store date directly in YYYY-MM-DD format
//                 const dateValue = e.target.value; // Already in YYYY-MM-DD format from the date input
//                 updateFormData({
//                   experience: {
//                     ...formData.experience,
//                     endDate: dateValue, // Store as YYYY-MM-DD string
//                   },
//                 });
//               }}
//               required={true} 
//               // disabled={isCurrentJob}
//             />
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default Experience;



"use client";
import React, { useState, useEffect } from "react";
import { BiodataFormData } from "../homecomps/Biodata";
import InputEle from "../genui/InputEle";

interface ExperienceProps {
  isShown: boolean;
  formData: BiodataFormData;
  updateFormData: (data: Partial<BiodataFormData>) => void;
}

function Experience({ isShown, formData, updateFormData }: ExperienceProps) {
  // Initialize state from formData to ensure synchronization
  const [isCurrentJob, setIsCurrentJob] = useState(formData.experience?.isCurrentJob || false);
  const [noWorkExperience, setNoWorkExperience] = useState(formData.experience?.hasNoExperience || false);

  // Create local state to track validation status of this component
  const [isValid, setIsValid] = useState(false);

  const handleCheckboxChange = () => {
    const newValue = !isCurrentJob;
    setIsCurrentJob(newValue);

    // Update formData with the new isCurrentJob value
    updateFormData({
      experience: {
        ...formData.experience,
        isCurrentJob: newValue,
        // If it's current job, set endDate to empty string
        endDate: newValue ? "" : formData.experience?.endDate,
      },
    });
  };

  const handleNoExperienceChange = () => {
    const newValue = !noWorkExperience;
    setNoWorkExperience(newValue);
    
    // Update formData with the hasNoExperience flag
    updateFormData({
      experience: {
        // If checking "no experience", clear all experience fields
        // else keep current values
        ...(newValue ? {
          companyName: "",
          currentPosition: "",
          startDate: "",
          endDate: "",
          officeAddress: "",
          isCurrentJob: false,
        } : formData.experience),
        // Always update the hasNoExperience flag
        hasNoExperience: newValue,
      },
    });
  };

  // Validate component whenever form data changes
  useEffect(() => {
    // If "No Work Experience" is checked, consider the form valid
    if (noWorkExperience) {
      setIsValid(true);
      return;
    }

    // Check if required fields are filled
    const isExperienceValid =
      !!formData.experience?.companyName?.trim() &&
      !!formData.experience?.currentPosition?.trim() &&
      !!formData.experience?.startDate?.trim();

    // If current job is checked, end date is not required
    // Otherwise, end date is required
    const isEndDateValid =
      isCurrentJob || !!formData.experience?.endDate?.trim();

    setIsValid(isExperienceValid && isEndDateValid);
  }, [formData, isCurrentJob, noWorkExperience]);

  // Synchronize local state with formData when it changes externally
  useEffect(() => {
    setNoWorkExperience(formData.experience?.hasNoExperience || false);
    setIsCurrentJob(formData.experience?.isCurrentJob || false);
  }, [formData.experience?.hasNoExperience, formData.experience?.isCurrentJob]);

  return (
    <div
      className={`pt-4 flex flex-col justify-between gap-4 mt-4 ${isShown ? "block" : "hidden"}`}
    >
      <h3 className="font-bold font-mono text-xl text-black">
        WORK EXPERIENCE
        <hr />
      </h3>

      <div className="flex items-center gap-2 mb-4">
        <input
          id="noExperienceCheckbox"
          type="checkbox"
          className="w-4 h-4"
          checked={noWorkExperience}
          onChange={handleNoExperienceChange}
        />
        <label htmlFor="noExperienceCheckbox" className="text-sm text-gray-700">
          I don't have any work experience
        </label>
      </div>

      {!noWorkExperience && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <InputEle
              id="companyName"
              placeholder="Enter company name"
              type="text"
              label="Company Name"
              value={formData.experience?.companyName || ""}
              onChange={(e) =>
                updateFormData({
                  experience: {
                    ...formData.experience,
                    companyName: e.target.value,
                  },
                })
              }
              required={true}
            />
            <InputEle
              id="officeAddress"
              placeholder="Enter your Address"
              type="text"
              label="Office Address"
              value={formData.experience?.officeAddress || ""}
              onChange={(e) =>
                updateFormData({
                  experience: {
                    ...formData.experience,
                    officeAddress: e.target.value,
                  },
                })
              }
              required={false}
            />
          </div>

          <InputEle
            id="currentPosition"
            type="text"
            label="Position/Role"
            placeholder="Enter your Position/Role"
            value={formData.experience?.currentPosition || ""}
            onChange={(e) =>
              updateFormData({
                experience: {
                  ...formData.experience,
                  currentPosition: e.target.value,
                },
              })
            }
            required={true}
          />

          <div className="flex items-center gap-2 mb-4">
            <input
              id="currentJobCheckbox"
              type="checkbox"
              className="w-4 h-4"
              checked={isCurrentJob}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="currentJobCheckbox" className="text-sm text-gray-700">
              This is my current position
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <InputEle
              id="startDate"
              type="date"
              label="Start Date"
              value={formData.experience?.startDate || ""}
              onChange={(e) => {
                // Store date directly in YYYY-MM-DD format
                const dateValue = e.target.value; // Already in YYYY-MM-DD format from the date input
                updateFormData({
                  experience: {
                    ...formData.experience,
                    startDate: dateValue, // Store as YYYY-MM-DD string
                  },
                });
              }}
              required={true}
            />
            {/* Only show End Date field if it's NOT a current job */}
            {!isCurrentJob && (
              <InputEle
                id="endDate"
                type="date"
                label="End Date"
                value={formData.experience?.endDate || ""}
                onChange={(e) => {
                  // Store date directly in YYYY-MM-DD format
                  const dateValue = e.target.value; // Already in YYYY-MM-DD format from the date input
                  updateFormData({
                    experience: {
                      ...formData.experience,
                      endDate: dateValue, // Store as YYYY-MM-DD string
                    },
                  });
                }}
                required={true} 
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Experience;