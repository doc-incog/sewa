"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Chat } from "../../../../shared/types";

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
    } catch (error) {
      console.error("Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  const getOtherUser = (chat: Chat) => {
    return chat.participants.find((p) => (typeof p === "object" ? p._id : p) !== user?._id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-4 rounded-xl animate-pulse flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : chats.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <span className="text-5xl block mb-4">💬</span>
            <p className="text-gray-500 text-lg">No conversations yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Start a conversation by booking a service
            </p>
            <Link
              href="/services"
              className="inline-block mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-50">
              {chats.map((chat) => {
                const otherUser = getOtherUser(chat);
                const userData = typeof otherUser === "object" ? otherUser : null;
                const booking = chat.bookingId;
                const service = typeof booking === "object" && booking?.serviceId
                  ? (typeof booking.serviceId === "object" ? booking.serviceId : null)
                  : null;

                return (
                  <Link
                    key={chat._id}
                    href={`/chat/${chat._id}`}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {userData?.name?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{userData?.name || "User"}</p>
                        {service && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                            {service.icon} {service.name}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 truncate mt-0.5">
                        {chat.lastMessage || "No messages yet"}
                      </p>
                    </div>
                    <span className="text-xs text-gray-300 flex-shrink-0">
                      {chat.lastMessageAt
                        ? new Date(chat.lastMessageAt).toLocaleDateString()
                        : ""}
                    </span>
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
