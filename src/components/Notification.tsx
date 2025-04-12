import React from "react";
import { useNotifications } from "@/app/(dashboard)/Context/NotificationContext";

const Notification = () => {
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
    removeNotification,
  } = useNotifications();

  return (
    <div className="w-80 bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-blue-500 hover:underline text-sm"
            >
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No new notifications at the moment
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                !notification.read
                  ? "bg-blue-50 hover:bg-blue-100"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-medium text-gray-800 text-sm">
                  {notification.message}
                </h4>
                {!notification.read && (
                  <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                )}
              </div>
              <p className="text-gray-500 text-xs">{notification.details}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-400 text-xs">
                  {new Date(notification.timestamp).toLocaleString()}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(notification.id);
                  }}
                  className="text-red-500 hover:underline text-xs"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;
