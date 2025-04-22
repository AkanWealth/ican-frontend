"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Clock, Info } from "lucide-react";
import Attendance from "../ui/Attendance";

function DashboardContent() {
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("Loading date..."); // Placeholder value
  const [accountStatus, setAccountStatus] = useState("pending");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (typeof window === "undefined") return; // Ensure code runs only on the client side

        const user = localStorage.getItem("user");
        const userId = user ? JSON.parse(user)?.id : null;
        const token = localStorage.getItem("token"); 
        console.log(userId, token);
// console.log(userId, token);
        if (!userId || !token) throw new Error("User ID or token not found in localStorage");

        const response = await axios.get(
          `https://ican-api-6000e8d06d3a.herokuapp.com/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
// console.log(response);
        const data = response.data;
        setUserName(data.firstname || "User");
        setAccountStatus(data.isVerified ? "approved" : "pending");
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserName("User");
        setAccountStatus("pending");
      } finally {
        setLoading(false);
      }
    };

    const formatCurrentDate = () => {
      const date = new Date();
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
    };

    fetchUserData();
    setCurrentDate(formatCurrentDate()); // Set the current date
  }, []);

  const renderStatusBadge = () => {
    switch (accountStatus) {
      case "approved":
        return <></>;
      default:
        return (
          <span className="flex items-center bg-gray-100 text-black ml-2 text-xs rounded-md px-2 py-1">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Under review
          </span>
        );
    }
  };

  const renderStatusNotification = () => {
    switch (accountStatus) {
      case "approved":
        return <div className="flex flex-row gap-2 sm:gap-5 mt-4 sm:mt-8"></div>;
      case "pending":
        return ( 
          <div className="flex flex-row gap-2 sm:gap-5 mt-4 sm:mt-8">
            <Info className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
            <p className="text-gray-500 lg:text-base text-xs">
              Your account is pending review. We will send an email to you once <br className="lg:block hidden" />
              review is complete. Please keep an eye on your email.
            </p>
          </div>
        );
      default:
        return (
          <div className="flex flex-row gap-2 sm:gap-5 mt-4 sm:mt-8">
            <Info className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
            <p className="text-gray-500 lg:text-base text-xs">
              Your account is being reviewed. We will send an email to you once <br className="lg:block hidden" />
              review is complete. Please keep an eye on your email.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="w-full mx-auto py-6 px-4">
      {/* Main Card */}
      <div className="flex flex-col p-4 sm:p-6 bg-blue-900 rounded-lg mb-8">
        {/* Greeting Section */}
        <div className="text-left">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white">
            {loading ? "Welcome!" : `Welcome ${userName}!`}
          </h2>
          <div className="flex flex-row items-center text-white mt-4 sm:mt-6 text-sm">
            <span>{currentDate}</span>
            {/* {renderStatusBadge()} */}
          </div>
        </div>
      </div>

      {/* Notification Section */}
      {/* {renderStatusNotification()} */}
      {accountStatus === "approved" && <Attendance />}
    </div>
  );
}

export default DashboardContent;