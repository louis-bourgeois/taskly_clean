"use client";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/users/me`, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.user) {
          console.log("ress", response.data.user);
          setUser({ ...response.data.user });
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (data) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/users/login`,
        data,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        console.log("ress", response.data.user);
        setUser({ ...response.data.user[1] });
        return response;
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        status: error.response?.status || 500,
        data: { message: error.message },
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};
