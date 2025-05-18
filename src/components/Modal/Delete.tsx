import React, { useState, useRef, useEffect } from "react";
import { X, Trash2, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import apiClient from "@/services/apiClient";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void; // Making this optional as we'll handle the API call in the component
}

const DeleteAccountModal = ({
  isOpen,
  onClose,
  onConfirm,
}: DeleteAccountModalProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setCurrentPassword("");
      setShowPassword(false);
      setError(null);
    }
  }, [isOpen]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleDeleteAccount = async () => {
    if (!currentPassword) {
      setError("Password is required");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Use apiClient instead of raw axios
    await apiClient.post("/users/delete-request", {
      password: currentPassword,
    });


      // If successful, run the onConfirm callback if provided
      if (onConfirm) {
        onConfirm();
      }

      // Close the modal
      onClose();
    } catch (error) {
      // Handle error response
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Failed to delete account";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        ref={modalContentRef}
        className="relative flex flex-col bg-white py-8 px-6 rounded-lg items-center justify-center shadow-lg w-[500px]"
      >
        <div className="flex items-center justify-between space-x-6">
          <div className="mb-6 p-4 bg-red-100 w-12 h-12 rounded-full">
            <Trash2 className="w-4 h-4 text-red-500" />
          </div>
          <div className="">
            <h3 className="text-xl font-semibold mb-2">Delete Your Account</h3>

            <p className="text-xs text-gray-600 mb-2">
              We're sorry to see you go. Deleting your account is a permanent
              action and cannot be undone. Please confirm your decision below.
            </p>

            <div className="w-full mb-6">
              <label className="block text-sm font-semibold mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`w-full h-10 p-3 border ${
                    error ? "border-red-500" : "border-gray-300"
                  } rounded-lg`}
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3 text-gray-500 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
              <p className="text-xs text-gray-500 mt-2">
                A confirmation email will be sent to your registered email
                address.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full grid space-y-4">
          <div>
            <button
              onClick={handleDeleteAccount}
              disabled={!currentPassword || isLoading}
              className="w-full bg-red-600 text-white px-8 py-2 rounded-full text-sm disabled:opacity-50"
            >
              {isLoading ? "Deleting..." : "Confirm Account Delete"}
            </button>
          </div>
          <div>
            <button
              onClick={onClose}
              className="w-full border-2 border-primary text-primary px-8 py-2 rounded-full text-sm"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
