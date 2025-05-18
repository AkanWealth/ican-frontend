"use client";

import React, { useState } from "react";
import InputEle from "@/components/genui/InputEle";
import {
  MdOutlineEmail,
  MdOutlineNotifications,
  MdLockReset,
} from "react-icons/md";
import { AuthProvider } from "@/app/(admin)/admin/LoginAuthentication/AuthContext";
import { AdminProtectedRoute } from "@/app/(admin)/admin/LoginAuthentication/AdminProtectedRoute";
import { useToast } from "@/hooks/use-toast";
import { BASE_API_URL } from "@/utils/setter";
import apiClient from "@/services-admin/apiClient";

function Settings() {
  const { toast } = useToast();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    inApp: false,
    email: false,
  });

  // Password validation state
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target as HTMLInputElement;
    if (id === "oldPassword") {
      setOldPassword(value);
    } else if (id === "newPassword") {
      setNewPassword(value);
      validatePassword(value);
    } else if (id === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const validatePassword = (password: string) => {
    // Reset error
    setPasswordError("");

    // Check password strength
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    }
  };

  const handleNotificationChange = (type: "inApp" | "email") => {
    setNotificationSettings((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New password and confirmation do not match",
        variant: "destructive",
      });
      return;
    }

    if (passwordError) {
      toast({
        title: "Error",
        description: passwordError,
        variant: "destructive",
      });
      return;
    }

    if (!oldPassword) {
      toast({
        title: "Error",
        description: "Please enter your current password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${BASE_API_URL}/users/settings`,
      data: {
        oldPassword,
        newPassword,
        notificationSettings,
      },
    };

    try {
      const result = await apiClient.request(config);
      toast({
        title: "Success",
        description: "Password updated successfully",
        variant: "default",
      });
      handleCancel();
    } catch (error) {
      console.error("Error saving admin details:", error);
      toast({
        title: "Error",
        description:
          "Failed to update password. Please check your current password and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setPasswordStrength(0);
  };

  // Render password strength indicator
  const renderPasswordStrength = () => {
    if (!newPassword) return null;

    const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
    const strengthColors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
    ];

    return (
      <div className="mt-2">
        <div className="text-sm mb-1">
          Password strength:{" "}
          <span className="font-medium">
            {strengthLabels[passwordStrength - 1] || "Very weak"}
          </span>
        </div>
        <div className="flex gap-1 h-1">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`h-full w-1/4 rounded-full ${
                passwordStrength >= level
                  ? strengthColors[level - 1]
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-3xl p-6 max-w-4xl mx-auto">
      <div className="flex flex-col mb-6 w-full items-start justify-between">
        <h2 className="font-semibold text-2xl text-black">Account Settings</h2>
        <p className="text-gray-600">
          Manage your password and notification preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Main Password Reset Section */}
        <div className="md:col-span-3 rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <MdLockReset className="text-2xl text-primary" />
            <h3 className="text-xl font-medium">Reset Password</h3>
          </div>

          <p className="text-gray-600 text-sm mb-4">
            Strong passwords include a mix of uppercase letters, numbers, and
            special characters.
          </p>

          <form onSubmit={handleSaveChanges} className="flex flex-col gap-6">
            <div className="space-y-5">
              <InputEle
                id="oldPassword"
                label="Current Password"
                type="password"
                value={oldPassword}
                placeholder="Enter your current password"
                onChange={handleChange}
                required
              />

              <div>
                <InputEle
                  id="newPassword"
                  label="New Password"
                  type="password"
                  value={newPassword}
                  placeholder="Enter your new password"
                  onChange={handleChange}
                  required
                />
                {renderPasswordStrength()}
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </div>

              <InputEle
                id="confirmPassword"
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                placeholder="Confirm your new password"
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex w-full justify-end items-center flex-row gap-4 mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70"
                disabled={
                  isLoading ||
                  !oldPassword ||
                  !newPassword ||
                  newPassword !== confirmPassword ||
                  !!passwordError
                }
              >
                {isLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>

        {/* Notification Settings Section */}
        <div className="md:col-span-2 rounded-3xl px-6 py-6 flex flex-col gap-4 border border-neutral-200 bg-white shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-2">
            <MdOutlineNotifications className="text-xl text-primary" />
            <h3 className="text-lg font-medium">Notification Preferences</h3>
          </div>

          <p className="text-gray-600 text-sm mb-4">
            Choose how you want to receive notifications
          </p>

          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <MdOutlineNotifications className="text-xl text-gray-700" />
                <div>
                  <p className="font-medium text-gray-800">
                    In-app Notifications
                  </p>
                  <p className="text-xs text-gray-500">
                    Receive notifications within the application
                  </p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.inApp}
                  onChange={() => handleNotificationChange("inApp")}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <MdOutlineEmail className="text-xl text-gray-700" />
                <div>
                  <p className="font-medium text-gray-800">
                    Email Notifications
                  </p>
                  <p className="text-xs text-gray-500">
                    Receive notifications via email
                  </p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.email}
                  onChange={() => handleNotificationChange("email")}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PackedSettings() {
  return (
    <AuthProvider>
      <AdminProtectedRoute>
        <Settings />
      </AdminProtectedRoute>
    </AuthProvider>
  );
}
