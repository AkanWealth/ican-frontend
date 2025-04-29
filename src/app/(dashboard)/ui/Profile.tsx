"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { nigerianStates } from "@/lib/States";
import { nigerianStatesLGAs } from "@/lib/nigerianStatesLGAs";
import { nigerianStatesCity } from "@/lib/NigeriaCity";
import Image from "next/image";
import axios from "axios";
import { uploadImageToCloud } from "@/lib/uploadImage";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/services/apiClient";
import { parseCookies } from "nookies";

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
  const { toast } = useToast();
  const router = useRouter();

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

    const cookies = parseCookies();
    const userDataCookie = cookies['user_data'];
    const userData = userDataCookie ? JSON.parse(userDataCookie) : null;
    const userId = userData?.id;
    console.log("userId", userId);

    if (userId) {
      apiClient.get(`/users/${userId}`)
        .then((data) => {
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

  const handleCancel = () => {
    router.push("/Overview"); // Replace with your actual overview page path
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
  const s3Loader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
    return `${src}?w=${width}&q=${quality || 75}`;
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
        toast({
          title: "Photo uploaded. Click on Save Changes to successfully update photo.",
          description: "",
          variant: "default",
          duration: 2000,
        });

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

    // const user = localStorage.getItem("user");
    // const userId = user ? JSON.parse(user)?.id : null;
    // const userEmail = user ? JSON.parse(user)?.email : null;
    // const memberId = user ? JSON.parse(user)?.membershipId : null;
    const cookies = parseCookies();
    const userDataCookie = cookies['user_data'];
    const userData = userDataCookie ? JSON.parse(userDataCookie) : null;
    const userId = userData?.id;
    const memberId = userData?.membershipId;
    const userEmail = userData?.email;

    console.log("userId", userId);
    console.log("memberId", memberId);
    console.log(userEmail)

    if (!userId) throw new Error("User ID not found in cookies");





    // if (!userId || !userEmail || !memberId) return;

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
      console.log("Biodata payload:", payload); 
      apiClient.patch('/users/profile', payload)
        .then((response) => {
          toast({
            title: "Biodata updated successfully!",
            description: "Refresh the page to see changes.",
            variant: "default",
            duration: 2000,
          });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          // setTimeout(() => {
          //   router.push("/Overview");
          // }, 2000); // Add a delay to allow the toast to display
        })
        .catch((error) => {
          console.error("Error updating biodata:=", error);
          toast({
            title: "Failed to update biodata",
            description: "Please try again.",
            variant: "destructive",
            duration: 2000,
          });
          // alert("Failed to update biodata. Please try again.");
        });
    } else if (tab === "contact") {
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

      apiClient.patch('/users/contact', payload)
        .then((response) => {
          toast({
            title: "Contact information updated successfully!",
            description: "Refresh the page to see changes.",
            variant: "default",
            duration: 2000,
          });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          // setTimeout(() => {
          //   router.push("/Overview");
          // }, 1000); // Add a delay to allow the toast to display
        })
        .catch((error) => {
          toast({
            title: "Failed to update contact information",
            description: "Please try again.",
            variant: "destructive",
            duration: 2000,
          });
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

      apiClient.patch('/users/qualification', payload)
        .then((response) => {
          toast({
            title: "Qualification information updated successfully!",
            description: "Refreach the page to see changes.",
            variant: "default",
            duration: 2000,
          });

          setTimeout(() => {
            window.location.reload();
          }, 2000);
          // setTimeout(() => {
          //   router.push("/Overview");
          // }, 2000); // Add a delay to allow the toast to display
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

      apiClient.patch('/users/work-experience', payload)
        .then((response) => {
          toast({
            title: "Work experience updated successfully!",
            description: "Refreach the page to see changes.",
            variant: "default",
            duration: 2000,
          });
          setTimeout(() => {
            window.location.reload();
          }, 2000);

          // setTimeout(() => {
          //   router.push("/Overview");
          // }, 2000); // Add a delay to allow the toast to display
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
                      unoptimized={true}
                      className="w-full rounded-full object-cover"
                    />
                  </div>
                ) : (
                  // If profilePhoto is a File object from file upload
                  <div className="w-24 h-24 rounded-full border-2 border-gray-400 relative">
                    <Image
                      src={URL.createObjectURL(profilePhoto)}
                      alt="Profile picture"
                      width={200}
                      height={200}
                      unoptimized={true}
                      className="w-full rounded-full object-cover"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full border-2 border-gray-400 bg-gray-200 flex items-center justify-center">
                <Image
                  src="/AvatarPicture.jpg"
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
              <label className={`
                bg-[#27378C] text-white px-6 py-2 rounded-full cursor-pointer hover:bg-blue-700 text-sm whitespace-nowrap
                ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
              `}>
                {isLoading ? "Updating..." : "Update photo"}
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={isLoading}
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
              <option value="British Indian Ocean Territory">
                British Indian Ocean Territory
              </option>
              <option value="Brunei Darussalam">Brunei Darussalam</option>
              <option value="Cambodia">Cambodia</option>
              <option value="China">China</option>
              <option value="Christmas Island">Christmas Island</option>
              <option value="Cocos (Keeling) Islands">
                Cocos (Keeling) Islands
              </option>
              <option value="Cyprus">Cyprus</option>
              <option value="Georgia">Georgia</option>
              <option value="Hong Kong">Hong Kong</option>
              <option value="India">India</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Iran">Iran</option>
              <option value="Iraq">Iraq</option>
              <option value="Israel">Israel</option>
              <option value="Japan">Japan</option>
              <option value="Jordan">Jordan</option>
              <option value="Kazakhstan">Kazakhstan</option>
              <option value="Korea, North">Korea, North</option>
              <option value="Korea, South">Korea, South</option>
              <option value="Kuwait">Kuwait</option>
              <option value="Kyrgyzstan">Kyrgyzstan</option>
              <option value="Lao People's Democratic Republic">
                Lao People's Democratic Republic
              </option>
              <option value="Lebanon">Lebanon</option>
              <option value="Macao">Macao</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Maldives">Maldives</option>
              <option value="Mongolia">Mongolia</option>
              <option value="Myanmar (Burma)">Myanmar (Burma)</option>
              <option value="Nepal">Nepal</option>
              <option value="Oman">Oman</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Palestine">Palestine</option>
              <option value="Philippines">Philippines</option>
              <option value="Qatar">Qatar</option>
              <option value="Russian Federation">Russian Federation</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Singapore">Singapore</option>
              <option value="Sri Lanka">Sri Lanka</option>
              <option value="Syria">Syria</option>
              <option value="Taiwan">Taiwan</option>
              <option value="Tajikistan">Tajikistan</option>
              <option value="Thailand">Thailand</option>
              <option value="Timor-Leste">Timor-Leste</option>
              <option value="Turkey (Türkiye)">Turkey (Türkiye)</option>
              <option value="Turkmenistan">Turkmenistan</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="Uzbekistan">Uzbekistan</option>
              <option value="Vietnam">Vietnam</option>
              <option value="Yemen">Yemen</option>
            </optgroup>
            <optgroup label="Europe">
              <option value="Åland Islands">Åland Islands</option>
              <option value="Albania">Albania</option>
              <option value="Andorra">Andorra</option>
              <option value="Austria">Austria</option>
              <option value="Belarus">Belarus</option>
              <option value="Belgium">Belgium</option>
              <option value="Bosnia and Herzegovina">
                Bosnia and Herzegovina
              </option>
              <option value="Bulgaria">Bulgaria</option>
              <option value="Croatia">Croatia</option>
              <option value="Czech Republic">Czech Republic</option>
              <option value="Denmark">Denmark</option>
              <option value="Estonia">Estonia</option>
              <option value="Faroe Islands">Faroe Islands</option>
              <option value="Finland">Finland</option>
              <option value="France">France</option>
              <option value="Germany">Germany</option>
              <option value="Gibraltar">Gibraltar</option>
              <option value="Greece">Greece</option>
              <option value="Guernsey">Guernsey</option>
              <option value="Hungary">Hungary</option>
              <option value="Iceland">Iceland</option>
              <option value="Ireland">Ireland</option>
              <option value="Isle of Man">Isle of Man</option>
              <option value="Italy">Italy</option>
              <option value="Jersey">Jersey</option>
              <option value="Kosovo">Kosovo</option>
              <option value="Latvia">Latvia</option>
              <option value="Liechtenstein">Liechtenstein</option>
              <option value="Lithuania">Lithuania</option>
              <option value="Luxembourg">Luxembourg</option>
              <option value="Macedonia North">Macedonia North</option>
              <option value="Malta">Malta</option>
              <option value="Moldova">Moldova</option>
              <option value="Monaco">Monaco</option>
              <option value="Montenegro">Montenegro</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Norway">Norway</option>
              <option value="Poland">Poland</option>
              <option value="Portugal">Portugal</option>
              <option value="Romania">Romania</option>
              <option value="San Marino">San Marino</option>
              <option value="Serbia">Serbia</option>
              <option value="Serbia and Montenegro">
                Serbia and Montenegro
              </option>
              <option value="Slovakia">Slovakia</option>
              <option value="Slovenia">Slovenia</option>
              <option value="Spain">Spain</option>
              <option value="Svalbard and Jan Mayen">
                Svalbard and Jan Mayen
              </option>
              <option value="Sweden">Sweden</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Ukraine">Ukraine</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Vatican City Holy See">
                Vatican City Holy See
              </option>
            </optgroup>
            <optgroup label="Africa">
              <option value="Algeria">Algeria</option>
              <option value="Angola">Angola</option>
              <option value="Benin">Benin</option>
              <option value="Botswana">Botswana</option>
              <option value="Burkina Faso">Burkina Faso</option>
              <option value="Burundi">Burundi</option>
              <option value="Cabo Verde">Cabo Verde</option>
              <option value="Cameroon">Cameroon</option>
              <option value="Central African Republic">
                Central African Republic
              </option>
              <option value="Chad">Chad</option>
              <option value="Comoros">Comoros</option>
              <option value="Congo">Congo</option>
              <option value="Congo, Democratic Republic of the">
                Congo, Democratic Republic of the
              </option>
              <option value="Côte d'Ivoire">Côte d'Ivoire</option>
              <option value="Djibouti">Djibouti</option>
              <option value="Egypt">Egypt</option>
              <option value="Equatorial Guinea">Equatorial Guinea</option>
              <option value="Eritrea">Eritrea</option>
              <option value="Eswatini (Swaziland)">Eswatini (Swaziland)</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Gabon">Gabon</option>
              <option value="Gambia">Gambia</option>
              <option value="Ghana">Ghana</option>
              <option value="Guinea">Guinea</option>
              <option value="Guinea-Bissau">Guinea-Bissau</option>
              <option value="Kenya">Kenya</option>
              <option value="Lesotho">Lesotho</option>
              <option value="Liberia">Liberia</option>
              <option value="Libya">Libya</option>
              <option value="Madagascar">Madagascar</option>
              <option value="Malawi">Malawi</option>
              <option value="Mali">Mali</option>
              <option value="Mauritania">Mauritania</option>
              <option value="Mauritius">Mauritius</option>
              <option value="Mayotte">Mayotte</option>
              <option value="Morocco">Morocco</option>
              <option value="Mozambique">Mozambique</option>
              <option value="Namibia">Namibia</option>
              <option value="Niger">Niger</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Reunion">Reunion</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Saint Helena">Saint Helena</option>
              <option value="Sao Tome and Principe">
                Sao Tome and Principe
              </option>
              <option value="Senegal">Senegal</option>
              <option value="Seychelles">Seychelles</option>
              <option value="Sierra Leone">Sierra Leone</option>
              <option value="Somalia">Somalia</option>
              <option value="South Africa">South Africa</option>
              <option value="South Sudan">South Sudan</option>
              <option value="Sudan">Sudan</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Togo">Togo</option>
              <option value="Tunisia">Tunisia</option>
              <option value="Uganda">Uganda</option>
              <option value="Western Sahara">Western Sahara</option>
              <option value="Zambia">Zambia</option>
              <option value="Zimbabwe">Zimbabwe</option>
            </optgroup>
            <optgroup label="Australia (Oceania)">
              <option value="American Samoa">American Samoa</option>
              <option value="Australia">Australia</option>
              <option value="Cook Islands">Cook Islands</option>
              <option value="Fiji">Fiji</option>
              <option value="French Polynesia">French Polynesia</option>
              <option value="Guam">Guam</option>
              <option value="Kiribati">Kiribati</option>
              <option value="Marshall Islands">Marshall Islands</option>
              <option value="Micronesia">Micronesia</option>
              <option value="Nauru">Nauru</option>
              <option value="New Caledonia">New Caledonia</option>
              <option value="New Zealand">New Zealand</option>
              <option value="Niue">Niue</option>
              <option value="Norfolk Island">Norfolk Island</option>
              <option value="Northern Mariana Islands">
                Northern Mariana Islands
              </option>
              <option value="Palau">Palau</option>
              <option value="Papua New Guinea">Papua New Guinea</option>
              <option value="Pitcairn Islands">Pitcairn Islands</option>
              <option value="Samoa">Samoa</option>
              <option value="Solomon Islands">Solomon Islands</option>
              <option value="Tokelau">Tokelau</option>
              <option value="Tonga">Tonga</option>
              <option value="Tuvalu">Tuvalu</option>
              <option value="Vanuatu">Vanuatu</option>
              <option value="Wallis and Futuna">Wallis and Futuna</option>
            </optgroup>
            <optgroup label="North America">
              <option value="Anguilla">Anguilla</option>
              <option value="Antigua and Barbuda">Antigua and Barbuda</option>
              <option value="Aruba">Aruba</option>
              <option value="Bahamas">Bahamas</option>
              <option value="Barbados">Barbados</option>
              <option value="Belize">Belize</option>
              <option value="Bermuda">Bermuda</option>
              <option value="Canada">Canada</option>
              <option value="Caribbean Netherlands">
                Caribbean Netherlands
              </option>
              <option value="Cayman Islands">Cayman Islands</option>
              <option value="Costa Rica">Costa Rica</option>
              <option value="Cuba">Cuba</option>
              <option value="Curaçao">Curaçao</option>
              <option value="Dominica">Dominica</option>
              <option value="Dominican Republic">Dominican Republic</option>
              <option value="El Salvador">El Salvador</option>
              <option value="Greenland">Greenland</option>
              <option value="Grenada">Grenada</option>
              <option value="Guadeloupe">Guadeloupe</option>
              <option value="Guatemala">Guatemala</option>
              <option value="Haiti">Haiti</option>
              <option value="Honduras">Honduras</option>
              <option value="Jamaica">Jamaica</option>
              <option value="Martinique">Martinique</option>
              <option value="Mexico">Mexico</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Netherlands Antilles">Netherlands Antilles</option>
              <option value="Nicaragua">Nicaragua</option>
              <option value="Panama">Panama</option>
              <option value="Puerto Rico">Puerto Rico</option>
              <option value="Saint Barthelemy">Saint Barthelemy</option>
              <option value="Saint Kitts and Nevis">
                Saint Kitts and Nevis
              </option>
              <option value="Saint Lucia">Saint Lucia</option>
              <option value="Saint Martin">Saint Martin</option>
              <option value="Saint Pierre and Miquelon">
                Saint Pierre and Miquelon
              </option>
              <option value="Saint Vincent and the Grenadines">
                Saint Vincent and the Grenadines
              </option>
              <option value="Sint Maarten">Sint Maarten</option>
              <option value="Trinidad and Tobago">Trinidad and Tobago</option>
              <option value="Turks and Caicos Islands">
                Turks and Caicos Islands
              </option>
              <option value="U.S. Outlying Islands">
                U.S. Outlying Islands
              </option>
              <option value="United States">United States</option>
              <option value="Virgin Islands, British">
                Virgin Islands, British
              </option>
              <option value="Virgin Islands, U.S">Virgin Islands, U.S</option>
            </optgroup>
            <optgroup label="Antarctica">
              <option value="Antarctica">Antarctica</option>
              <option value="Bouvet Island">Bouvet Island</option>
              <option value="French Southern Territories">
                French Southern Territories
              </option>
              <option value="Heard Island and Mcdonald Islands">
                Heard Island and Mcdonald Islands
              </option>
              <option value="South Georgia and the South Sandwich Islands">
                South Georgia and the South Sandwich Islands
              </option>
            </optgroup>
            <optgroup label="South America">
              <option value="Argentina">Argentina</option>
              <option value="Bolivia (Plurinational State of)">
                Bolivia (Plurinational State of)
              </option>
              <option value="Brazil">Brazil</option>
              <option value="Chile">Chile</option>
              <option value="Colombia">Colombia</option>
              <option value="Ecuador">Ecuador</option>
              <option value="Falkland Islands (Malvinas)">
                Falkland Islands (Malvinas)
              </option>
              <option value="French Guiana">French Guiana</option>
              <option value="Guyana">Guyana</option>
              <option value="Paraguay">Paraguay</option>
              <option value="Peru">Peru</option>
              <option value="Suriname">Suriname</option>
              <option value="Uruguay">Uruguay</option>
              <option value="Venezuela">Venezuela</option>
            </optgroup>
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
                  onClick={handleCancel}
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
              <option value="British Indian Ocean Territory">
                British Indian Ocean Territory
              </option>
              <option value="Brunei Darussalam">Brunei Darussalam</option>
              <option value="Cambodia">Cambodia</option>
              <option value="China">China</option>
              <option value="Christmas Island">Christmas Island</option>
              <option value="Cocos (Keeling) Islands">
                Cocos (Keeling) Islands
              </option>
              <option value="Cyprus">Cyprus</option>
              <option value="Georgia">Georgia</option>
              <option value="Hong Kong">Hong Kong</option>
              <option value="India">India</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Iran">Iran</option>
              <option value="Iraq">Iraq</option>
              <option value="Israel">Israel</option>
              <option value="Japan">Japan</option>
              <option value="Jordan">Jordan</option>
              <option value="Kazakhstan">Kazakhstan</option>
              <option value="Korea, North">Korea, North</option>
              <option value="Korea, South">Korea, South</option>
              <option value="Kuwait">Kuwait</option>
              <option value="Kyrgyzstan">Kyrgyzstan</option>
              <option value="Lao People's Democratic Republic">
                Lao People's Democratic Republic
              </option>
              <option value="Lebanon">Lebanon</option>
              <option value="Macao">Macao</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Maldives">Maldives</option>
              <option value="Mongolia">Mongolia</option>
              <option value="Myanmar (Burma)">Myanmar (Burma)</option>
              <option value="Nepal">Nepal</option>
              <option value="Oman">Oman</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Palestine">Palestine</option>
              <option value="Philippines">Philippines</option>
              <option value="Qatar">Qatar</option>
              <option value="Russian Federation">Russian Federation</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Singapore">Singapore</option>
              <option value="Sri Lanka">Sri Lanka</option>
              <option value="Syria">Syria</option>
              <option value="Taiwan">Taiwan</option>
              <option value="Tajikistan">Tajikistan</option>
              <option value="Thailand">Thailand</option>
              <option value="Timor-Leste">Timor-Leste</option>
              <option value="Turkey (Türkiye)">Turkey (Türkiye)</option>
              <option value="Turkmenistan">Turkmenistan</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="Uzbekistan">Uzbekistan</option>
              <option value="Vietnam">Vietnam</option>
              <option value="Yemen">Yemen</option>
            </optgroup>
            <optgroup label="Europe">
              <option value="Åland Islands">Åland Islands</option>
              <option value="Albania">Albania</option>
              <option value="Andorra">Andorra</option>
              <option value="Austria">Austria</option>
              <option value="Belarus">Belarus</option>
              <option value="Belgium">Belgium</option>
              <option value="Bosnia and Herzegovina">
                Bosnia and Herzegovina
              </option>
              <option value="Bulgaria">Bulgaria</option>
              <option value="Croatia">Croatia</option>
              <option value="Czech Republic">Czech Republic</option>
              <option value="Denmark">Denmark</option>
              <option value="Estonia">Estonia</option>
              <option value="Faroe Islands">Faroe Islands</option>
              <option value="Finland">Finland</option>
              <option value="France">France</option>
              <option value="Germany">Germany</option>
              <option value="Gibraltar">Gibraltar</option>
              <option value="Greece">Greece</option>
              <option value="Guernsey">Guernsey</option>
              <option value="Hungary">Hungary</option>
              <option value="Iceland">Iceland</option>
              <option value="Ireland">Ireland</option>
              <option value="Isle of Man">Isle of Man</option>
              <option value="Italy">Italy</option>
              <option value="Jersey">Jersey</option>
              <option value="Kosovo">Kosovo</option>
              <option value="Latvia">Latvia</option>
              <option value="Liechtenstein">Liechtenstein</option>
              <option value="Lithuania">Lithuania</option>
              <option value="Luxembourg">Luxembourg</option>
              <option value="Macedonia North">Macedonia North</option>
              <option value="Malta">Malta</option>
              <option value="Moldova">Moldova</option>
              <option value="Monaco">Monaco</option>
              <option value="Montenegro">Montenegro</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Norway">Norway</option>
              <option value="Poland">Poland</option>
              <option value="Portugal">Portugal</option>
              <option value="Romania">Romania</option>
              <option value="San Marino">San Marino</option>
              <option value="Serbia">Serbia</option>
              <option value="Serbia and Montenegro">
                Serbia and Montenegro
              </option>
              <option value="Slovakia">Slovakia</option>
              <option value="Slovenia">Slovenia</option>
              <option value="Spain">Spain</option>
              <option value="Svalbard and Jan Mayen">
                Svalbard and Jan Mayen
              </option>
              <option value="Sweden">Sweden</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Ukraine">Ukraine</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Vatican City Holy See">
                Vatican City Holy See
              </option>
            </optgroup>
            <optgroup label="Africa">
              <option value="Algeria">Algeria</option>
              <option value="Angola">Angola</option>
              <option value="Benin">Benin</option>
              <option value="Botswana">Botswana</option>
              <option value="Burkina Faso">Burkina Faso</option>
              <option value="Burundi">Burundi</option>
              <option value="Cabo Verde">Cabo Verde</option>
              <option value="Cameroon">Cameroon</option>
              <option value="Central African Republic">
                Central African Republic
              </option>
              <option value="Chad">Chad</option>
              <option value="Comoros">Comoros</option>
              <option value="Congo">Congo</option>
              <option value="Congo, Democratic Republic of the">
                Congo, Democratic Republic of the
              </option>
              <option value="Côte d'Ivoire">Côte d'Ivoire</option>
              <option value="Djibouti">Djibouti</option>
              <option value="Egypt">Egypt</option>
              <option value="Equatorial Guinea">Equatorial Guinea</option>
              <option value="Eritrea">Eritrea</option>
              <option value="Eswatini (Swaziland)">Eswatini (Swaziland)</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Gabon">Gabon</option>
              <option value="Gambia">Gambia</option>
              <option value="Ghana">Ghana</option>
              <option value="Guinea">Guinea</option>
              <option value="Guinea-Bissau">Guinea-Bissau</option>
              <option value="Kenya">Kenya</option>
              <option value="Lesotho">Lesotho</option>
              <option value="Liberia">Liberia</option>
              <option value="Libya">Libya</option>
              <option value="Madagascar">Madagascar</option>
              <option value="Malawi">Malawi</option>
              <option value="Mali">Mali</option>
              <option value="Mauritania">Mauritania</option>
              <option value="Mauritius">Mauritius</option>
              <option value="Mayotte">Mayotte</option>
              <option value="Morocco">Morocco</option>
              <option value="Mozambique">Mozambique</option>
              <option value="Namibia">Namibia</option>
              <option value="Niger">Niger</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Reunion">Reunion</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Saint Helena">Saint Helena</option>
              <option value="Sao Tome and Principe">
                Sao Tome and Principe
              </option>
              <option value="Senegal">Senegal</option>
              <option value="Seychelles">Seychelles</option>
              <option value="Sierra Leone">Sierra Leone</option>
              <option value="Somalia">Somalia</option>
              <option value="South Africa">South Africa</option>
              <option value="South Sudan">South Sudan</option>
              <option value="Sudan">Sudan</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Togo">Togo</option>
              <option value="Tunisia">Tunisia</option>
              <option value="Uganda">Uganda</option>
              <option value="Western Sahara">Western Sahara</option>
              <option value="Zambia">Zambia</option>
              <option value="Zimbabwe">Zimbabwe</option>
            </optgroup>
            <optgroup label="Australia (Oceania)">
              <option value="American Samoa">American Samoa</option>
              <option value="Australia">Australia</option>
              <option value="Cook Islands">Cook Islands</option>
              <option value="Fiji">Fiji</option>
              <option value="French Polynesia">French Polynesia</option>
              <option value="Guam">Guam</option>
              <option value="Kiribati">Kiribati</option>
              <option value="Marshall Islands">Marshall Islands</option>
              <option value="Micronesia">Micronesia</option>
              <option value="Nauru">Nauru</option>
              <option value="New Caledonia">New Caledonia</option>
              <option value="New Zealand">New Zealand</option>
              <option value="Niue">Niue</option>
              <option value="Norfolk Island">Norfolk Island</option>
              <option value="Northern Mariana Islands">
                Northern Mariana Islands
              </option>
              <option value="Palau">Palau</option>
              <option value="Papua New Guinea">Papua New Guinea</option>
              <option value="Pitcairn Islands">Pitcairn Islands</option>
              <option value="Samoa">Samoa</option>
              <option value="Solomon Islands">Solomon Islands</option>
              <option value="Tokelau">Tokelau</option>
              <option value="Tonga">Tonga</option>
              <option value="Tuvalu">Tuvalu</option>
              <option value="Vanuatu">Vanuatu</option>
              <option value="Wallis and Futuna">Wallis and Futuna</option>
            </optgroup>
            <optgroup label="North America">
              <option value="Anguilla">Anguilla</option>
              <option value="Antigua and Barbuda">Antigua and Barbuda</option>
              <option value="Aruba">Aruba</option>
              <option value="Bahamas">Bahamas</option>
              <option value="Barbados">Barbados</option>
              <option value="Belize">Belize</option>
              <option value="Bermuda">Bermuda</option>
              <option value="Canada">Canada</option>
              <option value="Caribbean Netherlands">
                Caribbean Netherlands
              </option>
              <option value="Cayman Islands">Cayman Islands</option>
              <option value="Costa Rica">Costa Rica</option>
              <option value="Cuba">Cuba</option>
              <option value="Curaçao">Curaçao</option>
              <option value="Dominica">Dominica</option>
              <option value="Dominican Republic">Dominican Republic</option>
              <option value="El Salvador">El Salvador</option>
              <option value="Greenland">Greenland</option>
              <option value="Grenada">Grenada</option>
              <option value="Guadeloupe">Guadeloupe</option>
              <option value="Guatemala">Guatemala</option>
              <option value="Haiti">Haiti</option>
              <option value="Honduras">Honduras</option>
              <option value="Jamaica">Jamaica</option>
              <option value="Martinique">Martinique</option>
              <option value="Mexico">Mexico</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Netherlands Antilles">Netherlands Antilles</option>
              <option value="Nicaragua">Nicaragua</option>
              <option value="Panama">Panama</option>
              <option value="Puerto Rico">Puerto Rico</option>
              <option value="Saint Barthelemy">Saint Barthelemy</option>
              <option value="Saint Kitts and Nevis">
                Saint Kitts and Nevis
              </option>
              <option value="Saint Lucia">Saint Lucia</option>
              <option value="Saint Martin">Saint Martin</option>
              <option value="Saint Pierre and Miquelon">
                Saint Pierre and Miquelon
              </option>
              <option value="Saint Vincent and the Grenadines">
                Saint Vincent and the Grenadines
              </option>
              <option value="Sint Maarten">Sint Maarten</option>
              <option value="Trinidad and Tobago">Trinidad and Tobago</option>
              <option value="Turks and Caicos Islands">
                Turks and Caicos Islands
              </option>
              <option value="U.S. Outlying Islands">
                U.S. Outlying Islands
              </option>
              <option value="United States">United States</option>
              <option value="Virgin Islands, British">
                Virgin Islands, British
              </option>
              <option value="Virgin Islands, U.S">Virgin Islands, U.S</option>
            </optgroup>
            <optgroup label="Antarctica">
              <option value="Antarctica">Antarctica</option>
              <option value="Bouvet Island">Bouvet Island</option>
              <option value="French Southern Territories">
                French Southern Territories
              </option>
              <option value="Heard Island and Mcdonald Islands">
                Heard Island and Mcdonald Islands
              </option>
              <option value="South Georgia and the South Sandwich Islands">
                South Georgia and the South Sandwich Islands
              </option>
            </optgroup>
            <optgroup label="South America">
              <option value="Argentina">Argentina</option>
              <option value="Bolivia (Plurinational State of)">
                Bolivia (Plurinational State of)
              </option>
              <option value="Brazil">Brazil</option>
              <option value="Chile">Chile</option>
              <option value="Colombia">Colombia</option>
              <option value="Ecuador">Ecuador</option>
              <option value="Falkland Islands (Malvinas)">
                Falkland Islands (Malvinas)
              </option>
              <option value="French Guiana">French Guiana</option>
              <option value="Guyana">Guyana</option>
              <option value="Paraguay">Paraguay</option>
              <option value="Peru">Peru</option>
              <option value="Suriname">Suriname</option>
              <option value="Uruguay">Uruguay</option>
              <option value="Venezuela">Venezuela</option>
            </optgroup>
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
            onClick={handleCancel}
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
              {/* Diploma and Certificates */}
              <option value="SSCE">Senior Secondary Certificate Examination (SSCE)</option>
              <option value="OND">Ordinary National Diploma (OND)</option>
              <option value="NCE">Nigeria Certificate in Education (NCE)</option>
              <option value="HND">Higher National Diploma (HND)</option>

              {/* Bachelor's Degrees */}
              <option value="BA">Bachelor of Arts (BA)</option>
              <option value="BSc">Bachelor of Science (BSc)</option>
              <option value="BTech">Bachelor of Technology (BTech)</option>
              <option value="BEng">Bachelor of Engineering (BEng)</option>
              <option value="BEd">Bachelor of Education (BEd)</option>
              <option value="BScEd">Bachelor of Science Education (BSc Ed)</option>
              <option value="LLB">Bachelor of Laws (LLB)</option>
              <option value="BPharm">Bachelor of Pharmacy (BPharm)</option>
              <option value="MBBS">Bachelor of Medicine, Bachelor of Surgery (MBBS)</option>
              <option value="BMLS">Bachelor of Medical Laboratory Science (BMLS)</option>
              <option value="BBA">Bachelor of Business Administration (BBA)</option>
              <option value="BNSc">Bachelor of Nursing Science (BNSc)</option>

              {/* Master's Degrees */}
              <option value="MA">Master of Arts (MA)</option>
              <option value="MSc">Master of Science (MSc)</option>
              <option value="MBA">Master of Business Administration (MBA)</option>
              <option value="MEd">Master of Education (MEd)</option>
              <option value="MTech">Master of Technology (MTech)</option>
              <option value="MEng">Master of Engineering (MEng)</option>
              <option value="LLM">Master of Laws (LLM)</option>
              <option value="MPH">Master of Public Health (MPH)</option>

              {/* Doctoral and Professional Degrees */}
              <option value="PhD">Doctor of Philosophy (PhD)</option>
              <option value="DBA">Doctor of Business Administration (DBA)</option>
              <option value="DSc">Doctor of Science (DSc)</option>
              <option value="EdD">Doctor of Education (EdD)</option>
              <option value="JD">Doctor of Jurisprudence (JD)</option>

              {/* Professional Certifications */}
              <option value="ICAN">Institute of Chartered Accountants of Nigeria (ICAN)</option>
              <option value="CIBN">Chartered Institute of Bankers of Nigeria (CIBN)</option>
              <option value="CIS">Chartered Institute of Stockbrokers (CIS)</option>
              <option value="CITN">Chartered Institute of Taxation of Nigeria (CITN)</option>
              <option value="NIM">Nigerian Institute of Management (NIM)</option>
              <option value="COREN">Council for the Regulation of Engineering in Nigeria (COREN)</option>
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
            onClick={handleCancel}
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
            onClick={handleCancel}
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
              className={`flex-1 text-xs px-2  py-2 rounded-lg hover:bg-blue-700 ${activeTab === "biodata"
                  ? "bg-primary text-white"
                  : "text-gray-800 hover:bg-gray-300"
                }`}
            >
              Photo and Biodata
            </button>
            <button
              onClick={() => handleTabChange("contact")}
              className={`flex-1 text-xs px-2 md:px-4 lg:px-8 py-2 rounded-lg ${activeTab === "contact"
                  ? "bg-primary text-white"
                  : "text-gray-800 hover:bg-gray-300"
                }`}
            >
              Contact details
            </button>
            <button
              onClick={() => handleTabChange("qualification")}
              className={`flex-1 text-xs px-2 md:px-4 lg:px-8 py-2 rounded-lg ${activeTab === "qualification"
                  ? "bg-primary text-white"
                  : "text-gray-800 hover:bg-gray-300"
                }`}
            >
              Education and Professional Qualification
            </button>
            <button
              onClick={() => handleTabChange("experience")}
              className={`flex-1 text-xs px-2 md:px-4 lg:px-8 py-2 rounded-lg ${activeTab === "experience"
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

