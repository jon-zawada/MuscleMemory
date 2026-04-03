import { jwtDecode } from "jwt-decode";
import { type JSX, createContext, useContext, useState } from "react";
import type { User } from "../types/user";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (token: string) => void;
  logout: () => void;
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

  const logout = (): void => {
    setUser(null);
    setAccessToken(null);
  };

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
