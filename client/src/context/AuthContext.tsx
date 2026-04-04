import { jwtDecode } from "jwt-decode";
import { type JSX, createContext, useContext, useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import type { User } from "../types/user";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (token: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = (token: string): void => {
    setAccessToken(token);
    const decodedToken = jwtDecode<User>(token);
    setUser(decodedToken);
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.post("/auth/logout");
      setUser(null);
      setAccessToken(null);
    } catch (error) {
      // network error, do nothing
    }
  };

  useEffect(() => {
    const silentRefresh = async (): Promise<void> => {
      try {
        const res = await apiClient.post("/auth/refresh");
        const { token } = res.data;
        login(token);
      } catch (error) {
        // network error, do nothing
      }
    };
    silentRefresh();
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
