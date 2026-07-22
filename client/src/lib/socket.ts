"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "https://sewa-backend-production.up.railway.app";

export const useSocket = () => {
  const { user } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("user:online", user._id);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  const joinChat = (chatId: string) => {
    socketRef.current?.emit("chat:join", chatId);
  };

  const sendMessage = (chatId: string, message: any) => {
    socketRef.current?.emit("chat:message", { chatId, message });
  };

  const startTyping = (chatId: string, userId: string) => {
    socketRef.current?.emit("chat:typing", { chatId, userId });
  };

  const stopTyping = (chatId: string, userId: string) => {
    socketRef.current?.emit("chat:stop-typing", { chatId, userId });
  };

  const onMessage = (callback: (message: any) => void) => {
    socketRef.current?.on("chat:message", callback);
    return () => {
      socketRef.current?.off("chat:message", callback);
    };
  };

  const onTyping = (callback: (data: { chatId: string; userId: string }) => void) => {
    socketRef.current?.on("chat:typing", callback);
    return () => {
      socketRef.current?.off("chat:typing", callback);
    };
  };

  const onStopTyping = (callback: (data: { chatId: string; userId: string }) => void) => {
    socketRef.current?.on("chat:stop-typing", callback);
    return () => {
      socketRef.current?.off("chat:stop-typing", callback);
    };
  };

  const onNotification = (callback: (notification: any) => void) => {
    socketRef.current?.on("notification:new", callback);
    return () => {
      socketRef.current?.off("notification:new", callback);
    };
  };

  return {
    socket: socketRef.current,
    isConnected,
    joinChat,
    sendMessage,
    startTyping,
    stopTyping,
    onMessage,
    onTyping,
    onStopTyping,
    onNotification,
  };
};
