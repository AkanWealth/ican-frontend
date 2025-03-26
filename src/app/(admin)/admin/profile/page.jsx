"use client";

import React, { useState } from "react";
import Image from "next/image";
import InputEle from "@/components/genui/InputEle";

function Profile() {
  const [admin, setAdmin] = useState({
    firstName: "Admin",
    lastName: "Admin",
    email: "",
    phoneNumber: "",
  });

  const handleCancel = () => {
    // Reset admin state to initial values
    setAdmin({
      firstName: "Admin",
      lastName: "Admin",
      email: "",
      phoneNumber: "",
    });
  };

  const handleSaveChanges = () => {
    // Implement save changes logic here
    console.log("Admin details saved:", admin);
  };

  return (
    <div className="rounded-3xl p-6">
      <div className="flex flex-col mb-6 w-full items-start justify-between">
        <div className="flex flex-col gap-3"></div>
        <h2 className="font-semibold text-2xl text-black">Profile</h2>
        <p>Update and Manage your Profile here</p>
      </div>
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <h2 className="text-xl font-semibold text-left">Admin Profile</h2>
        <hr className="w-full" />
        <div>
          <div className="mx-auto flex flex-col items-center gap-2">
            {/* <Image src="./img.png" width={50} height={50}  alt="Profile img" /> */}
            <h5 className="flex flex-col items-center text-center text-black text-xl font-medium">
              Admin Name
              <span className="text-xs text-neutral-400">admin role</span>
            </h5>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            <h5 className="text-base w-full border-b border-gray-600 text-neutral-900">
              Admin Details
            </h5>
            <div className="flex flex-row gap-4 flex-wrap">
              <InputEle
                id="first_name"
                label="First Name"
                type="text"
                placeholder="First Name"
                value={admin.firstName}
                onChange={(e) =>
                  setAdmin({ ...admin, firstName: e.target.value })
                }
              />
              <InputEle
                id="last_name"
                label="Last Name"
                type="text"
                placeholder="Last Name"
                value={admin.lastName}
                onChange={(e) =>
                  setAdmin({ ...admin, lastName: e.target.value })
                }
              />
              <InputEle
                id="email"
                label="Email"
                type="email"
                placeholder="Email"
                value={admin.email}
                onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
              />
              <InputEle
                id="phone_number"
                label="Phone Number"
                type="text"
                placeholder="Phone Number"
                value={admin.phoneNumber}
                onChange={(e) =>
                  setAdmin({ ...admin, phoneNumber: e.target.value })
                }
              />
            </div>
            <div className="flex w-full justify-center items-center flex-row gap-4">
              <button
                className="px-4 py-2 bg-white border border-gray-600 text-black rounded-md"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded-md"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
