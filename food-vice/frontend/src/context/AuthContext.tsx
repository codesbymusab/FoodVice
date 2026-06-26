import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type {
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react"

import { fetchUser as fetchUserApi, type User } from "../apis/user";



interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  fetchUser: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    
    setLoading(true);

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await fetchUserApi();
      setUser(userData);
    } catch (err) {
      console.error(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = (): AuthContextType => {

  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
