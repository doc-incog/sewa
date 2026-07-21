"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Chat } from "@shared/types";
import Navbar from "@/components/Navbar";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/ui/EmptyState";
import { MessageSquare, Clock } from "lucide-react";

export default function ChatListPage() {
  const { user } = useAuth(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const { data } = await api.get("/chats");
      setChats(data.data.chats);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const getOtherUser = (chat: Chat) => {
    return chat.participants.find((p) => (typeof p === "object" ? p._id : p) !== user?._id);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-warmgray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-warmgray-900">Messages</h1>
          <p className="text-sm text-warmgray-500 mt-1">Your conversations</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-warmgray-100 overflow-hidden">
            <div className="divide-y divide-warmgray-100">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                  <div className="w-11 h-11 rounded-full shimmer-bg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 rounded shimmer-bg" />
                    <div className="h-3 w-2/3 rounded shimmer-bg" />
                  </div>
                  <div className="h-3 w-12 rounded shimmer-bg" />
                </div>
              ))}
            </div>
          </div>
        ) : chats.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-warmgray-100">
            <EmptyState
              icon={<MessageSquare className="w-7 h-7 text-warmgray-400" />}
              title="No conversations yet"
              description="Start a conversation by booking a service."
              action={{ label: "Browse Services", href: "/services" }}
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-warmgray-100 overflow-hidden">
            <div className="divide-y divide-warmgray-100">
              {chats.map((chat) => {
                const otherUser = getOtherUser(chat);
                const userData = typeof otherUser === "object" ? otherUser : null;
                const booking = chat.bookingId;
                const service =
                  typeof booking === "object" && booking?.serviceId
                    ? typeof booking.serviceId === "object"
                      ? booking.serviceId
                      : null
                    : null;

                return (
                  <Link
                    key={chat._id}
                    href={`/chat/${chat._id}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-warmgray-50/50 transition-colors"
                  >
                    <Avatar name={userData?.name || "User"} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-warmgray-900 truncate">
                          {userData?.name || "User"}
                        </p>
                        {service && (
                          <span className="text-[11px] bg-warmgray-100 text-warmgray-500 px-2 py-0.5 rounded-full font-medium">
                            {service.name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-warmgray-400 truncate mt-0.5">
                        {chat.lastMessage || "No messages yet"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="inline-flex items-center gap-1 text-[11px] text-warmgray-400">
                        <Clock className="w-3 h-3" />
                        {chat.lastMessageAt ? formatTime(chat.lastMessageAt) : ""}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
