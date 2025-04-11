import React, { useState } from "react";
import { useNotifications } from "@/app/(dashboard)/Context/NotificationContext";

const NotificationList = () => {
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
    removeNotification,
  } = useNotifications();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((notification) => !notification.read)
      : notifications;

  return (
    <div className="w-full flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
          {unreadCount} unread
        </span>
      </div>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`text-sm ${
            filter === "all" ? "font-semibold text-blue-500" : "text-gray-500"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`text-sm ${
            filter === "unread" ? "font-semibold text-blue-500" : "text-gray-500"
          }`}
        >
          Unread
        </button>
        <button
          onClick={markAllAsRead}
          className="text-sm text-blue-500 hover:underline"
        >
          Mark All as Read
        </button>
      </div>
      {filteredNotifications.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No notifications</p>
      ) : (
        <ul className="space-y-2">
          {filteredNotifications.map((notification) => (
            <li
              key={notification.id}
              className={`p-3 bg-white rounded-md shadow flex justify-between items-start ${
                !notification.read ? "border-l-4 border-blue-500" : ""
              }`}
            >
              <div>
                <h4 className="font-semibold text-sm text-blue-600">
                  {notification.message}
                </h4>
                <p className="text-xs text-gray-400">{notification.details}</p>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {notification.category}
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notification.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="relative">
                <button className="text-gray-500 hover:text-gray-700">
                  &#x22EE;
                </button>
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg">
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Mark as read
                  </button>
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;
