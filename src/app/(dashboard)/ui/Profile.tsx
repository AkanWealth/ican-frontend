'use client';
import React, { useState } from 'react';

function Profile() {
  const [formData, setFormData] = useState({
    surname: '',
    firstName: '',
    middleName: '',
    email: '',
    phone: '',
    country: '',
    address: ''
  });

  const [profilePhoto, setProfilePhoto] = useState(null);

  const handleInputChange = (e: any) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handlePhotoUpload = (event: any) => {
    const file = event.target.files[0];
    if (file && file.size <= 100 * 1024) {
      setProfilePhoto(file);
    } else {
      alert('Please select an image under 100KB');
    }
  };

  const handleDeletePhoto = () => {
    setProfilePhoto(null);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="p-4 md:p-8 bg-white rounded-lg border-2 border-gray-400">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Profile Management</h1>
      
      {/* Personal Details Section */}
      <div className="w-full mb-6 md:mb-8">
        <h2 className="text-lg font-semibold mb-2">Personal Details</h2>
        <p className="text-sm text-gray-500 mb-4">Edit your profile details here</p>
      </div>

      {/* Profile Photo Section */}
      <div className="w-full mb-8 md:mb-16 flex flex-col md:flex-row md:gap-32">
        <h2 className="text-base font-medium mb-4">Profile Photo</h2>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          <div className="relative">
            {profilePhoto ? (
              <div className="relative">
                <img
                  src={URL.createObjectURL(profilePhoto)}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <img
                  src="/avatar.png"
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-sm text-gray-500">(JPG or PNG,100KB Max )</span>
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
          <div className="w-full md:w-[60%] space-y-6">
            <div>
              <label htmlFor="surname" className="block text-base font-semibold mb-2">
                Surname
              </label>
              <input
                type="text"
                id="surname"
                value={formData.surname}
                onChange={handleInputChange}
                placeholder="Enter your surname"
                className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-base font-semibold mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="middleName" className="block text-base font-semibold mb-2">
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
            </div>
          </div>
        </div>

        <hr className="mb-8 border-gray-400" />

        {/* Contact Details Section */}
        <div className="w-full mb-8 flex flex-col md:flex-row md:gap-[6.5rem]">
          <h2 className="text-base font-medium mb-4">Contact Details</h2>
          <div className="w-full md:w-[60%] grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-base font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-base font-semibold mb-2">
                Phone number
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
          </div>
        </div>

        <hr className="mb-8 border-gray-400" />

        {/* Place of Residence Section */}
        <div className="w-full mb-8 flex flex-col md:flex-row md:gap-[3rem]">
          <h2 className="text-base font-medium mb-4 md:w-[15%]">Place of Residence</h2>
          <div className="w-full md:w-[60%] grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="country" className="block text-base font-semibold mb-2">
                Country
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
            <div>
              <label htmlFor="address" className="block text-base font-semibold mb-2">
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
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full mb-8 flex flex-col md:flex-row md:gap-[3rem]">
            <div className='w-[15%]'></div>
            <div className='md:w-[60%] grid grid-cols-1 sm:grid-cols-2 gap-6'>
          <button
            type="submit"
            className="sm:w-auto bg-primary text-white px-8 py-2 rounded-full hover:bg-blue-700">
            Save changes
          </button>
          <button
            type="button"
            className="sm:w-auto bg-primary text-[#27378C] px-8 py-2 rounded-full hover:bg-gray-200"
          >
            Cancel
          </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Profile;