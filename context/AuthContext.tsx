import { createContext, useEffect, useState } from "react";
import type { AuthContextType } from "@/types/auth.type";
import type { UserType } from "@/types/user.type";
import { getMeApi } from "@/src/api/auth.api";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        try {
          const userData = await getMeApi();
          setUser(userData);
        } catch (error) {
          console.log(error);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkToken();
  }, [token]);

  const login = (newToken: string, user: UserType) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, logout, loading, login }}>
      {children}
    </AuthContext.Provider>
  );
};
