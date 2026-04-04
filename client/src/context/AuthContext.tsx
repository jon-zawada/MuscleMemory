import { jwtDecode } from "jwt-decode";
import { type JSX, createContext, useContext, useEffect, useState } from "react";
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
      await fetch("http://localhost:3001/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      setAccessToken(null);
    } catch (error) {
      // network error, do nothing
    }
  };

  useEffect(() => {
    const silentRefresh = async (): Promise<void> => {
      try {
        const res = await fetch("http://localhost:3001/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) return;
        const { token } = await res.json();
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
