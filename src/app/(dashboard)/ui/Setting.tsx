"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FaRegDotCircle } from "react-icons/fa";
import { Eye, EyeOff, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Modal } from "@mui/material";
import axios from "axios";
import DeleteAccountModal from "@/components/Modal/Delete";
import apiClient from "@/services/apiClient";

// Define notification topics as constants for consistency
const TOPICS = {
  GENERAL: "GENERAL",
  EVENT: "EVENT",
  PAYMENT: "PAYMENT",
  MCPD: "MCPD"
};

// Define notification channels
const CHANNELS = {
  EMAIL: "EMAIL",
  // Add other channels if needed in the future
};

// Interface for API notification preference object
interface NotificationPreference {
  id: string;
  userId: string;
  topic: string;
  channel: string;
}

function SettingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("password");
  const [deleteReason, setDeleteReason] = useState("");
  const [comment, setComment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // State for notification preferences
  const [notificationPreferences, setNotificationPreferences] = useState({
    [TOPICS.GENERAL]: false,
    [TOPICS.EVENT]: false,
    [TOPICS.PAYMENT]: false,
    [TOPICS.MCPD]: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Memoize the fetchNotificationPreferences function to avoid dependency issues
  const fetchNotificationPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/notifications/preferences');
      
      // Initialize all topics as false first
      const initialPreferences = {
        [TOPICS.GENERAL]: false,
        [TOPICS.EVENT]: false,
        [TOPICS.PAYMENT]: false,
        [TOPICS.MCPD]: false,
      };
      
      // Set preferences to true for those that exist in the response
      response.forEach((preference: NotificationPreference) => {
        if (preference.channel === CHANNELS.EMAIL) {
          initialPreferences[preference.topic] = true;
        }
      });
      
      setNotificationPreferences(initialPreferences);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      toast({
        title: "Error",
        description: "Failed to load notification preferences",
        variant: "destructive",
        duration: 3000,
      });
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch notification preferences when component mounts
  useEffect(() => {
    fetchNotificationPreferences();
  }, [fetchNotificationPreferences]);

  // Function to handle notification preference toggle
  const handleNotificationChange = async (topic: string) => {
    const newValue = !notificationPreferences[topic];
    
    try {
      if (newValue) {
        // Add preference
        await apiClient.post('/notifications/preferences', {
          topic: topic,
          channel: CHANNELS.EMAIL
        });
      } else {
        // Remove preference
        await apiClient.delete(`/notifications/preferences?topic=${topic}&channel=${CHANNELS.EMAIL}`);
      }
      
      // Update local state
      setNotificationPreferences(prev => ({
        ...prev,
        [topic]: newValue
      }));
      
      // Show success toast
      toast({
        title: "Preferences Updated",
        description: `${topic} notifications ${newValue ? 'enabled' : 'disabled'}.`,
        variant: "default",
        duration: 3000,
      });
      
      // Show policy update toast for general notifications (as in your original code)
      if (topic === TOPICS.GENERAL && newValue) {
        toast({
          title: "Policy Update",
          variant: "primary",
          description: (
            <div>
              We've updated our Terms of Service.
              <br />{" "}
              <a
                href="/policy"
                className="text-primary font-semibold hover:text-primary hover:underline"
              >
                ...Read Policy.
              </a>
            </div>
          ),
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error updating notification preference:', error);
      toast({
        title: "Error",
        description: "Failed to update notification preferences",
        variant: "destructive",
        duration: 3000,
      });
      
      // Revert the optimistic update
      setNotificationPreferences(prev => ({
        ...prev,
        [topic]: !newValue
      }));
    }
  };

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    // Handle the confirmation logic
    console.log("Account deleted");
    setIsModalOpen(false);

    // Show success toast
    toast({
      title: "Confirmation email sent",
      description: "Please check your email for confirmation",
      variant: "default",
      duration: 3000,
    });
  };

  const getTabDescription = () => {
    switch (activeTab) {
      case "password":
        return (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleDeleteClick}
              className="px-8 py-2 rounded-full bg-red-600 text-white"
            >
              Delete account
            </button>
          </div>
        );
      case "notification":
        return (
          <div>
            <p className="text-lg text-black font-semibold mb-2">
              Notification Preferences
            </p>
            <p className="text-sm text-gray-500">
              Choose the notification you like to receive
            </p>
          </div>
        );
      case "delete":
        return "You can delete your account here";
      default:
        return "";
    }
  };

  const handleTabChange = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  const handleCancel = () => {
    setActiveTab("password");
    setDeleteReason("");
    setComment("");
  };

  const [criteria, setCriteria] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasMinLength: false,
    hasSpecialChar: false,
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const validatePassword = (password: string) => {
    setCriteria({
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasMinLength: password.length >= 8,
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handleInputChange = (e: { target: { id: any; value: any } }) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (id === "newPassword") {
      validatePassword(value);
    }
    
    // Check password match when either password field changes
    if (id === "newPassword" || id === "confirmPassword") {
      if (id === "confirmPassword" && value !== formData.newPassword) {
        setPasswordsMatch(false);
      } else if (
        id === "newPassword" &&
        value !== formData.confirmPassword &&
        formData.confirmPassword !== ""
      ) {
        setPasswordsMatch(false);
      } else {
        setPasswordsMatch(true);
      }
    }
  };

  useEffect(() => {
    const allFieldsFilled = Object.values(formData).every(
      (value) => value !== ""
    );
    const allCriteriaMet = Object.values(criteria).every(
      (criterion) => criterion
    );
    const passwordsMatch = formData.newPassword === formData.confirmPassword;

    setIsFormValid(allFieldsFilled && allCriteriaMet && passwordsMatch);
  }, [formData, criteria]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!isFormValid) {
      toast({
        title: "Validation Error",
        description: "Please ensure all password requirements are met.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      // API call to change password
      await apiClient.patch("/users/password", {
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      // Success handling
      showToastOnPasswordChange();

      // Reset form fields
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Reset password criteria
      setCriteria({
        hasUpperCase: false,
        hasLowerCase: false,
        hasMinLength: false,
        hasSpecialChar: false,
      });
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Failed to update password";

        toast({
          title: "Password Change Error",
          description: errorMessage,
          variant: "destructive",
          duration: 3000,
        });
      } else {
        // Generic error handling
        showToastOnPasswordChangeError();
      }
    }
  };

  const showToastOnPasswordChange = () => {
    toast({
      title: "Password Changed",
      description: "Your password has been successfully updated.",
      variant: "default",
      duration: 3000,
    });
  };

  const showToastOnPasswordChangeError = () => {
    toast({
      title: "Error",
      description: "Failed to update password. Please try again.",
      variant: "destructive",
      duration: 3000,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getCriteriaColor = (isValid: boolean) => {
    return isValid ? "text-green-500" : "text-gray-400";
  };

  const renderDeleteTab = () => (
    <form>
      <div className="w-full mb-4 flex flex-col md:flex-row md:gap-24">
        <h2 className="text-base font-medium mb-4">Delete Account</h2>
        <div className="w-full md:w-[50%] space-y-6">
          <p className="text-base text-semibold">
            Are you sure you want to delete your account? This will
            <br />
            go into effect immediately and you will no longer have
            <br />
            access to your account data.
          </p>

          <div>
            <label className="block text-base font-semibold text-gray-700 mb-4">
              Tell us why you are leaving
            </label>
            <select
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="w-full p-2 border border-gray-400 text-sm rounded-lg"
            >
              <option value="" className="text-black">
                Select reason
              </option>
              <option value="not-using" className="text-black">
                Not using the service enough
              </option>
              <option value="better-alternative" className="text-black">
                Found a better alternative
              </option>
              <option value="too-expensive" className="text-black">
                Too expensive
              </option>
              <option value="technical-issues" className="text-black">
                Technical issues
              </option>
              <option value="other" className="text-black">
                Other
              </option>
            </select>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-700 mb-4">
              Any Further comment
            </label>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border border-gray-400 text-sm rounded-lg "
              placeholder="Enter your comment"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleCancel}
              className="px-8 py-2 rounded-lg bg-primary text-white hover:bg-blue-700"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!deleteReason || !comment}
              className="bg-red-500 text-white py-2 px-4 rounded-md disabled:opacity-50"
              onClick={handleDeleteClick}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-white bg-opacity-10">
          <div className="relative flex flex-col bg-white py-8 px-6 rounded-lg items-center justify-center shadow-lg w-[560px]">
            <X
              className="absolute right-4 top-4 w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            />

            <h3 className="text-4xl font-semibold mb-8">Delete Account</h3>

            <p className="text-center text-base px-4">
              Are you sure you want to delete your account? This will go into
              effect immediately and you will no longer have access to your
              account data.
            </p>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-none text-xs border-2 border-primary px-10 py-2 rounded-full"
              >
                No, Never Mind
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white text-xs px-10 py-2 rounded-full"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </form>
  );

  const renderNotificationTab = () => (
    <section className="w-full">
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p>Loading preferences...</p>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-3 lg:mt-8 lg:gap-6">
          <div className="flex flex-row items-center justify-between gap-4">
            <div className="max-w-[80%]">
              <h3 className="text-base font-semibold text-grey-700">
                General Notifications
              </h3>
              <p className="pt-1 font-normal text-gray-500 text-base">
                Get updates on new features, system updates, and policy changes.
              </p>
            </div>
            <label
              htmlFor="generalNotifications"
              className="relative h-5 w-8 cursor-pointer rounded-full bg-[hsla(240,3%,49%,0.16)] transition has-[:checked]:bg-[hsla(230,70%,30%,1)] lg:h-8 lg:w-12"
            >
              <input
                type="checkbox"
                id="generalNotifications"
                checked={notificationPreferences[TOPICS.GENERAL]}
                onChange={() => handleNotificationChange(TOPICS.GENERAL)}
                className="peer sr-only"
              />
              <span className="shadow-[0px_3px_1px_0px_hsla(0, 0%, 0%, 0.06),0px_3px_8px_0px_hsla(0, 0%, 0%, 0.15),0px_0px_0px_1px_hsla(0, 0%, 0%, 0.04)] absolute left-[2px] top-[2px] size-4 rounded-full bg-white transition-all peer-checked:start-[calc(100%-18px)] lg:size-7 lg:peer-checked:start-[calc(100%-30px)]"></span>
            </label>
          </div>
          
          <div className="flex flex-row items-center justify-between gap-4">
            <div className="max-w-[80%]">
              <h2 className="text-base font-semibold text-grey-900">
                Event Registrations
              </h2>
              <p className="pt-1 font-normal text-gray-500 text-base">
                Get updates on successful or failed event registrations.
              </p>
            </div>
            <label
              htmlFor="eventRegistrations"
              className="relative h-5 w-8 cursor-pointer rounded-full bg-[hsla(240,3%,49%,0.16)] transition has-[:checked]:bg-[hsla(230,70%,30%,1)] lg:h-8 lg:w-12"
            >
              <input
                type="checkbox"
                id="eventRegistrations"
                checked={notificationPreferences[TOPICS.EVENT]}
                onChange={() => handleNotificationChange(TOPICS.EVENT)}
                className="peer sr-only"
              />
              <span className="shadow-[0px_3px_1px_0px_hsla(0, 0%, 0%, 0.06),0px_3px_8px_0px_hsla(0, 0%, 0%, 0.15),0px_0px_0px_1px_hsla(0, 0%, 0%, 0.04)] absolute left-[2px] top-[2px] size-4 rounded-full bg-white transition-all peer-checked:start-[calc(100%-18px)] lg:size-7 lg:peer-checked:start-[calc(100%-30px)]"></span>
            </label>
          </div>
          
          <div className="flex flex-row items-center justify-between gap-4">
            <div className="max-w-[80%]">
              <h2 className="text-base font-semibold text-grey-900">Payments</h2>
              <p className="pt-1 font-normal text-gray-500 text-base">
                Be notified about successful payments, failed transactions, and
                receipts.
              </p>
            </div>
            <label
              htmlFor="payments"
              className="relative h-5 w-8 cursor-pointer rounded-full bg-[hsla(240,3%,49%,0.16)] transition has-[:checked]:bg-[hsla(230,70%,30%,1)] lg:h-8 lg:w-12"
            >
              <input
                type="checkbox"
                id="payments"
                checked={notificationPreferences[TOPICS.PAYMENT]}
                onChange={() => handleNotificationChange(TOPICS.PAYMENT)}
                className="peer sr-only"
              />
              <span className="shadow-[0px_3px_1px_0px_hsla(0, 0%, 0%, 0.06),0px_3px_8px_0px_hsla(0, 0%, 0%, 0.15),0px_0px_0px_1px_hsla(0, 0%, 0%, 0.04)] absolute left-[2px] top-[2px] size-4 rounded-full bg-white transition-all peer-checked:start-[calc(100%-18px)] lg:size-7 lg:peer-checked:start-[calc(100%-30px)]"></span>
            </label>
          </div>
          
          {/* Uncomment if you want to add MCPD updates back
          <div className="flex flex-row items-center justify-between gap-4">
            <div className="max-w-[80%]">
              <h2 className="text-base font-semibold text-grey-900">
                MCPD Updates
              </h2>
              <p className="pt-1 font-normal text-gray-500 text-base">
                Stay updated on your MCPD points after completing qualifying
                activities.
              </p>
            </div>
            <label
              htmlFor="mcpdUpdates"
              className="relative h-5 w-8 cursor-pointer rounded-full bg-[hsla(240,3%,49%,0.16)] transition has-[:checked]:bg-[hsla(230,70%,30%,1)] lg:h-8 lg:w-12"
            >
              <input
                type="checkbox"
                id="mcpdUpdates"
                checked={notificationPreferences[TOPICS.MCPD]}
                onChange={() => handleNotificationChange(TOPICS.MCPD)}
                className="peer sr-only"
              />
              <span className="shadow-[0px_3px_1px_0px_hsla(0, 0%, 0%, 0.06),0px_3px_8px_0px_hsla(0, 0%, 0%, 0.15),0px_0px_0px_1px_hsla(0, 0%, 0%, 0.04)] absolute left-[2px] top-[2px] size-4 rounded-full bg-white transition-all peer-checked:start-[calc(100%-18px)] lg:size-7 lg:peer-checked:start-[calc(100%-30px)]"></span>
            </label>
          </div>
          */}
        </div>
      )}
    </section>
  );

  const renderPasswordTab = () => (
    <form onSubmit={handlePasswordSubmit}>
      <div className="w-full mb-4 flex flex-col md:flex-row md:gap-24">
        <h2 className="text-base font-medium mb-4">Change password</h2>
        <div className="w-full md:w-[50%] space-y-6">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm text-gray-900 font-semibold mb-2"
            >
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Enter your current password"
                className="w-full p-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 text-sm focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-2 text-gray-500 text-xs focus:outline-none"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="block text-sm text-gray-900 font-semibold mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter your new password"
                  className="w-full p-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 text-sm focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-2 text-gray-500 text-xs focus:outline-none"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              <div className="grid grid-cols-2 mt-4 gap-4">
                <div className="flex flex-row gap-2">
                  <FaRegDotCircle
                    className={getCriteriaColor(criteria.hasUpperCase)}
                  />
                  <p
                    className={`text-xs ${getCriteriaColor(
                      criteria.hasUpperCase
                    )}`}
                  >
                    One upper case character
                  </p>
                </div>
                <div className="flex flex-row gap-2">
                  <FaRegDotCircle
                    className={getCriteriaColor(criteria.hasMinLength)}
                  />
                  <p
                    className={`text-xs ${getCriteriaColor(
                      criteria.hasMinLength
                    )}`}
                  >
                    8 characters minimum
                  </p>
                </div>
                <div className="flex flex-row gap-2">
                  <FaRegDotCircle
                    className={getCriteriaColor(criteria.hasLowerCase)}
                  />
                  <p
                    className={`text-xs ${getCriteriaColor(
                      criteria.hasLowerCase
                    )}`}
                  >
                    One lower case character
                  </p>
                </div>
                <div className="flex flex-row gap-2">
                  <FaRegDotCircle
                    className={getCriteriaColor(criteria.hasSpecialChar)}
                  />
                  <p
                    className={`text-xs ${getCriteriaColor(
                      criteria.hasSpecialChar
                    )}`}
                  >
                    At least one special character
                  </p>
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm text-gray-900 font-semibold mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Enter your new password"
                  className={`w-full p-2 border ${
                    !passwordsMatch && formData.confirmPassword
                      ? "border-red-500"
                      : "border-gray-500"
                  } rounded-lg focus:outline-none focus:ring-2 text-sm focus:ring-blue-500`}
                />
              </div>
              {!passwordsMatch && formData.confirmPassword && (
                <p className="text-red-500 text-xs mt-2">
                  Passwords do not match
                </p>
              )}
            </div>
            <div>
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full px-8 py-2 mt-8 rounded-full ${
                  isFormValid
                    ? "bg-primary text-white hover:bg-blue-700"
                    : "bg-blue-200 text-gray-100 cursor-not-allowed"
                }`}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );

  return (
    <div className="py-4 px-4">
      <div className="p-4 md:p-8 bg-white rounded-lg border border-gray-300">
        <h1 className="lg:text-2xl md:text-xl font-semibold mb-4">Settings</h1>

        {/* Personal Details Section */}
        <div className="w-full mb-4">
          <div className="grid grid-cols-2 w-full max-w-[450px] bg-gray-200 rounded-xl p-2">
            <button
              onClick={() => handleTabChange("password")}
              className={`text-xs px-2 md:px-2 lg:px-8 py-2 rounded-lg hover:bg-blue-700 ${
                activeTab === "password"
                  ? "bg-primary text-white"
                  : "text-gray-800 hover:bg-gray-300"
              }`}
            >
              Change Password
            </button>
            <button
              onClick={() => handleTabChange("notification")}
              className={`text-xs px-2 md:px-2 lg:px-8 py-2 rounded-lg  ${
                activeTab === "notification"
                  ? "bg-primary text-white"
                  : "text-gray-800 hover:bg-gray-300"
              }`}
            >
              Notification
            </button>
          </div>
          <div className="text-sm text-gray-500 mt-6">
            {getTabDescription()}
          </div>
        </div>

        <hr className="mb-8 border-gray-400" />
        {activeTab === "password" && renderPasswordTab()}
        {activeTab === "notification" && renderNotificationTab()}

        <DeleteAccountModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
}

export default SettingsPage;