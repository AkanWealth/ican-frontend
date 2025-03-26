import React from "react";
import { useNotifications } from "@/app/(dashboard)/Context/NotificationContext";

const NotificationList = () => {
  const { notifications, markAllAsRead, removeAll } = useNotifications();

  return (
    <div className="w-full flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Notifications</h3>
        {notifications.length > 0 && (
          <div className="flex space-x-2">
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-500 hover:underline"
            >
              Mark all as read
            </button>
            <button
              onClick={removeAll}
              className="text-xs text-red-500 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
      {notifications.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No notifications</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li key={notification.id} className="p-3 bg-white rounded-md shadow">
              <h4 className="font-semibold text-sm">{notification.message}</h4>
              <p className="text-xs text-gray-400">{notification.details}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;
