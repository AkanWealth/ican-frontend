"use client";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Outstanding from "../TabRender/Outstanding";
import Subscription from "../TabRender/Subscription";
import PaymentHistory from "../TabRender/PaymentHistory";
import DonationModal from "@/components/Modal/DonationModal";
import { parseCookies } from "nookies";

const PaymentPage = () => {
  const [activeTab, setActiveTab] = useState("Outstanding");
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const { toast } = useToast();
  const cookies = parseCookies();
  const userDataCookie = cookies['user_data'];
  const userData = userDataCookie ? JSON.parse(userDataCookie) : null;
         
  

  const userDataModal = {
    email: userData?.email, // Replace with actual user data
    phoneNumber: userData?.phone, // Replace with actual user data
    fullName: userData?.surname, // Replace with actual user data
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleMakeDonation = () => {
    setIsDonationModalOpen(true);
  };

  return (
    <div className="py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Payment</h1>
        </div>
        <button
          onClick={handleMakeDonation}
          className="px-4 py-2 text-base bg-primary text-white rounded-xl flex items-center gap-2 hover:bg-blue-700"
        >
          Make a Donation
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="w-full mb-6">
        <div className="flex w-full max-w-[600px] bg-gray-200 rounded-xl p-2">
          <button
            onClick={() => handleTabChange("Outstanding")}
            className={`flex-1 text-xs px-2 md:px-2 lg:px-8 py-2 rounded-lg hover:bg-blue-700 ${
              activeTab === "Outstanding"
                ? "bg-primary text-white"
                : "text-gray-800 hover:bg-gray-300"
            }`}
          >
            Settle Payments
          </button>
          <button
            onClick={() => handleTabChange("Subcription")}
            className={`flex-1 text-xs px-2 md:px-4 lg:px-8 py-2 rounded-lg ${
              activeTab === "Subcription"
                ? "bg-primary text-white"
                : "text-gray-800 hover:bg-gray-300"
            }`}
          >
            Subscription Payment
          </button>
          <button
            onClick={() => handleTabChange("PaymentHistory")}
            className={`flex-1 text-xs px-2 md:px-4 lg:px-8 py-2 rounded-lg  ${
              activeTab === "PaymentHistory"
                ? "bg-primary text-white"
                : "text-gray-800 hover:bg-gray-300"
            }`}
          >
            Payment History
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "Outstanding" && <Outstanding />}
      {activeTab === "Subcription" && <Subscription />}
      {activeTab === "PaymentHistory" && <PaymentHistory />}

      {/* Donation Modal */}
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        userData={userDataModal}
      />
    </div>
  );
};

export default PaymentPage;
