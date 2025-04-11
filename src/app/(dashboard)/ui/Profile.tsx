"use client";
import React, { useState, useEffect } from "react";
import { nigerianStates } from "@/lib/States";
import { nigerianStatesLGAs } from "@/lib/nigerianStatesLGAs";
import { nigerianStatesCity } from "@/lib/NigeriaCity";
import Image from "next/image";
import axios from "axios";
import { uploadImageToCloud } from "@/lib/uploadImage";
import { useToast } from "@/hooks/use-toast";

interface StateCityMap {
  [state: string]: string[];
}

function Profile() {
  const [formData, setFormData] = useState({
    surname: "",
    firstName: "",
    middleName: "",
    email: "",
    phone: "",
    country: "",
    address: "",
    stateOfOrigin: "",
    city: "",
    residentialCity: "",
    nationality: "",
    residentialCountry: "",
    residentialState: "",
    residentialLGA: "",
    gender: "",
    dateOfBirth: "",
    maritalStatus: "",
    institution: "",
    discipline: "",
    qualification: "",
    yearOfGraduation: "",
    status: "",
    companyName: "",
    officeAddress: "",
    position: "",
    startDate: "",
    endDate: "",
    profilePictureUrl: "", 
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("biodata");
  const [profilePhoto, setProfilePhoto] = useState<File | string | null>(null);
  const [states, setStates] = useState<string[]>([]);
  const [countries, setCountries] = useState([]);
  const [nigerianStateCities, setNigerianStateCities] = useState<StateCityMap>(
    {}
  );
  const {toast} = useToast();
  
  const [nigerianStateCity, setNigerianStateCity] = useState<StateCityMap>({});
  const [cities, setCities] = useState<string[]>([]);
  const [residentialCities, setResidentialCities] = useState<string[]>([]);
  const [residentialLGAs, setResidentialLGAs] = useState<string[]>([]);

  
  useEffect(() => {
    // Fetch countries
    // fetch("https://restcountries.com/v3.1/all")
    //   .then((response) => response.json())
      // .then((data) => {
      //   const sortedCountries = data
      //     .map((country: { name: { common: any } }) => country.name.common)
      //     .sort();
      //   setCountries(sortedCountries);
      // })
      // .catch((error) => console.error("Error fetching countries:", error));

    const stateNames = nigerianStatesLGAs.map((state) => state.name);
    setStates(stateNames);

    //mapping of states to their LGAs
    const stateCitiesMap: StateCityMap = {};
    nigerianStatesLGAs.forEach((state) => {
      stateCitiesMap[state.name] = state.lgas;
    });
    setNigerianStateCities(stateCitiesMap);

    // Create a mapping of states to their cities
    const stateCitysMap: StateCityMap = {};
    nigerianStatesCity.forEach((state) => {
      stateCitysMap[state.name] = state.cities;
    });
    setNigerianStateCity(stateCitysMap);

    setStates(nigerianStates);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure code runs only on the client side
  
    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user)?.id : null;
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
  
    if (userId && token) {
      axios
        .get(`https://ican-api-6000e8d06d3a.herokuapp.com/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        })
        .then((response) => {
          const data = response.data;
          console.log("API data:", data);
          
          // Set profile picture if available
          if (data.profilePicture) {
            setProfilePhoto(data.profilePicture);
            setFormData(prev => ({
              ...prev,
              profilePictureUrl: data.profilePicture
            }));
          }
          
          // First set the state and residential state to ensure cities and LGAs are loaded
          if (data.stateOfOrigin) {
            // Set form state first
            setFormData(prev => ({
              ...prev,
              stateOfOrigin: data.stateOfOrigin || ""
            }));
            
            // Then load the cities for that state
            if (data.stateOfOrigin) {
              setCities(nigerianStateCity[data.stateOfOrigin] || []);
            }
          }
  
          if (data.residentialState) {
            // Set residential state first
            setFormData(prev => ({
              ...prev,
              residentialState: data.residentialState || ""
            }));
            
            // Then load cities and LGAs for that state
            setResidentialCities(nigerianStateCity[data.residentialState] || []);
            setResidentialLGAs(nigerianStateCities[data.residentialState] || []);
          }
          
          // Now update the entire form data
          setFormData((prevFormData) => ({
            ...prevFormData,
            surname: data.surname || "",
            firstName: data.firstname || "",
            middleName: data.middlename || "",
            email: data.email || "",
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : "",
            phone: data.contactPhoneNumber || "",
            country: data.nationality || "",
            address: data.residentialAddress || "",
            // We already set stateOfOrigin above
            city: data.city || "",
            gender: data.gender || "",  
            maritalStatus: data.maritalStatus || "",  
            residentialCity: data.residentialCity || "",
            nationality: data.nationality || "",
            residentialCountry: data.residentialCountry || "",
            // We already set residentialState above
            residentialLGA: data.residentialLGA || "",
            institution: data.institution || "",
            discipline: data.discipline || "",
            qualification: data.qualifications || "",
            yearOfGraduation: data.yearOfGraduation ? data.yearOfGraduation.toString() : "",
            status: data.status || "", 
            companyName: data.companyName || "",
            officeAddress: data.officeAddress || "",
            position: data.position || "",
          }));
        })
        .catch((error) => console.error("Error fetching user details:", error));
    }
  }, [nigerianStateCity, nigerianStateCities]);

  

  const handleInputChange = (e: any) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleInputChanges = (e: { target: { id: any; value: any } }) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (id === "stateOfOrigin" && value) {
      const stateCities = nigerianStateCities[value] || [];
      setCities(stateCities);
    } else if (id === "residentialState" && value) {
      const stateCities = nigerianStateCity[value] || [];
      setResidentialCities(stateCities);
      const stateLGAs = nigerianStateCities[value] || [];
      setResidentialLGAs(stateLGAs);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.size <= 5 * 1024 * 1024) {
      try {
        // Show loading state
        // You might want to add a loading state to your component
        setIsLoading(true);
        
        // Upload the file to cloud storage
        const imageUrl = await uploadImageToCloud(file);
        
        console.log("Uploaded image URL:", imageUrl);
        // Update state with the new URL
        setProfilePhoto(imageUrl);
        setFormData(prev => ({
          ...prev,
          profilePictureUrl: imageUrl
        }));
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error uploading photo:", error);
        // alert("Failed to upload photo. Please try again.");
        toast({
          title: "Failed to upload photo",
          description: "Please try again. ",
          variant: "destructive",
          duration: 2000,
        });
        setIsLoading(false);
      }
    } else {
      // alert("Please select an image under 5MB");
      toast({
        title: "Failed to upload photo",
        description: "Please select an image under 5MB",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleDeletePhoto = () => {
    setProfilePhoto(null);
    setFormData(prev => ({
      ...prev,
      profilePictureUrl: ""
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  const handleTabChange = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  const handleUpdate = (tab: string) => {
    if (typeof window === "undefined") return; // Ensure code runs only on the client side
  
    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user)?.id : null;
    const userEmail = user ? JSON.parse(user)?.email : null;
    const memberId = user ? JSON.parse(user)?.membershipId : null;
  
    if (!userId || !userEmail || !memberId) return;
  
    if (tab === "biodata") {
      const payload = {
        profilePicture: formData.profilePictureUrl || profilePhoto || "", // Use existing profile picture or uploaded photo
        surname: formData.surname || "",
        firstname: formData.firstName || "",
        middlename: formData.middleName || "",
        gender: formData.gender || "",
        dateOfBirth: formData.dateOfBirth
          ? new Date(formData.dateOfBirth).toISOString().split("T")[0]
          : null, // Format dateOfBirth to "YYYY-MM-DD"
        maritalStatus: formData.maritalStatus || "",
        stateOfOrigin: formData.stateOfOrigin || "",
        nationality: formData.nationality || "",
      };
  console.log("Biodata payload:", payload); // Log the payload for debugging
      axios
        .patch(
          `https://ican-api-6000e8d06d3a.herokuapp.com/api/users/profile`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          toast({
            title: "Biodata updated successfully!",
            description: "Refreach the page to see changes.",
            variant: "default",
            duration: 2000,
          });
          // alert("Biodata updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating biodata:", error);
          toast({
            title: "Failed to update biodata",
            description: "Please try again.",
            variant: "destructive",
            duration: 2000,
          });
          // alert("Failed to update biodata. Please try again.");
        });
    }else if (tab === "contact") {
      // For contact, use regular JSON payload
      const payload = {
        // email: userEmail,
        // membershipId: memberId,
        residentialAddress: formData.address || "",
        residentialCountry: formData.residentialCountry || "",
        residentialCity: formData.residentialCity || "",
        residentialState: formData.residentialState || "",
        residentialLGA: formData.residentialLGA || "",
        contactPhoneNumber: formData.phone || ""
      };
      
      axios
        .patch(
          'https://ican-api-6000e8d06d3a.herokuapp.com/api/users/contact',
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json"
            },
          }
        )
        .then((response) => {
          // alert("Contact information updated successfully!");
          toast({
            title: "Contact information updated successfully!",
            description: "Refreach the page to see changes.",
            variant: "default",
            duration: 2000,
          });
        })
        .catch((error) => {
          // console.error("Error updating contact information:", error);
          toast({
            title: "Failed to update contact information",
            description: "Please try again.",
            variant: "destructive",
            duration: 2000,
          }); 
          // alert("Failed to update contact information. Please try again.");
        });
    } else if (tab === "qualification") {
      const payload = {
        // email: userEmail,
        // membershipId: memberId,
        institution: formData.institution || "",
        discipline: formData.discipline || "",
        qualifications: formData.qualification || "",
        yearOfGraduation: formData.yearOfGraduation
          ? parseInt(formData.yearOfGraduation, 10)
          : null,
        // status: formData.status || ""
      };
      
      axios
        .patch(
          'https://ican-api-6000e8d06d3a.herokuapp.com/api/users/qualification',
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json"
            },
          }
        )
        .then((response) => {
          toast({
            title: "Qualification information updated successfully!",
            description: "Refreach the page to see changes.",
            variant: "default",
            duration: 2000,
          });
          // alert("Qualification information updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating qualification information:", error);
          // alert("Failed to update qualification information. Please try again.");
          toast({
            title: "Failed to update qualification information",
            description: "Please try again.",
            variant: "destructive",
            duration: 2000,
        });
    }); 
    } else if (tab === "experience") {
      const payload = {
        // email: userEmail,
        // membershipId: memberId,
        companyName: formData.companyName || "",
        officeAddress: formData.officeAddress || "",
        position: formData.position || "",
        startDate: formData.startDate
          ? new Date(formData.startDate).toISOString()
          : null,
        endDate: formData.endDate
          ? new Date(formData.endDate).toISOString()
          : null
      };
      
      axios
        .patch(
          'https://ican-api-6000e8d06d3a.herokuapp.com/api/users/work-experience',
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json"
            },
          }
        )
        .then((response) => {
          toast({
            title: "Work experience updated successfully!",
            description: "Refreach the page to see changes.",
            variant: "default",
            duration: 2000,
          });
          // alert("Work experience updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating work experience:", error);
          toast({
            title: "Failed to update work experience",
            description: "Please try again.",
            variant: "destructive",
            duration: 2000,
          });
          // alert("Failed to update work experience. Please try again.");
        });
    }
  };
  
  

  const renderBiodata = () => (
    <>
      <div className="w-full mb-8 md:mb-16 flex flex-col md:flex-row md:gap-32 py-6 px-4">
        <h2 className="text-base font-medium mb-4">Profile Photo</h2>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          <div className="relative">
            {profilePhoto ? (
              <div className="relative">
                {typeof profilePhoto === 'string' ? (
                  // If profilePhoto is a URL string from the API
                  <div className="w-24 h-24 rounded-full border-2 border-gray-400 relative">
                    <Image
                      src={profilePhoto}
                      alt="Profile"
                      fill={true}
                      className="rounded-full object-cover"
                    />
                  </div>
                ) : (
                  // If profilePhoto is a File object from file upload
                  <div className="w-24 h-24 rounded-full border-2 border-gray-400 relative">
                    <Image
                      src={URL.createObjectURL(profilePhoto)}
                      alt="Profile picture"
                      fill={true}
                      className="rounded-full object-cover"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full border-2 border-gray-400 bg-gray-200 flex items-center justify-center">
                <Image
                  src="/avatar.png"
                  alt="Profile"
                  fill={true}
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-sm text-gray-500">
              (JPG or PNG, 100KB Max)
            </span>
            <div className="flex flex-wrap gap-4">
              <label className="bg-[#27378C] text-white px-6 py-2 rounded-full cursor-pointer hover:bg-blue-700 text-sm whitespace-nowrap">
                Update photo
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleDeletePhoto}
                className="bg-[#E7EAFF] text-[#27378C] px-6 py-2 rounded-full hover:bg-gray-200 text-sm whitespace-nowrap"
              >
                Delete photo
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr className="mb-8 border-gray-400" />
      <form onSubmit={handleSubmit}>
        {/* Biodata Section */}
        <div className="w-full mb-8 flex flex-col md:flex-row md:gap-40">
          <h2 className="text-base font-medium mb-4">Biodata</h2>
          <div className="w-full md:w-[70%] space-x-8">
            <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-10">
              <div>
                <label
                  htmlFor="surname"
                  className="block text-base font-semibold mb-2"
                >
                  Surname
                </label>
                <input
                  type="text"
                  id="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  placeholder="Enter your surname"
                  className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-base font-semibold mb-2"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="middleName"
                  className="block text-base font-semibold mb-2"
                >
                  Middle Name
                </label>
                <input
                  type="text"
                  id="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  placeholder="Enter your middle name"
                  className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="gender"
                  className="block text-base font-semibold mb-2"
                >
                  Gender
                </label>
                <select
                  className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="gender"
                  id="gender"
                  value={formData.gender || ""}
                  onChange={handleInputChange} 
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-base font-semibold mb-2"
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  placeholder="Enter your middle name"
                  className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="maritalStatus"
                  className="block text-base font-semibold mb-2"
                >
                  Marital Status
                </label>
                <select
                  className=" w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="maritalStatus"
                  id="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Marital Status</option>
                  <option value="Single">Single </option>
                  <option value="Married">Married </option>
                  <option value="Divorced">Divorced </option>
                  <option value="Widowed">Widowed </option>
                </select>
              </div>
              {/* Update your State of Origin field */}
              <div>
                <label
                  htmlFor="stateOfOrigin"
                  className="block text-base font-semibold mb-2"
                >
                  State of origin
                </label>
                <select
                  id="stateOfOrigin"
                  value={formData.stateOfOrigin || ""}
                  onChange={handleInputChanges}
                  className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select State</option>
                  {states.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              {/* Update your Nationality field */}
              <div>
                <label
                  htmlFor="nationality"
                  className="block text-base font-semibold mb-2"
                >
                  Nationality
                </label>
                <select
                  id="nationality"
                  value={formData.nationality || ""}
                  onChange={handleInputChanges}
                  className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Country</option>
                  <optgroup label="Asia">
                    <option value="Afghanistan">Afghanistan</option>
                    <option value="Armenia">Armenia</option>
                    <option value="Azerbaijan">Azerbaijan</option>
                    <option value="Bahrain">Bahrain</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Bhutan">Bhutan</option>
                    <option value="China">China</option>
                    <option value="India">India</option>
                    <option value="Japan">Japan</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    {/* ...other countries... */}
                  </optgroup>
                  <optgroup label="Europe">
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                    <option value="Italy">Italy</option>
                    <option value="Spain">Spain</option>
                    <option value="United Kingdom">United Kingdom</option>
                    {/* ...other countries... */}
                  </optgroup>
                  <optgroup label="Africa">
                    <option value="Nigeria">Nigeria</option>
                    <option value="South Africa">South Africa</option>
                    <option value="Egypt">Egypt</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Ghana">Ghana</option>
                    {/* ...other countries... */}
                  </optgroup>
                  {/* ...other regions... */}
                </select>
              </div>
              <div>
                <button
                  type="button"
                  className="w-full bg-primary text-white px-8 py-2 rounded-full hover:bg-blue-700"
                  onClick={() => handleUpdate("biodata")}
                >
                  Save changes
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="w-full text-[#27378C] px-8 py-2 rounded-full bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
  const renderContactDetails = () => (
    <>
      <div className="w-full mb-8 flex flex-col md:flex-row md:gap-[6.5rem]">
        <h2 className="text-base font-medium mb-4">Contact Details</h2>
        <div className="w-full md:w-[60%] grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="address"
              className="block text-base font-semibold mb-2"
            >
              Residential Address
            </label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter your address"
              className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-base font-semibold mb-2"
            >
              Contact Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="residentialCountry"
              className="block text-base font-semibold mb-2"
            >
              Residential Country
            </label>
            <select
              id="residentialCountry"
              value={formData.residentialCountry || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Country</option>
              <optgroup label="Asia">
                <option value="Afghanistan">Afghanistan</option>
                <option value="Armenia">Armenia</option>
                <option value="Azerbaijan">Azerbaijan</option>
                <option value="Bahrain">Bahrain</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="Bhutan">Bhutan</option>
                <option value="China">China</option>
                <option value="India">India</option>
                <option value="Japan">Japan</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
                {/* ...other countries... */}
              </optgroup>
              <optgroup label="Europe">
                <option value="France">France</option>
                <option value="Germany">Germany</option>
                <option value="Italy">Italy</option>
                <option value="Spain">Spain</option>
                <option value="United Kingdom">United Kingdom</option>
                {/* ...other countries... */}
              </optgroup>
              <optgroup label="Africa">
                <option value="Nigeria">Nigeria</option>
                <option value="South Africa">South Africa</option>
                <option value="Egypt">Egypt</option>
                <option value="Kenya">Kenya</option>
                <option value="Ghana">Ghana</option>
                {/* ...other countries... */}
              </optgroup>
              {/* ...other regions... */}
            </select>
          </div>
          <div>
            <label
              htmlFor="residentialState"
              className="block text-base font-semibold mb-2"
            >
              Residential State
            </label>
            <select
              id="residentialState"
              value={formData.residentialState || ""}
              onChange={handleInputChanges} // Add onChange handler
              className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select State</option>
              {states.map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="residentialCity"
              className="block text-base font-semibold mb-2"
            >
              Residential City
            </label>
            <input
              type="text"
              id="residentialCity"
              value={formData.residentialCity || ""}
              onChange={handleInputChange} // Add onChange handler
              placeholder="Enter your residential city"
              className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="residentialLGA"
              className="block text-base font-semibold mb-2"
            >
              Residential LGA
            </label>
            <input
              type="text"
              id="residentialLGA"
              value={formData.residentialLGA || ""}
              onChange={handleInputChange} // Add onChange handler
              placeholder="Enter your residential LGA"
              className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
  
      <div className="w-full mb-8 flex flex-col md:flex-row md:gap-[3rem]">
        <div className="w-[15%]"></div>
        <div className="md:w-[60%] grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            type="submit"
            className="sm:w-auto bg-primary text-white px-8 py-2 rounded-full hover:bg-blue-700"
            onClick={() => handleUpdate("contact")}
          >
            Save changes
          </button>
          <button
            type="button"
            className="sm:w-auto text-[#27378C] px-8 py-2 rounded-full bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
  const renderEducationDetail = () => (
    <>
      <div className="w-full mb-8 flex flex-col md:flex-row md:gap-[3rem]">
        <h2 className="text-base font-medium mb-4 md:w-[15%]">
          Educational and Professional Qualififcation
        </h2>
        <div className="w-full md:w-[60%] grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="institution"
              className="block text-base font-semibold mb-2"
            >
              Institution
            </label>
            <input
              type="text"
              id="institution"
              value={formData.institution}
              onChange={handleInputChange}
              placeholder="Enter your country"
              className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="discipline"
              className="block text-base font-semibold mb-2"
            >
              Discipline
            </label>
            <input
              type="text"
              id="discipline"
              value={formData.discipline}
              onChange={handleInputChange}
              placeholder="Enter your discipline"
              className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="qualification"
              className="block text-base font-semibold mb-2"
            >
              Qualification
            </label>
            <select
              className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="qualification"
              value={formData.qualification}
              onChange={handleInputChange}
              id="qualification"
              required
            >
              <option value="">Select discipline</option>
              <option value="HND">HND </option>
              <option value="BBA">
                Bachelor of Business Administration (BBA)
              </option>
              <option value="BSc">Bachelor of Science (BSc)</option>
              <option value="BTech">Bachelor of Technology (BTech)</option>
              <option value="BScEdu">
                Bachelor of Science Education(BSc Edu) Education
              </option>
              <option value="MBA">
                {" "}
                Master of Business Administration (MBA)
              </option>
              <option value="ME">Master of Engineering (ME)</option>
              <option value="MSc">Master of Science (MSc)</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="yearOfGraduation"
              className="block text-base font-semibold mb-2"
            >
              Year of Graduation
            </label>
            <input
              className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="yearOfGraduation"
              id="yearOfGraduation"
              value={formData.yearOfGraduation}
              onChange={handleInputChange}
              required
              type="number"
              min={1900}
              max={2099}
              step={1}
              placeholder="2024"
            />
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-base font-semibold mb-2"
            >
              Status
            </label>
            <select
              className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="status"
              value={formData.status || ""}
              onChange={handleInputChange}
              id="status"
              required
            >
              <option value="">Select status</option>
              <option value="FCA">FCA</option>
              <option value="ACA">ACA</option>
              <option value="Student">Student</option>
            </select>
          </div>
        </div>
      </div>
      <div className="w-full mb-8 flex flex-col md:flex-row md:gap-[3rem]">
        <div className="w-[15%]"></div>
        <div className="md:w-[60%] grid grid-cols-2 ap-6">
          <button
            type="submit"
            className="sm:w-auto bg-primary text-white px-8 py-2 rounded-full hover:bg-blue-700"
            onClick={() => handleUpdate("qualification")}
          >
            Save changes
          </button>
          <button
            type="button"
            className="sm:w-auto text-[#27378C] px-8 py-2 rounded-full bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
  const renderWorkExperience = () => (
    <>
      <div className="w-full mb-8 flex flex-col md:flex-row md:gap-[3rem]">
        <h2 className="text-base font-medium mb-4 md:w-[15%]">
          Work Experience
        </h2>
        <div className="md:w-[60%] grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="companyName"
              className="block text-base font-semibold mb-2"
            >
              Name of Company
            </label>
            <input
              type="text"
              id="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="Enter your discipline"
              className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div></div>
          <div>
            <label
              htmlFor="officeAddress"
              className="block text-base font-semibold mb-2"
            >
              Office Address
            </label>
            <input
              type="text"
              id="officeAddress"
              value={formData.officeAddress}
              onChange={handleInputChange}
              placeholder="Enter your country"
              className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div></div>
          <div>
            <label
              htmlFor="position"
              className="block text-base font-semibold mb-2"
            >
              Position/Role
            </label>
            <input
              type="text"
              id="position"
              value={formData.position}
              onChange={handleInputChange}
              placeholder="Enter your country"
              className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      <div className="w-full mb-8 flex flex-col md:flex-row md:gap-[3rem]">
        <div className="w-[15%]"></div>
        <div className="md:w-[60%] grid grid-cols-2 ap-6">
          <button
            type="submit"
            className="sm:w-auto bg-primary text-white px-8 py-2 rounded-full hover:bg-blue-700"
            onClick={() => handleUpdate("experience")}
          >
            Save changes
          </button>
          <button
            type="button"
            className="sm:w-auto text-[#27378C] px-8 py-2 rounded-full bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="py-4 px-2">
      <div className="p-4 bg-white rounded-lg border border-gray-300 ">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Profile Management
        </h1>

        {/* Personal Details Section */}
        <div className="w-full mb-4">
          {/* <h2 className="text-lg font-semibold mb-2">Personal Details</h2> */}
          <p className="text-sm text-gray-500 mb-4">
            Edit your profile details here
          </p>
        </div>

        <div className="w-full mb-4">
          <div className="flex w-full max-w-[800px] bg-gray-200 rounded-xl p-1">
            <button
              onClick={() => handleTabChange("biodata")}
              className={`flex-1 text-xs px-2  py-2 rounded-lg hover:bg-blue-700 ${
                activeTab === "biodata"
                  ? "bg-primary text-white"
                  : "text-gray-800 hover:bg-gray-300"
              }`}
            >
              Photo and Biodata
            </button>
            <button
              onClick={() => handleTabChange("contact")}
              className={`flex-1 text-xs px-2 md:px-4 lg:px-8 py-2 rounded-lg ${
                activeTab === "contact"
                  ? "bg-primary text-white"
                  : "text-gray-800 hover:bg-gray-300"
              }`}
            >
              Contact details
            </button>
            <button
              onClick={() => handleTabChange("qualification")}
              className={`flex-1 text-xs px-2 md:px-4 lg:px-8 py-2 rounded-lg ${
                activeTab === "qualification"
                  ? "bg-primary text-white"
                  : "text-gray-800 hover:bg-gray-300"
              }`}
            >
              Education and Professional Qualification
            </button>
            <button
              onClick={() => handleTabChange("experience")}
              className={`flex-1 text-xs px-2 md:px-4 lg:px-8 py-2 rounded-lg ${
                activeTab === "experience"
                  ? "bg-primary text-white"
                  : "text-gray-800 hover:bg-gray-300"
              }`}
            >
              Work Experience
            </button>
          </div>
          {/* <div className="text-sm text-gray-500 mt-6">{getTabDescription()}</div> */}
        </div>
        <hr className="mb-8 border-gray-400" />
        <form onSubmit={handleSubmit}></form>

        {/* Profile Photo Section */}

        {activeTab === "biodata" && renderBiodata()}
        {activeTab === "contact" && renderContactDetails()}
        {activeTab === "qualification" && renderEducationDetail()}
        {activeTab === "experience" && renderWorkExperience()}
      </div>
    </div>
  );
}

export default Profile;


