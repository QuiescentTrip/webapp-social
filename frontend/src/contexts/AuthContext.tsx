import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import type { UserInfo, RegisterData, LoginCredentials } from "~/types/user";
import type { LoginErrorResponse } from "~/types/ErrorResponse";

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
  setUser: (user: UserInfo | null) => void;
  login: (loginCredentials: LoginCredentials) => Promise<void>;
  register: (registerData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: () => boolean;
  isAdmin: () => boolean;
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
        window.location.reload();
      } else {
        const errorData = (await response.json()) as LoginErrorResponse;
        if (errorData.errors) {
          Object.entries(errorData.errors).forEach(([key, messages]) => {
            messages.forEach((message) => {
              toast({
                variant: "destructive",
                title: `${key} Error`,
                description: message,
              });
            });
          });
        } else {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: errorData.title ?? "An error occurred",
          });
        }
      }
    } catch {
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
        const errorData = (await response.json()) as LoginErrorResponse;
        Object.entries(errorData.errors).forEach(([key, messages]) => {
          messages.forEach((message) => {
            toast({
              variant: "destructive",
              title: `${key} Error`,
              description: message,
            });
          });
        });
      }
    } catch {
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
    } catch {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "An unexpected error occurred",
      });
    }
  };

  const isLoggedIn = () => !!user;

  const isAdmin = () => {
    return user?.roles?.includes("Admin") ?? false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        isLoggedIn,
        isAdmin,
      }}
    >
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
