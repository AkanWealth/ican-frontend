'use client';
import React, { createContext, useContext, useState } from "react";

interface Notification {
  id: string;
  message: string;
  details: string;
  read: boolean;
  timestamp: string;
  category: string; // Added category property
}

interface NotificationContextProps {
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
  removeAll: () => void;
  addNotification: (notification: Notification) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

const dummyNotifications = [
  {
    id: "1",
    message: "New Feature Released",
    details: "Explore how this new tool can enhance your experience.",
    category: "General", // Example category
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: "2",
    message: "Event Registration Confirmed",
    details: "Your registration for [Event Name] has been confirmed.",
    category: "Events", // Example category
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: "3",
    message: "Payment Successful",
    details: "Thank you for your payment of $100.",
    category: "Payments", // Example category
    timestamp: new Date().toISOString(),
    read: true,
  },
  {
    id: "4",
    message: "MCPD Points Updated",
    details: "You've earned 10 MCPD points.",
    category: "MCPD Updates", 
    timestamp: new Date().toISOString(),
    read: false,
  },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const removeAll = () => {
    setNotifications([]);
  };

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllAsRead,
        markAsRead,
        removeNotification,
        removeAll,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};