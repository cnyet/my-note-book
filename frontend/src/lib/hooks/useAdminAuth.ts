"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AdminUser,
  clearAuth,
  getAdminUser,
  hasValidAuth,
  isAuthenticated,
} from "../admin-auth";

export function useAdminAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const hasValid = hasValidAuth();
      const currentUser = getAdminUser();

      if (hasValid && currentUser) {
        setUser(currentUser);
      } else {
        // Token expired or invalid
        clearAuth();
        setUser(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    clearAuth();
    setUser(null);
    router.push("/login"); // Redirect to global login
  };

  return {
    user,
    loading,
    isAuthenticated: hasValidAuth(),
    logout,
  };
}
