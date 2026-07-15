"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function useAuth(requireAuth = true, requiredRole?: string) {
  const { user, isLoading, isAuthenticated, loadUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push("/login");
      }
      if (requiredRole && user?.role !== requiredRole) {
        router.push("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, user, requireAuth, requiredRole, router]);

  return { user, isLoading, isAuthenticated };
}
