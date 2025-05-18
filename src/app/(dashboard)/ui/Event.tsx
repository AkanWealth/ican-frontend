"use client";
import React, { useState, useEffect } from "react";
import EventsTab from "../TabRender/EventRender";
import RegisteredEventsTab from "../TabRender/RegisteredEventsTab";
import FeedbackHistoryTab from "../TabRender/FeedbackHistoryTab";

function EventPage() {
  const [activeTab, setActiveTab] = useState("password");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Nigerian states
  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT (Abuja)",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

 

  const handleTabChange = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

 
  // useEffect(() => {
  //   const userData = localStorage.getItem("user");
  //   if (userData) {
  //     try {
  //       const user = JSON.parse(userData);

  //       setUserEmail(user.email);
  //     } catch (error) {
  //       console.error("Error parsing user data:", error);
  //     }
  //   }
  // }, []);

  return (
    <div className="py-6 px-4">
      <div className="w-full mb-4">
        <div className="flex w-full max-w-[700px] bg-gray-200 rounded-xl p-2">
          <button
            onClick={() => handleTabChange("password")}
            className={`flex-1 text-sm px-2 md:px-2 lg:px-4 lg:py-2 rounded-lg hover:bg-blue-700 ${
              activeTab === "password"
                ? "bg-primary text-white"
                : "text-gray-800 hover:bg-gray-300"
            }`}
          >
            Events
          </button>
          <button
            onClick={() => handleTabChange("notification")}
            className={`flex-1 text-sm px-2 md:px-4 lg:px-8 py-2 rounded-lg ${
              activeTab === "notification"
                ? "bg-primary text-white"
                : "text-gray-800 hover:bg-gray-300"
            }`}
          >
            My Registered Events
          </button>
          <button
            onClick={() => handleTabChange("delete")}
            className={`flex-1 text-sm px-2 md:px-4 lg:px-8 py-2 rounded-lg ${
              activeTab === "delete"
                ? "bg-primary text-white"
                : "text-gray-800 hover:bg-gray-300"
            }`}
          >
            Feedback History
          </button>
        </div>
      </div>

      {activeTab === "password" && (
        <EventsTab nigerianStates={nigerianStates} />
      )}
      {activeTab === "notification" && <RegisteredEventsTab />}
      {activeTab === "delete" && <FeedbackHistoryTab />}
    </div>
  );
}

export default EventPage;
