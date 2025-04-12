"use client";

import React, { useEffect } from "react";
import gsap from "gsap";
import {
  MdCheckCircleOutline,
  MdWarning,
  MdError,
  MdInfoOutline,
} from "react-icons/md";

interface ToastProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ type, message, onClose }) => {
  useEffect(() => {
    gsap.fromTo(
      ".toast-container",
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
    );

    const timeout = setTimeout(() => {
      gsap.to(".toast-container", {
        y: -50,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: onClose,
      });
    }, 3000);

    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div
      className={`toast-container fixed top-5 right-5 px-5 py-3 rounded-xl text-base text-black z-50 ${type}`}
    >
      <div className="flex items-center gap-4 justify-end">
        <div className="rounded-full bg-white p-2">
          {type === "success" && (
            <MdCheckCircleOutline className="w-8 h-8 fill-[#28A745]" />
          )}
          {type === "error" && <MdError className="w-8 h-8 fill-[#CB1A14]" />}
          {type === "warning" && (
            <MdWarning className="w-8 h-8 fill-[#FAAD14]" />
          )}
          {type === "info" && (
            <MdInfoOutline className="w-8 h-8 fill-[#1A379A]" />
          )}
        </div>
        <div className="flex flex-col max-w-56 gap-2">
          <h4 className="text-black text-base font-medium capitalize">
            {type}
          </h4>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      </div>
      <style jsx>{`
        .success {
          background-color: #d6ffde;
          border-width: 2px;
          border-color: #32e45b;
        }
        .error {
          background-color: #ffdede;
          border-width: 2px;
          border-color: #cb1a14;
        }
        .warning {
          background-color: #feebc4;
          border-width: 2px;
          border-color: #faad14;
        }
        .info {
          background-color: #dce2f9;
          border-width: 2px;
          border-color: #1a379a;
        }
      `}</style>
    </div>
  );
};

export default Toast;
