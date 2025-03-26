"use client";
import React, { useState, useEffect } from "react";
import { nigerianStates } from "@/lib/States";
import { nigerianStatesLGAs } from "@/lib/nigerianStatesLGAs";
import { nigerianStatesCity } from "@/lib/NigeriaCity";
import Image from "next/image";

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
  });
  const [activeTab, setActiveTab] = useState("biodata");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [states, setStates] = useState<string[]>([]);
  const [countries, setCountries] = useState([]);
  const [nigerianStateCities, setNigerianStateCities] = useState<StateCityMap>(
    {}
  );
  const [nigerianStateCity, setNigerianStateCity] = useState<StateCityMap>({});
  const [cities, setCities] = useState<string[]>([]);
  const [residentialCities, setResidentialCities] = useState<string[]>([]);
  const [residentialLGAs, setResidentialLGAs] = useState<string[]>([]);

  useEffect(() => {
    // Fetch countries
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const sortedCountries = data
          .map((country: { name: { common: any } }) => country.name.common)
          .sort();
        setCountries(sortedCountries);
      })
      .catch((error) => console.error("Error fetching countries:", error));

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
      const stateCities = nigerianStateCities[value] || [];
      setResidentialCities(stateCities);
    } else if (id === "residentialCity" && value) {
      const stateCities = nigerianStateCity[value] || [];
      setResidentialCities(stateCities);
    }
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
      const stateCities = nigerianStateCities[value] || [];
      setResidentialCities(stateCities);
    } else if (id === "residentialCity" && value) {
      const stateCities = nigerianStateCity[value] || [];
      setResidentialCities(stateCities);
    }
  };

  const handlePhotoUpload = (event: any) => {
    const file = event.target.files[0];
    if (file && file.size <= 100 * 1024) {
      setProfilePhoto(file);
    } else {
      alert("Please select an image under 100KB");
    }
  };

  const handleDeletePhoto = () => {
    setProfilePhoto(null);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  const handleTabChange = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };
  const renderBiodata = () => (
    <>
      <div className="w-full mb-8 md:mb-16 flex flex-col md:flex-row md:gap-32 py-6 px-4">
        <h2 className="text-base font-medium mb-4">Profile Photo</h2>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          <div className="relative">
            {profilePhoto ? (
              <div className="relative">
                <Image
                  src={URL.createObjectURL(profilePhoto)}
                  alt="Profile"
                  fill={true}
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
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
              (JPG or PNG,100KB Max )
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
                  htmlFor="middleName"
                  className="block text-base font-semibold mb-2"
                >
                  Gender
                </label>
                <select
                  className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="gender"
                  id="gender"
                  required
                >
                  <option value="male">Male </option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="middleName"
                  className="block text-base font-semibold mb-2"
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="DateofBirth"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  placeholder="Enter your middle name"
                  className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="middleName"
                  className="block text-base font-semibold mb-2"
                >
                  Marital Status
                </label>
                <select
                  className=" w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="MaritalStatus"
                  id="MaritalStatus"
                  required
                >
                  <option value="single">Single </option>
                  <option value="married">Married </option>
                  <option value="divorced">Divorced </option>
                  <option value="widowed">Widowed </option>
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Country</option>
                  {countries.map((country, index) => (
                    <option key={index} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full  bg-primary text-white px-8 py-2 rounded-full hover:bg-blue-700"
                >
                  Save changes
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="w-full  text-[#27378C] px-8 py-2 rounded-full bg-gray-200"
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
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
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
          <div>
            <label
              htmlFor="residentialCity"
              className="block text-base font-semibold mb-2"
            >
              Residential City
            </label>
            <select
              id="residentialCity"
              value={formData.residentialCity || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select City</option>
              {residentialCities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="residentialLGA"
              className="block text-base font-semibold mb-2"
            >
              Residential LGA
            </label>
            <select
              id="residentialLGA"
              value={formData.residentialLGA || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select LGA</option>
              {residentialLGAs.map((lga, index) => (
                <option key={index} value={lga}>
                  {lga}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="w-full mb-8 flex flex-col md:flex-row md:gap-[3rem]">
        <div className="w-[15%]"></div>
        <div className="md:w-[60%] grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            type="submit"
            className="sm:w-auto bg-primary text-white px-8 py-2 rounded-full hover:bg-blue-700"
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
              htmlFor="country"
              className="block text-base font-semibold mb-2"
            >
              Institution
            </label>
            <input
              type="text"
              id="institution"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Enter your country"
              className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="country"
              className="block text-base font-semibold mb-2"
            >
              Discipline
            </label>
            <input
              type="text"
              id="discipline"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Enter your discipline"
              className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="country"
              className="block text-base font-semibold mb-2"
            >
              Qualification
            </label>
            <select
              className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="discipline"
              id="discipline"
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
              htmlFor="country"
              className="block text-base font-semibold mb-2"
            >
              Year of Graduation
            </label>
            <input
              className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="yearofgraduation"
              id="yearofgraduation"
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
              htmlFor="address"
              className="block text-base font-semibold mb-2"
            >
              Status
            </label>
            <select
              className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="status"
              id="status"
              required
            >
              <option value="">Select status</option>
              <option value="single">FCA </option>
              <option value="married">ACA</option>
              <option value="divorced">Student</option>
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
              htmlFor="country"
              className="block text-base font-semibold mb-2"
            >
              Name of Company
            </label>
            <input
              type="text"
              id="discipline"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Enter your discipline"
              className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div></div>
          <div>
            <label
              htmlFor="country"
              className="block text-base font-semibold mb-2"
            >
              Office Address
            </label>
            <input
              type="text"
              id="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Enter your country"
              className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div></div>
          <div>
            <label
              htmlFor="country"
              className="block text-base font-semibold mb-2"
            >
              Position/Role
            </label>
            <input
              type="text"
              id="country"
              value={formData.country}
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
