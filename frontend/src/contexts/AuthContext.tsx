import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import type { UserInfo, RegisterData, LoginCredentials } from "~/types/user";
import {
  getUserInfo,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
} from "~/utils/userapi";

import { useRouter } from "next/router";
import { useToast } from "~/hooks/use-toast";

export interface AuthContextType {
  user: UserInfo | null;
  login: (loginCredentials: LoginCredentials) => Promise<void>;
  register: (registerData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: () => boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getUserInfo();
        setUser(userData);
      } catch (error) {
        // Check if the error is due to unauthorized access
        if (
          error instanceof Error &&
          error.message.toLowerCase().includes("unauthorized")
        ) {
          // User is not logged in, so we'll just set the user to null
          setUser(null);
        } else {
          // Log other types of errors
          console.error("Failed to fetch user info:", error);
        }
      }
    };

    void checkAuth();
  }, []);

  const login = async (loginCredentials: LoginCredentials) => {
    try {
      const response = await apiLogin(loginCredentials);
      if (response.ok) {
        const userData = (await response.json()) as UserInfo;
        setUser(userData);
        toast({
          title: "Login successful",
          description: "You are now logged in",
        });
        await router.push("/");
      } else {
        const errorData = (await response.json()) as { message?: string };
        toast({
          variant: "destructive",
          title: "Login failed",
          description: errorData.message ?? "An error occurred",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An unexpected error occurred",
      });
    }
  };

  const register = async (registerData: RegisterData) => {
    try {
      const response = await apiRegister(registerData);
      if (response.ok) {
        const userData = (await response.json()) as UserInfo;
        setUser(userData);
        toast({
          title: "Registration successful",
          description: "You are now registered and logged in",
        });
        await router.push("/");
      } else {
        const errorData = (await response.json()) as { message?: string };
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: errorData.message ?? "An error occurred",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "An unexpected error occurred",
      });
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      setUser(null);
      toast({
        title: "Logout successful",
        description: "You have been logged out",
      });
      await router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "An unexpected error occurred",
      });
    }
  };

  const isLoggedIn = () => !!user;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
