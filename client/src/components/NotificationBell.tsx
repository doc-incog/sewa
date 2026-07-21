"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/lib/api";
import { Notification } from "@shared/types";
import { useSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/authStore";
import {
  Bell,
  CalendarCheck,
  CreditCard,
  Star,
  MessageCircle,
  Info,
  Check,
} from "lucide-react";

const typeIcons: Record<string, React.ReactNode> = {
  booking: <CalendarCheck className="w-4 h-4 text-sky-500" />,
  payment: <CreditCard className="w-4 h-4 text-emerald-500" />,
  review: <Star className="w-4 h-4 text-amber-500" />,
  system: <Info className="w-4 h-4 text-warmgray-500" />,
  chat: <MessageCircle className="w-4 h-4 text-violet-500" />,
};

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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-warmgray-500 hover:text-warmgray-700 hover:bg-warmgray-100 rounded-lg transition-colors"
      >
        <Bell className="w-[18px] h-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-primary-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-warm-lg border border-warmgray-100 z-50 max-h-96 overflow-hidden animate-slide-down">
          <div className="p-4 border-b border-warmgray-100 flex items-center justify-between">
            <h3 className="font-semibold text-warmgray-900 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                <Check className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="p-8 text-center text-warmgray-400 text-sm">No notifications yet</div>
          ) : (
            <div className="overflow-y-auto max-h-80 divide-y divide-warmgray-50">
              {notifications.slice(0, 20).map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => {
                    if (!notification.read) markAsRead(notification._id);
                    if (notification.link) window.location.href = notification.link;
                    setIsOpen(false);
                  }}
                  className={`p-3.5 cursor-pointer hover:bg-warmgray-50 transition-colors ${
                    !notification.read ? "bg-primary-50/40" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-warmgray-100 flex items-center justify-center shrink-0 mt-0.5">
                      {typeIcons[notification.type] || typeIcons.system}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${!notification.read ? "font-medium text-warmgray-900" : "text-warmgray-600"}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-warmgray-400 mt-0.5 truncate">{notification.message}</p>
                      <p className="text-[11px] text-warmgray-300 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 shrink-0" />
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
