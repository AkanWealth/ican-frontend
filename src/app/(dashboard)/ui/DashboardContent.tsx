"use client";
import React, { useState, useEffect } from "react";
import { Clock, Info } from "lucide-react";
import Attendance from "../ui/Attendance";

function DashboardContent() {
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");
  const [accountStatus, setAccountStatus] = useState("approved");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get user data from localStorage
      try {
        const userData = localStorage.getItem("user");
        console.log(userData);
        if (userData) {
          const user = JSON.parse(userData);
  
          setUserName(user.lastName || user.last_name || user.firstname || user.first_name || "User");
        }
  
        // if (userData.accountStatus) {
        //   setAccountStatus(userData.accountStatus);
        // }
      } catch (error) {
        console.error("Error getting user data:", error);
      } finally {
        setLoading(false);
      }
  
      // Format current date
      const date = new Date();
      const options: Intl.DateTimeFormatOptions = { weekday: "long", month: "long", day: "numeric" };
      setCurrentDate(date.toLocaleDateString("en-US", options));
    }
  }, []);


  const renderStatusBadge = () => {
    switch (accountStatus) {
      case "approved":
        return (<></>
          // <span className="flex items-center bg-green-100 text-green-800 ml-2 text-xs rounded-md px-2 py-1">
          //   <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Approved
          // </span>
        );
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
        return (
          <div className="flex flex-row gap-2 sm:gap-5 mt-4 sm:mt-8">

          </div>
        );
      default:
        return (
          <div className="flex flex-row gap-2 sm:gap-5 mt-4 sm:mt-8">
            <Info className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
            <p className="text-gray-500 text-base sm:text-sm">
              Your account is being reviewed. We will send an email to you once <br/>
              review is complete. Please keep an eye on your email.
            </p>
          </div>
        );
    }
  };

  return (

    <div className="w-full max-w-screen-xl mx-auto py-6 px-4">
      {/* Main Card */}
      <div className="flex flex-col p-4 sm:p-6 bg-blue-900 rounded-lg">
        {/* Greeting Section */}
        <div className="text-left">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white">
            {loading ? "Welcome!" : `Welcome ${userName}!`}
          </h2>
          <div className="flex flex-row items-center text-white mt-4 sm:mt-6 text-sm">
            <span>{currentDate}</span>
            {/* <span className="flex items-center bg-gray-100 text-black ml-2 text-xs rounded-md px-2 py-1">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Under review
            </span> */}
            {renderStatusBadge()}
          </div>
        </div>
      </div>

      {/* Notification Section */}
      {/* <div className="flex flex-row gap-2 sm:gap-5 mt-4 sm:mt-8">
        <Info className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
        <p className="text-gray-500 text-base sm:text-sm">
          Your account is being reviewed. We will send an email to you once <br/>
          review is complete. Please keep an eye on your email.
        </p>
      </div> */}

      {renderStatusNotification()}
      {accountStatus === "approved" && <Attendance/>}
    </div>
  );
}
export default DashboardContent