"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  phone_key: string;
  image: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (token: string, user?: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
  }>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  const queryClient = useQueryClient();

  // On mount, check for existing token
  useEffect(() => {
    const token = localStorage.getItem("token") || Cookies.get("token");
    let initialUser = null;

    if (token) {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          initialUser = JSON.parse(savedUser);
        } catch {
          // Invalid JSON, ignore
        }
      }
    }

    // Wrap in setTimeout to avoid synchronous setState warning and cascading renders
    setTimeout(() => {
      setAuthState({
        isAuthenticated: !!token,
        isLoading: false,
        user: initialUser,
      });
    }, 0);
  }, []);

  const login = useCallback(
    (token: string, userData?: User) => {
      localStorage.setItem("token", token);
      Cookies.set("token", token, { expires: 7 });

      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: userData || null,
      });

      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
      }
      // Trigger profile refetch so Navbar and other components get fresh data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    [queryClient],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("resetToken");
    Cookies.remove("token");

    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });

    queryClient.clear();
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        isLoading: authState.isLoading,
        user: authState.user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
