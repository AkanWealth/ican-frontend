"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { X } from "lucide-react";
import { FaRegCheckCircle, FaInfoCircle } from "react-icons/fa";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            className={`${props.className} ${

              props.variant === "default"
                ? "bg-[#DFF5E0] border-green-500 border-2 text-[#1F2937]"
                : props.variant === "destructive"
                ? "bg-red-100 border-red-200 text-red-900"
                : ""
            } flex items-center gap-2 py-4 px-6 rounded-lg`}
          >
            {props.variant === "default" && (
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                <FaRegCheckCircle className="h-6 w-6 text-green-500" />
              </div>
            )}
            {props.variant === "primary" && (
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                <FaInfoCircle className="h-6 w-6 text-primary" />
              </div>
            )}
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="text-sm font-semibold">
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className="text-sm text-[#4B5563]">
                  {description}
                </ToastDescription>
              )}
            </div>
            <ToastClose className="absolute right-2 top-2 rounded-md p-1 text-gray-500 opacity-100 transition-opacity hover:text-gray-900 focus:opacity-100 focus:outline-none focus:ring-2">
              <X className="h-4 w-4" />
            </ToastClose>
          </Toast>
        );
      })}
      <ToastViewport className="fixed top-0 right-0 flex flex-col-reverse p-4 gap-2 w-full md:max-w-[420px] max-h-screen z-50" />
    </ToastProvider>
  );
}
