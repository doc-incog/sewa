import { create } from "zustand";
import api from "@/lib/api";
import { User } from "@shared/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  signup: (data: { name: string; email?: string; phone: string; password: string }) => Promise<void>;
  providerLogin: (identifier: string, password: string) => Promise<void>;
  providerSignup: (data: {
    name: string;
    email?: string;
    phone: string;
    password: string;
    businessName: string;
    description?: string;
  }) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (identifier, password) => {
    const { data } = await api.post("/auth/login", { identifier, password });
    localStorage.setItem("accessToken", data.data.accessToken);
    localStorage.setItem("refreshToken", data.data.refreshToken);
    set({ user: data.data.user, isAuthenticated: true });
  },

  signup: async (signupData) => {
    const { data } = await api.post("/auth/signup", signupData);
    localStorage.setItem("accessToken", data.data.accessToken);
    localStorage.setItem("refreshToken", data.data.refreshToken);
    set({ user: data.data.user, isAuthenticated: true });
  },

  providerLogin: async (identifier, password) => {
    const { data } = await api.post("/auth/login", { identifier, password });
    localStorage.setItem("accessToken", data.data.accessToken);
    localStorage.setItem("refreshToken", data.data.refreshToken);
    set({ user: data.data.user, isAuthenticated: true });
  },

  providerSignup: async (signupData) => {
    const { data } = await api.post("/auth/provider/signup", signupData);
    localStorage.setItem("accessToken", data.data.accessToken);
    localStorage.setItem("refreshToken", data.data.refreshToken);
    set({ user: data.data.user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ user: null, isAuthenticated: false });
  },

  loadUser: async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      set({ user: data.data.user, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      set({ isLoading: false });
    }
  },
}));
