"use client";

import React, { useState, useEffect } from "react";
import { Clock, Info } from "lucide-react";

function Dashboard() {
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Get user data from localStorage
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        // Use lastName if available, otherwise use firstname or a default
        setUserName(user.lastName || user.last_name || user.firstname || user.first_name || "User");
      }
    } catch (error) {
      console.error("Error getting user data:", error);
    } finally {
      setLoading(false);
    }

    // Format current date
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    setCurrentDate(date.toLocaleDateString('en-US', options));
  }, []);

  return (
    <div className="w-full max-w-screen-xl mx-auto">
      {/* Main Card */}
      <div className="flex flex-col p-4 sm:p-6 bg-blue-900 rounded-lg">
        {/* Greeting Section */}
        <div className="text-left">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white">
            {loading ? "Welcome!" : `Welcome ${userName}!`}
          </h2>
          <div className="flex flex-row items-center text-white mt-4 sm:mt-6 text-sm">
            <span>{currentDate}</span>
            <span className="flex items-center bg-gray-100 text-black ml-2 text-xs rounded-md px-2 py-1">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Under review
            </span>
          </div>
        </div>
      </div>

      {/* Notification Section */}
      <div className="flex flex-row gap-2 sm:gap-5 mt-4 sm:mt-8">
        <Info className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
        <p className="text-gray-500 text-base sm:text-sm">
          Your account is being reviewed. We will send an email to you once <br/>
          review is complete. Please keep an eye on your email.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;