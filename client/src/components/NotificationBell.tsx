"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/lib/api";
import { Notification } from "../../shared/types";
import { useSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/authStore";

export default function NotificationBell() {
  const { user } = useAuthStore();
  const { onNotification } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const cleanup = onNotification((notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });
    return cleanup;
  }, [onNotification]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data.data.notifications);
      setUnreadCount(data.data.unreadCount);
    } catch (error) {
      console.error("Failed to load notifications");
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read");
    }
  };

  const typeIcons: Record<string, string> = {
    booking: "📅",
    payment: "💳",
    review: "⭐",
    system: "🔔",
    chat: "💬",
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No notifications</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {notifications.slice(0, 20).map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => {
                    if (!notification.read) markAsRead(notification._id);
                    if (notification.link) window.location.href = notification.link;
                    setIsOpen(false);
                  }}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !notification.read ? "bg-primary-50" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <span className="text-lg">{typeIcons[notification.type]}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${!notification.read ? "text-gray-900" : "text-gray-600"}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{notification.message}</p>
                      <p className="text-xs text-gray-300 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
