import { createContext, useCallback, useContext, useState } from "react";

import * as authService from "@services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.loginTutor(email, password);
       setUser(data.user || (data.id ? data : { email, name: data.name }));
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password, phone, address) => {
    setIsLoading(true);
    try {
      const data = await authService.registerTutor(name, email, password, phone, address);
       setUser(data.user || (data.id ? data : { email, name }));
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
