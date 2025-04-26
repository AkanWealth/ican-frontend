// Simple implementation of a toast hook
import { useState } from "react";

type ToastProps = {
  title: string;
  description: string;
  variant?: "default" | "destructive";
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = (props: ToastProps) => {
    setToasts((prev) => [...prev, props]);
    console.log(`Toast: ${props.title} - ${props.description}`);
    // In a real implementation, this would show a toast UI
  };

  return { toast };
} 