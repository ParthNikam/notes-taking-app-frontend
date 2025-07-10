"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";


interface UserObject {
  avatar: string;
  email: string;
  name: string;
  id: string;
}

interface AuthContextType {
  user: UserObject | null;
  token: string | null;
  login: (token: string, user?: UserObject) => void;
  logout: () => void;
  loading: boolean; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserObject | null>(null);
  const [loading, setLoading] = useState(true); 

  // store and retrieve token and user 
  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false); 
  }, []);


  // Handles user login by storing the token and user info in state and localStorage
  const login = (newToken: string, userObj?: UserObject) => {
    // Update token in state
    setToken(newToken);
    // Store token in localStorage if running in the browser
    if (typeof window !== "undefined") localStorage.setItem("token", newToken);
    // If user object is provided, update user in state and localStorage
    if (userObj) {
      setUser(userObj);
      console.log("User Object: ", userObj);
      if (typeof window !== "undefined") localStorage.setItem("user", JSON.stringify(userObj));
    }

    console.log("User logged in.")
  };


  const logout = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    console.log("User logged out.")
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}


/*
  The AuthProvider component is a React context provider that manages authentication state for the app.
  - It keeps track of the user's authentication token and user info using React state (`token`, `user`).
  - On mount, it loads any existing token and user info from localStorage (if running in the browser), so users stay logged in after a refresh.
  - The `login` function updates the token and user info in both state and localStorage when a user logs in (e.g., after OAuth or manual login).
  - The `logout` function clears the token and user info from both state and localStorage, effectively logging the user out.
  - The context value (`{ user, token, login, logout }`) is provided to all child components, so any component can access the current user, token, or call login/logout.
*/
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
} 